export const parseBuilder = (str) => {
  let lines = str.split("\n");
  const ref = {};
  for (let line of lines) {
    const lineData =
      /^(?<tabs>\s*)(?<name>\w*)(?<optional>\??):(?<regex>.*)/.exec(
        line
      ).groups;
    const tabs = lineData.tabs.length;
    if (!ref[tabs]) ref[tabs] = [lineData];
    else ref[tabs].push(lineData);
    if (tabs) {
      const parentRefInd = ref[tabs - 1].length - 1;
      let parent = ref[tabs - 1][parentRefInd];
      if (!parent.children) parent.children = [lineData];
      else parent.children.push(lineData);
    }
  }
  return ref[0];
};

export const buildToRegex = (build) => {
  const re = buildToRegexRecursion(build, "");
  return re;
};

const buildToRegexRecursion = (build, re) => {
  if (!build?.length) return re;
  const val = build.shift();
  if (val.name) re += `(?P<${val.name}>${val.regex}`;
  else re += `(?:${val.regex}`;
  if (val.children) re += buildToRegexRecursion(val.children, "");
  re += `${val.optional})`;

  return buildToRegexRecursion(build, re);
};
