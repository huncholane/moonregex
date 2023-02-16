export const readVars = (str) => {
  let lines = str.split("\n");
  const vars = {};
  for (let i = 0; i < lines.length; i++) {
    let line = lines[i];
    let lineSplit = line.split(":==");
    if ((lineSplit.length = 2)) {
      let [name, val] = lineSplit;
      vars[name] = val;
    }
  }
  return vars;
};

const parseBuilder = (str, vars) => {
  let lines = str.split("\n");
  const ref = {};
  for (let line of lines) {
    if (!line.trim()) continue;
    const r =
      /^(?<tabs>\s*)(?<name>\w*)(?<optional>[\*\+\?]*)(?<type>[:>])(?<regex>.*)/.exec(
        line
      );
    if (!r) return "";
    const lineData = r.groups;
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
  return buildToRegex(ref[0], vars);
};

const buildToRegex = (build, vars) => {
  const re = buildToRegexRecursion(build, "", vars);
  return re;
};

const buildToRegexRecursion = (build, re, vars) => {
  if (!build?.length) return re;
  const val = build.shift();
  if (Object.keys(vars).includes(val.regex)) val.regex = vars[val.regex];
  if (val.type === ":") {
    if (val.name) re += `(?P<${val.name}>${val.regex}`;
    else re += `(?:${val.regex}`;
    if (val.children) re += buildToRegexRecursion(val.children, "");
    re += `)${val.optional}`;
  } else if (val.type === ">") {
    re += val.regex;
    if (val.children) re += buildToRegexRecursion(val.children, "");
  }

  return buildToRegexRecursion(build, re);
};

export default parseBuilder;
