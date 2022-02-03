/* eslint-disable @typescript-eslint/no-explicit-any */
import { useContext, useRef, useEffect } from "react";
import { Form, useTransition } from "remix";
import TaskFormInput from "./TaskFormInput";
import { Button } from "./Button";
import { RiAddLine } from "react-icons/ri";
import { BsPencil, BsSearch } from "react-icons/bs";
import Hidden from "~/components/Hidden";
import { TasksContext } from "~/state/context";

export default function TaskForm() {
  const formRef: any = useRef();
  const { state, dispatch }: any = useContext(TasksContext);
  const transition = useTransition();
  const isPending =
    transition.state === "submitting" || transition.state == "loading"
      ? true
      : false;

  useEffect(() => {
    if (isPending || !state.isSearch) {
      formRef.current?.reset();
    }
  }, [isPending, state.isSearch]);

  return !state.isSearch ? (
    <div className="task-input-wrap">
      <Button
        className="icon-btn toggle"
        onClick={() =>
          dispatch({ type: "SET_IS_SEARCH", payload: !state.isSearch })
        }
      >
        <BsPencil />
      </Button>
      <Form
        ref={formRef}
        replace
        method="post"
        onSubmit={() => {
          dispatch({ type: "SET_VALUE", payload: "" });
        }}
        action="/actions"
        style={{ display: "flex" }}
      >
        <Hidden name="actionName" value="create" />
        <Hidden
          name="position"
          value={state.tasks.length > 0 ? state.tasks.length + 1 : 1}
        />
        <TaskFormInput
          type="text"
          name="task-name"
          label={isPending ? "Saving..." : "Add Task"}
          disabled={isPending}
          required
        />
        <Button className="icon-btn">
          <RiAddLine />
        </Button>
      </Form>
    </div>
  ) : (
    <div className="task-input-wrap">
      <Button
        className="icon-btn toggle"
        onClick={() =>
          dispatch({ type: "SET_IS_SEARCH", payload: !state.isSearch })
        }
      >
        <BsSearch />
      </Button>
      <Form method="post" action="/actions" style={{ display: "flex" }}>
        <Hidden name="actionName" value="create" />
        <Hidden name="position" value={state.tasks.length} />
        <TaskFormInput
          type="search"
          name="search-tasks"
          value={typeof state.value !== undefined ? state.value : ""}
          label="Search Tasks"
          disabled={isPending}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
            dispatch({ type: "SET_VALUE", payload: e.target.value });
          }}
        />
        <Button disabled={true} className="icon-btn">
          <RiAddLine />
        </Button>
      </Form>
    </div>
  );
}
