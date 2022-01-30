import type { Task } from "@prisma/client";
import { useState, useContext, useCallback } from "react";
import { motion, PanInfo } from "framer-motion";
import { useFetcher } from "remix";
import { useMeasurePosition } from "~/hooks/useMeasurePosition";
import Hidden from "./Hidden";
import { Button } from "./Button";
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
  const { state, dispatch } = useContext(TasksContext);
  const newIds = state.tasks.map((task: Task) => task.id);

  const dragHandelRef = useMeasurePosition((pos: number) => {
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

  let localTasks = [];
  const handleSwipe = useCallback(
    (task: any, isSwiped: boolean) => {
      let swipedTask = {};
      if (i === task.position) {
        swipedTask = {
          ...task,
          isSwiped,
        };
        localTasks.push(swipedTask);
      } else if (i !== task.position) {
        swipedTask = state.tasks[task.position];
        localTasks.push(swipedTask);
      }
      // console.log(swipedTask);
      // return swipedTask;
      console.log(localTasks);
      dispatch({ type: "SET_TASKS", payload: localTasks });
    },
    [state, dispatch, i, localTasks]
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
        state.tasks.map((task: { position: number }) => {
          if (task.position === i) {
            handleSwipe(task, false);
          } else {
            handleSwipe(task, true);
          }
        });
        console.log("IGNORE");
      } else if (
        dragDistance < 0 &&
        (dragDistance < -DELETE_BTN_WIDTH * 2 ||
          (taskSwiped.isSwiped && dragDistance < -DELETE_BTN_WIDTH - 10))
      ) {
        handleDelete(taskId);
        console.log("DELETE!");
      } else if (dragDistance > -DELETE_BTN_WIDTH && taskSwiped.isSwiped) {
        state.tasks.map((task: { position: number }) => {
          if (task.position === i) {
            handleSwipe(task, false);
          } else {
            handleSwipe(task, true);
          }
        });
        console.log("RESET");
      } else if (dragDistance < 0 && dragDistance <= -DELETE_BTN_WIDTH / 3) {
        state.tasks.map((task: { position: number }) => {
          if (task.position === i) {
            handleSwipe(task, true);
          } else {
            handleSwipe(task, false);
          }
        });
        console.log("SWIPED");
      }
    },
    [state.tasks, isDragging, handleSwipe, handleDelete, task, i]
  );

  return (
    <motion.li
      exit={TASK_DELETE_ANIMATION}
      transition={TASK_DELETE_TRANSITION}
      style={taskItem}
    >
      {/* FIRST */}
      <motion.div
        ref={dragHandelRef}
        layout="position"
        style={{
          zIndex: isDragging.y ? 16 : 15,
          ...taskContainer,
        }}
        drag
        animate={{ x: task.isSwiped ? DELETE_BTN_WIDTH * -1 : 0 }}
        transition={TASK_SWIPE_TRANSITION}
        onDragEnd={(_, info) => {
          isDragging.x && handleDragEnd(info, task.id);
          isDragging.y && handleDnd(newIds);
        }}
        onViewportBoxUpdate={(_, delta) => {
          if (isDragging.y) {
            updateOrder(i, delta.y.translate);
          }
        }}
        dragConstraints={{
          top: 0.25,
          bottom: 0.25,
          left: task.isSwiped ? DELETE_BTN_WIDTH * -1 : 0,
          right: task.isSwiped ? DELETE_BTN_WIDTH : 0,
        }}
        dragElastic={isDragging.x ? 0.5 : 1}
        dragDirectionLock
        onDirectionLock={(axis) =>
          axis === "x"
            ? setIsDragging({
                x: true,
                y: false,
              })
            : setIsDragging({
                x: false,
                y: true,
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
function newTasks() {
  throw new Error("Function not implemented.");
}

function handleDelete(taskId: string) {
  throw new Error("Function not implemented.");
}

function handleSwipe(position: number, arg1: boolean) {
  throw new Error("Function not implemented.");
}
