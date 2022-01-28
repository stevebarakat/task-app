import { useContext } from "react";
import { Form } from "remix";
import TextInput from "./TextInput";
import Button from "./Button";
import { RiAddLine } from "react-icons/ri";
import { BsPencil, BsSearch } from "react-icons/bs";
import Hidden from "~/components/Hidden";
import { TasksContext } from "~/state/context";

export default function TaskForm() {
  const { state, dispatch } = useContext(TasksContext);

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
      <Form method="post" action="/actions" className="form-wrap">
        <Hidden name="actionName" value="create" />
        <Hidden
          name="position"
          value={state.tasks.length > 0 ? state.tasks.length : 1}
        />
        <TextInput type="text" name="task-name" label="Add Task" required />
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
      <Form method="post" action="/actions" className="form-wrap">
        <Hidden name="actionName" value="create" />
        <Hidden name="position" value={state.tasks.length} />
        <TextInput type="text" name="task-name" label="Search Tasks" required />
        <Button className="icon-btn">
          <RiAddLine />
        </Button>
      </Form>
    </div>
  );
}
