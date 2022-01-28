import type { Task } from "@prisma/client";

interface StateProps {
  tasks: Task;
  filterType: string;
  isSearch: boolean;
  searchTerm: string;
}
type Action =
  | { type: "SET_TASKS"; payload: Task }
  | { type: "SET_LOCAL_TASKS"; payload: Task }
  | { type: "SET_FILTER_TYPE"; payload: string }
  | { type: "SET_SEARCH_TERM"; payload: string }
  | { type: "SET_IS_SEARCH"; payload: boolean };

export function tasksReducer(state: StateProps, action: Action) {
  switch (action.type) {
    case "SET_TASKS":
      return {
        ...state,
        tasks: action.payload,
      };
    case "SET_LOCAL_TASKS":
      return {
        ...state,
        localTasks: action.payload,
      };
    case "SET_FILTER_TYPE":
      return {
        ...state,
        filterType: action.payload,
      };
    case "SET_SEARCH_TERM":
      return {
        ...state,
        searchTerm: action.payload,
      };
    case "SET_IS_SEARCH":
      return {
        ...state,
        isSearch: action.payload,
      };
    default:
      return state;
  }
}
