import { useReducer, useEffect, createContext } from "react";
import { useLoaderData } from "remix";
import type { LoaderFunction } from "remix";
import { TasksContext } from "~/state/context";
import { db } from "~/utils/db.server";
import TaskForm from "~/components/TaskForm";
import TaskList from "~/components/TaskList";
import TasksFilter from "~/components/TasksFilter";
import { tasksReducer } from "~/state/reducer";

export const loader: LoaderFunction = async () => {
  const data = {
    loaderTasks: await db.task.findMany({
      orderBy: {
        position: "asc",
      },
    }),
  };
  return data;
};

export default function App() {
  const { loaderTasks } = useLoaderData();
  const initialState = {
    tasks: loaderTasks,
    filterType: "all",
    isSearch: false,
    searchTerm: "",
  };
  const [state, dispatch] = useReducer(tasksReducer, initialState);

  useEffect(() => {
    dispatch({
      type: "SET_TASKS",
      payload: loaderTasks,
    });
  }, [loaderTasks]);

  return (
    <div style={container}>
      <TasksContext.Provider value={{ state, dispatch }}>
        <TaskForm />
        <TasksFilter />
        <TaskList />
      </TasksContext.Provider>
    </div>
  );
}

// STYLES
const container = {
  maxWidth: "100%",
  padding: "28px 16px",
  border: "1px solid var(--light-gray)",
  background: "var(--primary-dark)",
};
