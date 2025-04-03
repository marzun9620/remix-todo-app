import { json, redirect } from "@remix-run/node";
import { Form, useLoaderData, useParams, useActionData } from "@remix-run/react";
import { TaskForm } from "~/components/task-form";
import { prisma } from "~/lib/prisma.server";

export async function loader({ params }: { params: { taskId: string } }) {
  const task = await prisma.task.findUnique({
    where: { id: params.taskId },
  });

  if (!task) {
    throw new Response("Task not found", { status: 404 });
  }

  return json({ task });
}

export async function action({ request, params }: { request: Request; params: { taskId: string } }) {
  const formData = await request.formData();
  const title = formData.get("title") as string;
  const description = formData.get("description") as string;
  const status = formData.get("status") as string;
  const priority = formData.get("priority") as string;
  const dueDate = formData.get("dueDate") as string;

  if (!title) {
    return json({ error: "Title is required" }, { status: 400 });
  }

  await prisma.task.update({
    where: { id: params.taskId },
    data: {
      title,
      description,
      status,
      priority,
      dueDate: dueDate ? new Date(dueDate) : null,
    },
  });

  return redirect(`/tasks/${params.taskId}`);
}

export default function TaskDetail() {
  const { task } = useLoaderData<typeof loader>();
  const actionData = useActionData<typeof action>();

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Edit Task</h1>
      <TaskForm task={task} error={actionData?.error} />
    </div>
  );
}
