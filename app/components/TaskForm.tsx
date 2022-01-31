import { useContext } from "react";
import { Form } from "remix";
import TaskFormInput from "./TaskFormInput";
import { Button } from "./Button";
import { RiAddLine } from "react-icons/ri";
import { BsPencil, BsSearch } from "react-icons/bs";
import Hidden from "~/components/Hidden";
import { TasksContext } from "~/state/context";

export default function TaskForm() {
  const { state, dispatch } = useContext(TasksContext);

  return !state.isSearch ? (
    <div style={taskInputWrap}>
      <Button
        className="icon-btn toggle"
        onClick={() =>
          dispatch({ type: "SET_IS_SEARCH", payload: !state.isSearch })
        }
      >
        <BsPencil />
      </Button>
      <Form
        method="post"
        onSubmit={() => dispatch({ type: "SET_VALUE", payload: "" })}
        action="/actions"
        style={{ display: "flex" }}
      >
        <Hidden name="actionName" value="create" />
        <Hidden
          name="position"
          value={state.tasks.length > 0 ? state.tasks.length : 1}
        />
        <TaskFormInput type="text" name="task-name" label="Add Task" required />
        <Button className="icon-btn" onClick={() => null}>
          <RiAddLine />
        </Button>
      </Form>
    </div>
  ) : (
    <div style={taskInputWrap}>
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
        <TaskFormInput type="search" name="search-tasks" label="Search Tasks" />
        <Button className="icon-btn">
          <RiAddLine />
        </Button>
      </Form>
    </div>
  );
}

// STYLES
const taskInputWrap = {
  display: "grid",
  margin: "0 auto 8px",
  gridTemplateColumns: "1fr 9fr",
};
