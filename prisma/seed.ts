import { PrismaClient } from "@prisma/client";
const db = new PrismaClient();

async function seed() {
  await Promise.all(
    getTasks().map((task) => {
      return db.task.create({ data: task });
    })
  );
}

seed();

function getTasks() {
  return [
    {
      position: 0,
      name: "Task One",
      isCompleted: false,
    },
    {
      position: 1,
      name: "Task Two",
      isCompleted: true,
    },
    {
      position: 2,
      name: "Task Three",
      isCompleted: false,
    },
    {
      position: 3,
      name: "Task Four",
      isCompleted: true,
    },
  ];
}
