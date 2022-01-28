import { useState, useEffect, useContext } from "react";
import { TasksContext } from "~/state/context";

export default function TextInput({ type, name, required, label }: any) {
  const [value, setValue] = useState("");
  const { state, dispatch } = useContext(TasksContext);

  useEffect(() => {
    state.isSearch
      ? dispatch({ type: "SET_SEARCH_TERM", payload: value })
      : null;
  }, [value, dispatch, state.isSearch]);

  return (
    <div className="task-input-field">
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
      <label className="task-input-label" htmlFor={name}>
        {label}
      </label>
    </div>
  );
}
