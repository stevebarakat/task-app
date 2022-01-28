import type { Task } from "@prisma/client";
import { useState, useContext, useCallback } from "react";
import { motion, useMotionValue, PanInfo } from "framer-motion";
import { MdDragHandle } from "react-icons/md";
import { useFetcher } from "remix";
import { useMeasurePosition } from "~/hooks/useMeasurePosition";
import Hidden from "./Hidden";
import { Button } from "./Button/Button";
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
    task.isCompleted = checked === "checked";
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
      style={taskItem}
    >
      {/* FIRST */}
      <motion.div
        style={{
          x,
          y,
          zIndex: isDragging.y ? 16 : 15,
          ...taskContainer,
        }}
        drag="x"
        layout="position"
        animate={{ x: task.isSwiped ? DELETE_BTN_WIDTH * -1 : 0 }}
        transition={TASK_SWIPE_TRANSITION}
        onDragEnd={(_, info) => {
          handleDragEnd(info, task.id);
          if (!isDragging.x)
            setIsDragging({
              ...isDragging,
              x: false,
            });
        }}
        onViewportBoxUpdate={(_, delta) => {
          x.set(delta.x.translate);
        }}
        dragConstraints={{
          left: task.isSwiped ? DELETE_BTN_WIDTH * -1 : 0,
          right: task.isSwiped ? DELETE_BTN_WIDTH : 0,
        }}
        dragElastic={0.7}
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
              // style={
              //   task.isCompleted
              //     ? {
              //         textDecoration: "line-through 2px #ABABAB",
              //         ...inlineTextInput,
              //       }
              //     : { textDecoration: "none", ...inlineTextInput }
              // }
              style={{
                textDecoration: task.isCompleted ? "line-through" : "none",
                ...inlineTextInput,
              }}
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
        dragElastic={1}
        dragConstraints={{
          top: 0.25,
          bottom: 0.25,
        }}
        onViewportBoxUpdate={(_, delta) => {
          if (isDragging.y) {
            updateOrder(i, delta.y.translate);
          }
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
        style={{ x, ...dragHandle }}
      >
        <MdDragHandle />
      </motion.div>
      <Button
        style={isDragging.x ? deleteBtn : hidden}
        onClick={() => handleDelete(task.id)}
      >
        Delete
      </Button>
    </motion.li>
  );
}

// STYLES

const taskItem = {
  position: "relative",
  display: "flex",
  alignItems: "center",
};

const taskContainer = {
  background: "var(--primary-dark)",
  display: "flex",
  width: "100%",
  height: "52px",
  alignItems: "center",
  borderBottom: "1px solid var(--light-gray)",
};

const inlineTextInput = {
  width: "calc(100% - 35px)",
  cursor: "grab",
  outline: "none",
  background: "none",
  border: "none",
};

const dragHandle = {
  position: "absolute",
  right: "4px",
  zIndex: 20,
  cursor: "grab",
};

const deleteBtn = {
  position: "absolute",
  width: "70px",
  top: "50%",
  right: "0",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  transform: "translateY(-50%)",
  color: "white",
  fontSize: "1rem",
  background: "var(--active-color)",
  border: "none",
};

const hidden = {
  display: "none",
};
