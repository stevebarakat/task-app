import { useRef } from "react";
import move from "array-move";
import { findIndex } from "~/utils/find-index";
import type { Task } from "@prisma/client";

export function usePositionReorder(tasks: Task[], dispatch: any) {
  const positions = useRef([]).current;
  const updatePosition = (i: number, offset: never) => (positions[i] = offset);

  const updateOrder = (i: number, dragOffset: number) => {
    const targetIndex = findIndex(i, dragOffset, positions);
    if (targetIndex !== i)
      dispatch({ type: "SET_TASKS", payload: move(tasks, i, targetIndex) });
  };

  return [updatePosition, updateOrder];
}
