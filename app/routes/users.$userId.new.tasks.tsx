import { json, redirect, type LoaderFunctionArgs, type ActionFunctionArgs } from "@remix-run/node";
import { Form, useLoaderData, useParams, useNavigation, useActionData } from "@remix-run/react";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Textarea } from "~/components/ui/textarea";
import { Button } from "~/components/ui/button";
import { prisma } from "~/lib/prisma.server";
import { Alert, AlertDescription } from "~/components/ui/alert";

export async function loader({ params }: LoaderFunctionArgs) {
  const userId = params.userId;
  if (!userId) throw new Response("User ID is required", { status: 400 });

  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: { tasks: { orderBy: { createdAt: 'desc' }, take: 5 } }
    });
    if (!user) throw new Response("User not found", { status: 404 });

    return json({
      user: {
        ...user,
        tasks: user.tasks.map(task => ({
          ...task,
          createdAt: task.createdAt.toISOString(),
          updatedAt: task.updatedAt.toISOString(),
          dueDate: task.dueDate?.toISOString() || null,
        }))
      }
    });
  } catch (error) {
    console.error("Error fetching user:", error);
    throw new Response("Failed to fetch user", { status: 500 });
  }
}

export async function action({ request, params }: ActionFunctionArgs) {
  const userId = params.userId;
  if (!userId) throw new Response("User ID is required", { status: 400 });

  try {
    const formData = await request.formData();
    const title = formData.get("title") as string;
    const description = formData.get("description") as string;
    const priority = formData.get("priority") as string;
    const dueDate = formData.get("dueDate") as string;

    if (!title) return json({ error: "Title is required" }, { status: 400 });
    if (!priority) return json({ error: "Priority is required" }, { status: 400 });

    await prisma.task.create({
      data: {
        title,
        description,
        priority,
        status: "TODO",
        dueDate: dueDate ? new Date(dueDate) : null,
        assignedToId: userId
      }
    });

    return redirect(`/users/${userId}/tasks`);
  } catch (error) {
    console.error("Error creating task:", error);
    return json({ error: "Failed to create task" }, { status: 500 });
  }
}

export default function NewTask() {
  const { user } = useLoaderData<typeof loader>();
  const params = useParams();
  const navigation = useNavigation();
  const actionData = useActionData<typeof action>();
  const isSubmitting = navigation.state === "submitting";

  return (
    <div className="container mx-auto p-6 flex justify-center items-center min-h-screen">
      <Card className="w-full max-w-lg shadow-lg rounded-xl border border-gray-200">
        <CardHeader className="bg-gray-100 p-4 rounded-t-xl text-center">
          <CardTitle className="text-lg font-semibold">Add New Task for {user.name}</CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          {actionData?.error && (
            <Alert variant="destructive" className="mb-4">
              <AlertDescription>{actionData.error}</AlertDescription>
            </Alert>
          )}

          <Form method="post" className="space-y-5">
            <div>
              <Label htmlFor="title">Title</Label>
              <Input id="title" name="title" required disabled={isSubmitting} placeholder="Enter task title" className="rounded-lg shadow-sm" />
            </div>

            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea id="description" name="description" disabled={isSubmitting} placeholder="Enter task description" className="rounded-lg shadow-sm" />
            </div>

            <div>
              <Label htmlFor="priority">Priority</Label>
              <select id="priority" name="priority" defaultValue="MEDIUM" disabled={isSubmitting} className="bg-gray-200 w-full p-2 border rounded-lg shadow-sm">
                <option value="LOW">Low</option>
                <option value="MEDIUM">Medium</option>
                <option value="HIGH">High</option>
              </select>
            </div>

            <div>
              <Label htmlFor="status">Status</Label>
              <Input id="status" name="status" value="TODO" readOnly className="bg-gray-200 text-gray-700 cursor-not-allowed rounded-lg shadow-sm" />
            </div>

            <div>
              <Label htmlFor="dueDate">Due Date</Label>
              <Input id="dueDate" name="dueDate" type="date" disabled={isSubmitting} min={new Date().toISOString().split('T')[0]} className="rounded-lg shadow-sm" />
            </div>

            <div className="flex gap-3 justify-between">
              <Button type="submit" disabled={isSubmitting} className="w-full rounded-lg shadow-md">
                {isSubmitting ? "Creating..." : "Create Task"}
              </Button>
              <Button type="button" variant="outline" asChild disabled={isSubmitting} className="w-full rounded-lg shadow-md">
                <a href={`/users/${params.userId}/tasks`}>Cancel</a>
              </Button>
            </div>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
