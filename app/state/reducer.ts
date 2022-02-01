/* eslint-disable @typescript-eslint/no-explicit-any */
export function tasksReducer(state: any, action: { payload: any; type: any }) {
  const { value }: any = action.payload;
  switch (action.type) {
    case "SET_TASKS":
      return {
        ...state,
        tasks: action.payload,
      };
    case "SET_FILTER_TYPE":
      return {
        ...state,
        filterType: value,
      };
    case "SET_VALUE":
      return {
        ...state,
        value: action.payload,
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
        value: "",
        searchTerm: "",
      };
    default:
      return state;
  }
}
