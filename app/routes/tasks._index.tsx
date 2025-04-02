import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { TaskBoard } from "~/components/task-board";
import { prisma } from "~/lib/prisma.server";

export async function loader() {
  const tasks = await prisma.task.findMany({
    include: {
      assignedTo: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
  return json({ tasks });
}

export default function TasksIndex() {
  const { tasks } = useLoaderData<typeof loader>();
  
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Task Board</h1>
      <TaskBoard tasks={tasks} />
    </div>
  );
} 