import { createContext } from "react";
import type { Task } from "@prisma/client";

interface StateProps {
  tasks: Task[];
  filterType: string;
  isSearch: boolean;
  searchTerm: string;
  value: string;
}

const initialState: StateProps = {
  tasks: [
    {
      id: "",
      position: 0,
      name: "",
      isCompleted: false,
      value: "",
    },
  ],
  filterType: "all",
  isSearch: false,
  searchTerm: "",
};

export const TasksContext = createContext(initialState);
