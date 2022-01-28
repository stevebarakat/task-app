import type { Task } from "@prisma/client";
import { useState, useContext, useCallback } from "react";
import { motion, useMotionValue, PanInfo } from "framer-motion";
import { MdDragHandle } from "react-icons/md";
import { useFetcher } from "remix";
import { useMeasurePosition } from "~/hooks/useMeasurePosition";
import Hidden from "./Hidden";
import Button from "./Button";
import { TasksContext } from "~/state/context";

const DELETE_BTN_WIDTH = 70;

const TASK_DELETE_ANIMATION = { height: 0, opacity: 0 };
const TASK_DELETE_TRANSITION = { duration: 0.25 };
const TASK_SWIPE_TRANSITION = { duration: 0.25, ease: "linear" };

export default function TaskItem({
  task,
  updatePosition,
  updateOrder,
  i,
}: any) {
  const fetcher = useFetcher();
  const [isDragging, setIsDragging] = useState({ x: false, y: false });
  const { state } = useContext(TasksContext);
  const newIds = state.tasks.map((task: Task) => task.id);

  const ref = useMeasurePosition((pos: number) => {
    updatePosition(i, pos);
  });

  const handleToggle = (event: {
    target: { value: string; checked: string };
  }) => {
    const { value, checked } = event.target;
    const task = state.tasks.find((task: { id: string }) => task.id === value);
    task.isCompleted = checked;
    fetcher.submit(
      {
        actionName: "toggle",
        id: value,
        isCompleted: checked,
      },
      { method: "post", action: "/actions", replace: true }
    );
  };

  const handleUpdate = useCallback(
    (event: { target: { id: string; value: string } }) => {
      const { id, value } = event.target;
      fetcher.submit(
        {
          actionName: "update",
          id,
          name: value,
        },
        { method: "post", action: "/actions", replace: true }
      );
    },
    [fetcher]
  );

  const handleDelete = useCallback(
    (taskId: string) => {
      fetcher.submit(
        {
          actionName: "delete",
          id: taskId,
        },
        { method: "post", action: "/actions", replace: true }
      );
    },
    [fetcher]
  );

  const handleSwipe = useCallback(
    (taskId: string, isSwiped: string) => {
      const id = taskId;
      fetcher.submit(
        {
          actionName: "swipe",
          id,
          isSwiped,
        },
        { method: "post", action: "/actions", replace: true }
      );
    },
    [fetcher]
  );

  const handleDnd = useCallback(
    (newIds: string) => {
      fetcher.submit(
        {
          actionName: "dnd",
          taskIds: newIds,
        },
        { method: "post", action: "/actions", replace: true }
      );
    },
    [fetcher]
  );

  const handleDragEnd = useCallback(
    (info: PanInfo, taskId: string) => {
      const dragDistance = isDragging.x ? info.offset.x : 0;
      const taskSwiped = state.tasks.filter(
        (task: { id: string }) => task.id === taskId
      )[0];

      if (
        dragDistance &&
        dragDistance > -DELETE_BTN_WIDTH / 3 &&
        !taskSwiped.isSwiped
      ) {
        console.log("ignore");
      } else if (
        dragDistance < 0 &&
        (dragDistance < -DELETE_BTN_WIDTH * 2 ||
          (taskSwiped.isSwiped && dragDistance < -DELETE_BTN_WIDTH - 10))
      ) {
        handleDelete(taskId);
        console.log("DELETE!");
      } else if (dragDistance > -DELETE_BTN_WIDTH && taskSwiped.isSwiped) {
        state.tasks.map((task: { id: string }) => {
          if (task.id === taskId) {
            handleSwipe(task.id, "false");
          }
          return null;
        });
        console.log("RESET");
      } else if (dragDistance < 0 && dragDistance <= -DELETE_BTN_WIDTH / 3) {
        state.tasks.map((task: { id: string }) => {
          if (task.id === taskId) {
            handleSwipe(task.id, "true");
          } else {
            handleSwipe(task.id, "false");
          }
          return null;
        });
      }
    },
    [state.tasks, isDragging.x, handleSwipe, handleDelete]
  );

  const y = useMotionValue(null);
  const x = useMotionValue(null);

  return (
    <motion.li
      exit={TASK_DELETE_ANIMATION}
      transition={TASK_DELETE_TRANSITION}
      className="task-item"
    >
      {/* FIRST */}
      <motion.div
        style={{
          x,
          zIndex: isDragging.y ? 16 : 15,
        }}
        drag="x"
        layout="position"
        animate={{ x: task.isSwiped ? DELETE_BTN_WIDTH * -1 : 0 }}
        className="task-container"
        transition={TASK_SWIPE_TRANSITION}
        onDragEnd={(_, info) => {
          handleDragEnd(info, task.id);
          if (!isDragging.x)
            setIsDragging({
              ...isDragging,
              x: false,
            });
        }}
        dragConstraints={{
          left: task.isSwiped ? DELETE_BTN_WIDTH * -1 : 0,
          right: task.isSwiped ? DELETE_BTN_WIDTH : 0,
        }}
        dragElastic={1}
        dragDirectionLock
        onDirectionLock={(axis) =>
          axis === "x"
            ? setIsDragging({
                ...isDragging,
                x: true,
              })
            : setIsDragging({
                ...isDragging,
                x: false,
              })
        }
      >
        <fetcher.Form method="post">
          <input
            type="checkbox"
            className="checkbox"
            value={task.id}
            defaultChecked={task.isCompleted}
            onChange={handleToggle}
          />
        </fetcher.Form>
        <fetcher.Form
          style={{ width: "100%" }}
          method="post"
          onChange={handleUpdate}
        >
          <Hidden name="actionName" value="update" />
          <Hidden name="id" value={task.id} />

          <div style={{ display: "flex" }}>
            <input
              name="name"
              id={task.id}
              style={
                task.isCompleted
                  ? {
                      textDecoration: "line-through 2px #ABABAB",
                    }
                  : { textDecoration: "none" }
              }
              className="inline-text-input"
              defaultValue={task.name}
              autoComplete="off"
            />
          </div>
        </fetcher.Form>
      </motion.div>

      {/* SECOND */}
      <motion.div
        ref={ref}
        layout="position"
        drag="y"
        dragElastic={0.7}
        dragConstraints={{
          top: 0,
          bottom: 0,
        }}
        onViewportBoxUpdate={(_, delta) => {
          if (isDragging.y) {
            updateOrder(i, delta.y.translate);
          }
          y.set(delta.y.translate);
        }}
        dragDirectionLock
        onDirectionLock={(axis) =>
          axis === "y"
            ? setIsDragging({
                ...isDragging,
                y: true,
              })
            : setIsDragging({
                ...isDragging,
                y: false,
              })
        }
        onDragEnd={() => {
          isDragging.y && handleDnd(newIds);
          setIsDragging({
            x: false,
            y: false,
          });
        }}
        className="drag-handle"
        style={{ x }}
      >
        <MdDragHandle />
      </motion.div>
      <Button
        className={isDragging.x ? "delete-btn" : "delete-btn hidden"}
        onClick={() => handleDelete(task.id)}
      >
        Delete
      </Button>
    </motion.li>
  );
}
