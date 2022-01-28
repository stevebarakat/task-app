import { useContext } from "react";
import { TasksContext } from "~/state/context";

export default function TasksFilter() {
  const { state, dispatch } = useContext(TasksContext);
  return (
    <form
      style={filterForm}
      onChange={(e) =>
        dispatch({
          type: "SET_FILTER_TYPE",
          payload: e.target as HTMLInputElement,
        })
      }
    >
      <div>
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
      <div>
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
      <div>
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

// STYLES
const filterForm = {
  display: "flex",
  justifyContent: "space-between",
  borderBottom: "1px dashed var(--light-gray)",
  padding: "4px 0 12px",
  marginBottom: "4px",
};
