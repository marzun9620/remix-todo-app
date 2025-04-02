import { json, redirect } from "@remix-run/node";
import { Form, useActionData } from "@remix-run/react";
import { TaskForm } from "~/components/task-form";
import { prisma } from "~/lib/prisma.server";

export async function action({ request }: { request: Request }) {
  const formData = await request.formData();
  const title = formData.get("title") as string;
  const description = formData.get("description") as string;
  const status = formData.get("status") as string;
  const priority = formData.get("priority") as string;
  const dueDate = formData.get("dueDate") as string;

  if (!title) {
    return json({ error: "Title is required" }, { status: 400 });
  }

  await prisma.task.create({
    data: {
      title,
      description,
      status,
      priority,
      dueDate: dueDate ? new Date(dueDate) : null,
    },
  });

  return redirect("/tasks");
}

export default function NewTask() {
  const actionData = useActionData<typeof action>();

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Create New Task</h1>
      <TaskForm error={actionData?.error} />
    </div>
  );
} 