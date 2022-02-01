/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useContext } from "react";
import { TasksContext } from "~/state/context";
import { useTransition } from "remix";

export default function TaskFormInput({ type, name, required, label }: any) {
  const { state, dispatch }: any = useContext(TasksContext);
  const transition = useTransition();

  // console.log(
  //   "currentTask: ",
  //   transition.submission?.formData.get("task-name")
  // );

  useEffect(() => {
    state.isSearch
      ? dispatch({ type: "SET_SEARCH_TERM", payload: state.value })
      : null;
  }, [dispatch, state.isSearch, state.value]);

  return (
    <div style={taskInputField}>
      <input
        className="task-input"
        type={type}
        id={name}
        name={name}
        placeholder=" "
        autoComplete="off"
        value={
          state.isSearch ? state.isSeach || state.value : state.value || ""
        }
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
          dispatch({ type: "SET_VALUE", payload: e.target.value });
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
const taskInputLabel: any = {
  color: "var(--light-gray)",
  fontSize: "1rem",
  lineHeight: "1.5rem",
  fontWeight: "700",
  transition: "all 0.2s",
  touchAction: "manipulation",
  pointerEvents: "none",
};

const taskInputField: any = {
  display: "flex",
  position: "relative",
  flexGrow: "1",
  top: "0",
  width: "100%",
  height: "100%",
};
