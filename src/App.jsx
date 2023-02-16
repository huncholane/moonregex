import { useState, useEffect } from "react";
import parseBuilder, { readVars } from "./builder";
import { AiFillSave } from "react-icons/ai";

const placeholder = `Enter your variables here like below.
group1Delim:\\n
\tvar1:\\w
\tvar2:\\d
\tgroup2Delim:\\s
\t\tvar3:\\w
\t\tvar4:\\d`;

function App() {
  const [valid, setValid] = useState(false);
  const [build, setBuild] = useState("");
  const [edited, setEdited] = useState(0);
  const [target, setTarget] = useState(null);
  const [save, setSave] = useState(true);
  const [hideVariables, setHideVariables] = useState(false);
  const [hideBuilder, setHideBuilder] = useState(false);
  const [varText, setVarText] = useState("");
  const [builderText, setBuilderText] = useState("");
  const regexInput = document.querySelector(
    "#regex-app > div > div.QtZzw > div > div.AUc0W > div.rjodX > div.cO83v > div.h9z_E.T886D > div > div > div:nth-child(1) > textarea"
  );
  const regexValue = document.querySelector(
    "#regex-app > div > div.QtZzw > div > div.AUc0W > div.rjodX > div.cO83v > div.h9z_E.T886D > div > div > div.CodeMirror-scroll > div.CodeMirror-sizer > div > div > div > div.CodeMirror-code"
  );
  const hideButton = (setHide, hide) => {
    return (
      <div className="absolute flex bottom-3 w-full">
        <button
          className="h-10 w-24 rounded-md mx-auto bg-blue-500 text-white"
          onClick={(e) => {
            e.preventDefault();
            setHide(!hide);
          }}
        >
          {hide ? "Show" : "Hide"}
        </button>
      </div>
    );
  };
  const variables = (
    <div className="relative">
      <textarea
        rows={hideVariables ? 2 : 10}
        className="w-full"
        onChange={(e) => {
          setVarText(e.target.value);
          const parsedVars = readVars(e.target.value);
          const parseBuild = parseBuilder(builderText, parsedVars);
          if (!parseBuild) setValid(false);
          else setValid(true);
          setBuild(parseBuild);
        }}
        onKeyDown={(e) => {
          if (e.ctrlKey && e.key == "s") {
            saveBuild();
          }
        }}
      ></textarea>
      {hideButton(setHideVariables, hideVariables)}
    </div>
  );
  const builder = (
    <div className="relative">
      <textarea
        rows={hideBuilder ? 2 : 30}
        className={
          "w-full p-2 rounded-sm font-re101-input text-input decoration-slate-500 underline" +
          (valid ? "" : " text-red-500")
        }
        placeholder={placeholder}
        spellCheck="off"
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
          if (e.ctrlKey && e.key == "s") {
            saveBuild();
          }
        }}
        onChangeCapture={(e) => {
          const parsedVars = readVars(varText);
          setBuilderText(e.target.value);
          const parseBuild = parseBuilder(e.target.value, parsedVars);
          if (!parseBuild) setValid(false);
          else setValid(true);
          setBuild(parseBuild);
          setTarget(e.target);
          setTimeout(
            () =>
              setEdited((old) => {
                return old - 1;
              }),
            1000
          );
          setEdited(edited + 1);
        }}
      ></textarea>
      {hideButton(setHideBuilder, hideBuilder)}
    </div>
  );

  const updateRegex = () => {
    if (edited !== 0 || !save) return;
    saveBuild();
  };

  useEffect(updateRegex, [edited]);

  useEffect(() => {
    if (save) saveBuild();
  }, [save]);

  return (
    <div>
      <div className="w-full">
        <div className="w-full text-lg text-center relative">
          <div>Build Variables</div>
          {variables}
          <div>Build Regex</div>
          {builder}
          <div className="absolute right-8 top-8">
            {saveButton(setSave, save)}
          </div>
        </div>
      </div>
    </div>
  );

  function saveBuild() {
    const length = regexValue.textContent.length;
    for (let i = 0; i < length; i++)
      regexInput.dispatchEvent(
        new KeyboardEvent("keydown", {
          key: "Backspace",
          code: "Backspace",
          keyCode: 8,
        })
      );
    regexInput.value = build;
    setTimeout(() => target?.focus(), 100);
  }
}

export default App;
function saveButton(setSave, save) {
  const active = "bg-blue-500 h-10 p-1 rounded-sm hover:bg-blue-100";
  const inactive = "bg-blue-100 h-10 p-1 rounded-sm hover:bg-blue-500";
  const activeSave = <AiFillSave size="100%" color="white" />;
  const inactiveSave = <AiFillSave size="100%" color="white" />;
  return (
    <button
      className={save ? active : inactive}
      onClick={(e) => {
        e.preventDefault();
        setSave(!save);
      }}
    >
      {save ? activeSave : inactiveSave}
    </button>
  );
}
