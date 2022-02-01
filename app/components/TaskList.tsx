import { useContext } from "react";
import type { Task } from "@prisma/client";
import { AnimatePresence } from "framer-motion";
import TaskItem from "~/components/TaskItem";
import { usePositionReorder } from "~/hooks/usePositionReorder";
import { TasksContext } from "~/state/context";
import { useTransition } from "remix";

function TaskList() {
  const transition = useTransition();
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

  const optimisticTasks = transition.submission
    ? [
        ...state.tasks,
        {
          ...Object.fromEntries(transition.submission.formData.entries()),
          id: (state.tasks.length + 1).toString(),
          isCompleted: false,
          position: state.tasks.length,
        } as Task,
      ]
    : state.tasks;

  console.log("optimisticTasks: ", optimisticTasks);
  console.log("transition state: ", transition.state);

  return transition.state === "submitting" || transition.state === "loading" ? (
    <ul>
      {/* <AnimatePresence> */}
      {optimisticTasks
        // ?.filter(FILTER_MAP[state.filterType])
        // .filter((task: Task) =>
        //   task.name.toLowerCase().includes(state.searchTerm)
        // )
        .map((task: Task, i: number) => (
          <TaskItem
            i={i}
            updateOrder={updateOrder}
            updatePosition={updatePosition}
            task={task}
            key={task.id}
          />
        ))}
      {/* </AnimatePresence> */}
    </ul>
  ) : (
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
