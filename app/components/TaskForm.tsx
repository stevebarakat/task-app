import { useContext } from "react";
import { Form, useLocation } from "remix";
import TextInput from "./TextInput";
import Button from "./Button";
import { RiAddLine } from "react-icons/ri";
import { BsPencil, BsSearch } from "react-icons/bs";
import Hidden from "~/components/Hidden";
import { TasksContext } from "~/state/context";

export default function TaskForm() {
  const location = useLocation(); // resets form after submit
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
      <Form method="post" action="/actions" key={location.key}>
        <Hidden name="actionName" value="create" />
        <Hidden name="position" value={state.tasks.length} />
        <TextInput
          type="text"
          name="task-name"
          label="Add Task"
          autofocus
          required
        />
      </Form>
      <Button className="icon-btn">
        <RiAddLine />
      </Button>
    </div>
  ) : (
    <div className="task-input-wrap">
      <Button
        className="icon-btn"
        onClick={() =>
          dispatch({ type: "SET_IS_SEARCH", payload: !state.isSearch })
        }
      >
        <BsSearch />
      </Button>
      <TextInput type="text" name="search-term" label="Search Tasks" />
      <Button className="icon-btn">
        <RiAddLine />
      </Button>
    </div>
  );
}
