import { useState } from "react";

const placeholder = `Enter your variables here like below.
group1Delim:\\n
\tvar1:\\w
\tvar2:\\d
\tgroup2Delim:\\s
\t\tvar3:\\w
\t\tvar4:\\d`;

const buildToRegex = (build) => {
  const re = buildToRegexRecursion(build, "");
  return re;
};

const buildToRegexRecursion = (build, re) => {
  if (build.length === 0) return re;
  const val = build.shift();
  re += `(?P<${val.name}>${val.regex}`;
  if (val.children) re += buildToRegexRecursion(val.children, "");
  re += `${val.optional})`;

  return buildToRegexRecursion(build, re, val);
};

const parseBuilder = (str) => {
  const r = parseBuilderRegex(0);
  const m = r.exec(str);
  const vars = parseBuilderRecursion([], m, 0);
  return buildToRegex(vars);
};

const parseBuilderRecursion = (vars, pm, lvl) => {
  if (!pm) return;
  vars.push(pm.groups);
  pm.input = pm.input.split(pm[0])[1];
  if (!pm.input.trim()) {
    return vars;
  }

  // get next on this lvl
  const r = parseBuilderRegex(lvl);
  const m = r.exec(pm.input);

  // get between if there is a next on this lvl
  if (m) {
    const children = pm.input.split(m[0])[0];
    const childR = parseBuilderRegex(lvl + 1);
    const childM = childR.exec(children);
    if (childM) {
      pm.groups.children = [];
      parseBuilderRecursion(pm.groups.children, childM, lvl + 1);
    }
    return parseBuilderRecursion(vars, m, lvl);
  }
  // gap between if there is not a next on this lvl
  else {
    const childR = parseBuilderRegex(lvl + 1);
    const childM = childR.exec(pm.input);
    if (childM) {
      pm.groups.children = [];
      parseBuilderRecursion(pm.groups.children, childM, lvl + 1);
    }
    return vars;
  }

  // return this level with recursion
};

const parseBuilderRegex = (numTabs) => {
  return new RegExp(
    `^(\\t{${numTabs}})(?<name>\\w*)(?<optional>\\??):(?<regex>.*)$`,
    "gm"
  );
};

function App() {
  const [state, setState] = useState({
    valid: true,
    build: [],
  });
  const regexInputSpan = Array.from(document.querySelectorAll("span")).filter(
    (span) => span.getAttribute("role") === "presentation"
  )[0];

  return (
    <div>
      <div className="w-full">
        <div className="w-full text-lg text-center">Build Variables</div>
        <textarea
          rows="10"
          className={
            "w-full p-2 rounded-sm font-re101-input text-input" +
            (state.valid ? "" : " text-red-500")
          }
          placeholder={placeholder}
          onKeyDown={(e) => {
            switch (e.key) {
              case "Enter":
                break;
              case "Tab":
                e.preventDefault();
                const index = e.target.selectionStart;
                e.target.value =
                  e.target.value.substring(0, index) +
                  "\t" +
                  e.target.value.substring(index);
                e.target.selectionStart = e.target.selectionEnd = index + 1;
                break;
            }
          }}
          onChangeCapture={(e) => {
            state.build = [];
            setState({ ...state });
            const parseBuild = parseBuilder(e.target.value);
            regexInputSpan.focus();
            regexInputSpan.dispatchEvent(new Event("keydown", { key: "a" }));
          }}
        ></textarea>
      </div>
    </div>
  );
}

export default App;
