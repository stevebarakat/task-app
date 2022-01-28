import { createContext } from "react";
import type { Task } from "@prisma/client";

interface StateProps {
  tasks: Task[];
  filterType: string;
  isSearch: boolean;
  searchTerm: string;
}

const initialState: StateProps = {
  tasks: [
    {
      id: "dfgd56",
      position: 0,
      name: "Task Zero",
      isSwiped: false,
      isCompleted: false,
    },
  ],
  filterType: "all",
  isSearch: false,
  searchTerm: "",
};

export const TasksContext = createContext(initialState);
