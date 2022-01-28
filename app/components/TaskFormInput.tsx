import { useState, useEffect, useContext } from "react";
import { TasksContext } from "~/state/context";

export default function TaskFormInput({ type, name, required, label }: any) {
  const [value, setValue] = useState("");
  const { state, dispatch } = useContext(TasksContext);

  useEffect(() => {
    state.isSearch
      ? dispatch({ type: "SET_SEARCH_TERM", payload: value })
      : null;
  }, [value, dispatch, state.isSearch]);

  return (
    <div style={taskInputField}>
      <input
        className="task-input"
        type={type}
        id={name}
        name={name}
        placeholder=" "
        autoComplete="off"
        value={value}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
          setValue(e.target.value);
        }}
        required={required}
      />
      <label style={taskInputLabel} htmlFor={name}>
        {label}
      </label>
    </div>
  );
}

// STYLES
const taskInputLabel = {
  color: "var(--light-gray)",
  fontSize: "1rem",
  lineHeight: "1.5rem",
  fontWeight: "700",
  transition: "all 0.2s",
  touchAction: "manipulation",
  pointerEvents: "none",
};

const taskInputField = {
  display: "flex",
  position: "relative",
  flexGrow: "1",
  top: "0",
  width: "100%",
  height: "100%",
};
