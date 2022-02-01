import { useContext } from "react";
import type { Task } from "@prisma/client";
import { AnimatePresence } from "framer-motion";
import TaskItem from "~/components/TaskItem";
import { usePositionReorder } from "~/hooks/usePositionReorder";
import { TasksContext } from "~/state/context";

function TaskList() {
  const { state, dispatch }: any = useContext(TasksContext);
  const FILTER_MAP = {
    all: () => true,
    todo: (task: Task) => !task.isCompleted,
    completed: (task: Task) => task.isCompleted,
    search: (task: Task) => task.name.toLowerCase().includes(state.searchTerm),
  };

  const [updatePosition, updateOrder] = usePositionReorder(
    state.tasks,
    dispatch
  );
  return (
    <ul>
      <AnimatePresence>
        {state.tasks
          ?.filter(FILTER_MAP[state.filterType])
          .filter((task: Task) =>
            task.name.toLowerCase().includes(state.searchTerm)
          )
          .map((task: Task, i: number) => (
            <TaskItem
              i={i}
              updateOrder={updateOrder}
              updatePosition={updatePosition}
              task={task}
              key={task.id}
            />
          ))}
      </AnimatePresence>
    </ul>
  );
}

export default TaskList;
