import { createContext } from "react";
import type { Task } from "@prisma/client";

interface StateProps {
  tasks: Task;
  localTasks: Task;
  filterType: string;
  isSearch: boolean;
  searchTerm: string;
}

const initialState: StateProps = {
  tasks: { id: "", position: 0, name: "", isSwiped: false, isCompleted: false },
  localTasks: {
    id: "",
    position: 0,
    name: "",
    isSwiped: false,
    isCompleted: false,
  },
  filterType: "all",
  isSearch: false,
  searchTerm: "",
};

export const TasksContext = createContext(initialState);
