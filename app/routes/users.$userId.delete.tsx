import { redirect, type ActionFunctionArgs, json } from "@remix-run/node";
import { prisma } from "~/lib/prisma.server";
import { Form, useActionData, useNavigation } from "@remix-run/react";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "~/components/ui/alert";
import { AlertCircle, CheckCircle2 } from "lucide-react";

interface Task {
  id: string;
  title: string;
  status: string;
}

interface User {
  name: string;
  email: string;
  role: string;
  taskCount?: number;
}

interface ActionData {
  error?: string;
  user?: User;
  pendingTasks?: Task[];
}

export async function action({ params, request }: ActionFunctionArgs) {
  const userId = params.userId;
  const formData = await request.formData();
  const intent = formData.get("intent");

  if (!userId) {
    return json<ActionData>(
      { error: "User ID is required" },
      { status: 400 }
    );
  }

  try {
   
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        tasks: {
      where: {
        status: {
              in: ["IN_PROGRESS", "TO_DO"]
            }
          },
          select: {
            id: true,
            title: true,
            status: true
          }
        }
      }
    });

    if (!user) {
      return json<ActionData>(
        { error: "User not found" },
        { status: 404 }
      );
    }

    // Check for pending tasks
    if (user.tasks.length > 0) {
      return json<ActionData>(
        { 
          error: "Cannot delete user with pending tasks",
          pendingTasks: user.tasks,
          user: {
            name: user.name,
            email: user.email,
            role: user.role
          }
        },
        { status: 400 }
      );
    }

     if (intent === "delete") {
      await prisma.task.deleteMany({
        where: {
          assignedToId: userId,
          status: "COMPLETED"
        }
      });

      await prisma.user.delete({
      where: { id: userId }
    });

      return redirect("/users?message=User deleted successfully");
    }

   return json<ActionData>({
      user: {
        name: user.name,
        email: user.email,
        role: user.role,
        taskCount: user.tasks.length
      }
    });

  } catch (error) {
    console.error("Error in delete action:", error);
    return json<ActionData>(
      { error: "An error occurred while processing your request" },
      { status: 500 }
    );
  }
}

export default function DeleteUser() {
  const actionData = useActionData<typeof action>();
  const navigation = useNavigation();
  const isDeleting = navigation.state === "submitting";

  if (actionData?.error && !actionData.pendingTasks) {
    return (
      <div className="container max-w-2xl py-8">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{actionData.error}</AlertDescription>
        </Alert>
      </div>
    );
  }

  if (actionData?.pendingTasks) {
    return (
      <div className="container max-w-2xl py-8">
        <Card>
          <CardHeader>
            <CardTitle>Cannot Delete User</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Pending Tasks</AlertTitle>
                <AlertDescription>
                  This user cannot be deleted because they have pending tasks.
                </AlertDescription>
              </Alert>

              <div>
                <h3 className="font-medium mb-2">User Details</h3>
                <p className="text-sm text-muted-foreground">Name: {actionData.user?.name}</p>
                <p className="text-sm text-muted-foreground">Email: {actionData.user?.email}</p>
                <p className="text-sm text-muted-foreground">Role: {actionData.user?.role}</p>
              </div>

              <div>
                <h3 className="font-medium mb-2">Pending Tasks</h3>
                <ul className="list-disc list-inside space-y-1">
                  {actionData.pendingTasks.map(task => (
                    <li key={task.id} className="text-sm text-muted-foreground">
                      {task.title} ({task.status})
                    </li>
                  ))}
                </ul>
              </div>

              <div className="flex gap-2">
                <Button variant="outline" asChild>
                  <a href="/users">Back to Users</a>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container max-w-2xl py-8">
      <Card>
        <CardHeader>
          <CardTitle>Delete User</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {actionData?.user && (
              <div>
                <h3 className="font-medium">User Detailws</h3>
                <p className="text-sm text-muted-foreground">Name: {actionData.user.name}</p>
                <p className="text-sm text-muted-foreground">Email: {actionData.user.email}</p>
                <p className="text-sm text-muted-foreground">Role: {actionData.user.role}</p>
                <p className="text-sm text-muted-foreground">Total Tasks: {actionData.user.taskCount}</p>
              </div>
            )}

            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Warning</AlertTitle>
              <AlertDescription>
                This action cannot be undone. All user data and completed tasks will be permanently deleted.
              </AlertDescription>
            </Alert>

            <Form method="post" className="flex gap-2">
              <input type="hidden" name="intent" value="delete" />
              <Button variant="outline" asChild>
                <a href="/users">Cancel</a>
              </Button>
              <Button 
                type="submit" 
                variant="destructive"
                disabled={isDeleting}
              >
                {isDeleting ? "Deleting..." : "Delete User"}
              </Button>
            </Form>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 