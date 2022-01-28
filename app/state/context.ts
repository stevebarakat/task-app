import { createContext } from "react";
import type { Task } from "@prisma/client";

interface StateProps {
  state: {
    tasks: Task[];
    filterType: string;
    isSearch: boolean;
    searchTerm: string;
  };
  dispatch: any;
}

const initialState: StateProps = {
  tasks: [
    {
      id: "",
      position: 0,
      name: "",
      isSwiped: false,
      isCompleted: false,
    },
  ],
  filterType: "all",
  isSearch: false,
  searchTerm: "",
};

export const TasksContext = createContext(initialState);
