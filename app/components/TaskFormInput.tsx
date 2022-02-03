/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useContext, useRef } from "react";
import { TasksContext } from "~/state/context";
import { Form, useTransition } from "remix";

export default function TaskFormInput({
  type,
  name,
  value,
  required,
  label,
  disabled,
  onChange,
}: any) {
  const { state, dispatch }: any = useContext(TasksContext);
  const transition = useTransition();
  const addTaskRef: any = useRef();
  const isPending =
    transition.state === "submitting" || transition.state == "loading"
      ? true
      : false;

  console.log(isPending);

  useEffect(() => {
    state.isSearch &&
      dispatch({ type: "SET_SEARCH_TERM", payload: state.value });
  }, [dispatch, state.isSearch, state.value]);

  useEffect(() => {
    if (!isPending) {
      // setTimeout(() => !isPending && addTaskRef.current.focus(), 500);
      addTaskRef.current.focus();
    }
  }, [isPending]);

  return (
    <div style={taskInputField}>
      <input
        ref={addTaskRef}
        className="task-input"
        type={type}
        id={name}
        name={name}
        placeholder=" "
        autoComplete="off"
        // value={
        //   state.isSearch ? state.isSeach || state.value : state.value || ""
        // }
        value={value}
        onChange={onChange}
        required={required}
        disabled={disabled}
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
