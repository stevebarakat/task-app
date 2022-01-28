import { useContext } from "react";
import { TasksContext } from "~/state/context";

export default function TasksFilter() {
  const { state, dispatch } = useContext(TasksContext);
  return (
    <form
      className="filter-form"
      onChange={(e) =>
        dispatch({ type: "SET_FILTER_TYPE", payload: e.target.value })
      }
    >
      <div className="option-wrap">
        <label htmlFor="all">
          <input
            className="radio-button"
            id="all"
            name="filtered-tasks"
            type="radio"
            value="all"
            defaultChecked={state.filterType === "all"}
          />
          All
        </label>
      </div>
      <div className="option-wrap">
        <label htmlFor="todo">
          <input
            className="radio-button"
            id="todo"
            name="filtered-tasks"
            type="radio"
            value="todo"
            defaultChecked={state.filterType === "todo"}
          />
          To Do
        </label>
      </div>
      <div className="option-wrap">
        <label htmlFor="completed">
          <input
            className="radio-button"
            id="completed"
            name="filtered-tasks"
            type="radio"
            value="completed"
            defaultChecked={state.filterType === "completed"}
          />
          Completed
        </label>
      </div>
    </form>
  );
}
