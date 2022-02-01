/* eslint-disable @typescript-eslint/no-explicit-any */
import { useContext } from "react";
import { Form, useTransition } from "remix";
import { motion, AnimatePresence } from "framer-motion";
import TaskFormInput from "./TaskFormInput";
import { Button } from "./Button";
import { RiAddLine } from "react-icons/ri";
import { BsPencil, BsSearch } from "react-icons/bs";
import Hidden from "~/components/Hidden";
import { TasksContext } from "~/state/context";
import { v4 as uuidv4 } from "uuid";

const XMLHttpRequest = require("xhr2");

function measureBW(count, callback) {
  if (typeof window === undefined) return;
  let start = new Date().getTime();
  let bandwidth;
  let i = 0;
  (function record() {
    const request = new XMLHttpRequest();
    request.open(
      "GET",
      "http://upload.wikimedia.org/wikipedia/commons/5/51/Google.png",
      true
    );
    request.onreadystatechange = function () {
      if (request.readyState === 4) {
        const x = new Date().getTime() - start;
        const bw = Number(238 / (x / 1000));
        bandwidth = ((bandwidth || bw) + bw) / 2;
        i++;
        if (i < count) {
          start = new Date().getTime();
          record();
        } else callback(bandwidth.toFixed(0));
      }
    };
    request.send(null);
  })();
}

measureBW(10, function (result) {
  console.log(parseInt(result, 10));
});

export default function TaskForm() {
  const { state, dispatch }: any = useContext(TasksContext);
  const transition = useTransition();

  const pendingTasks =
    transition.state === "submitting" || transition.state == "loading"
      ? true
      : false;

  console.log("pendingTasks", transition.state);

  return !state.isSearch ? (
    <div style={{ position: "relative" }}>
      <motion.div
        style={
          pendingTasks
            ? { transform: "translateY(-20px)", ...badge }
            : { transform: "translateY(0)", ...badge }
        }
      >
        {pendingTasks} Saving...
      </motion.div>
      <div style={taskInputWrap}>
        <Button
          className="icon-btn toggle"
          onClick={() =>
            dispatch({ type: "SET_IS_SEARCH", payload: !state.isSearch })
          }
        >
          <BsPencil />
        </Button>
        <Form
          method="post"
          onSubmit={() => {
            dispatch({ type: "SET_VALUE", payload: "" });
          }}
          action="/actions"
          style={{ display: "flex" }}
        >
          <Hidden name="actionName" value="create" />
          <Hidden
            name="position"
            value={state.tasks.length > 0 ? state.tasks.length + 1 : 1}
          />
          <TaskFormInput
            type="text"
            name="task-name"
            label="Add Task"
            required
          />
          <Button className="icon-btn" onClick={() => null}>
            <RiAddLine />
          </Button>
        </Form>
      </div>
    </div>
  ) : (
    <div style={taskInputWrap}>
      <Button
        className="icon-btn toggle"
        onClick={() =>
          dispatch({ type: "SET_IS_SEARCH", payload: !state.isSearch })
        }
      >
        <BsSearch />
      </Button>
      <Form method="post" action="/actions" style={{ display: "flex" }}>
        <Hidden name="actionName" value="create" />
        <Hidden name="position" value={state.tasks.length} />
        <TaskFormInput type="search" name="search-tasks" label="Search Tasks" />
        <Button disabled={true} className="icon-btn">
          <RiAddLine />
        </Button>
      </Form>
    </div>
  );
}

// STYLES
const taskInputWrap = {
  display: "grid",
  margin: "0 auto 8px",
  gridTemplateColumns: "1fr 9fr",
};

const badge = {
  zIndex: 0,
  position: "absolute",
  top: 0,
  fontSize: "0.75rem",
  lineHeight: 1.25,
  textTransform: "capitalize",
  fontWeight: 700,
  border: "1px solid var(--light-gray)",
  width: "55px",
  padding: "2px 0",
  textAlign: "center",
  transition: "all 0.5s",
};
