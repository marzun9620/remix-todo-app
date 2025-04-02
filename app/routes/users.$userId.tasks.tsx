import { json, type LoaderFunctionArgs } from "@remix-run/node";
import { Link, useLoaderData, useParams } from "@remix-run/react";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import { prisma } from "~/lib/prisma.server";

export async function loader({ params }: LoaderFunctionArgs) {
  const userId = params.userId;

  if (!userId) {
    throw new Response("User ID is required", { status: 400 });
  }

  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        tasks: {
          orderBy: { createdAt: 'desc' }
        }
      }
    });

    if (!user) {
      throw new Response("User not found", { status: 404 });
    }

    return json({
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        tasks: user.tasks.map(task => ({
          ...task,
          createdAt: task.createdAt.toISOString(),
          updatedAt: task.updatedAt.toISOString(),
          dueDate: task.dueDate?.toISOString() || null,
        }))
      }
    });
  } catch (error) {
    console.error("Error fetching user tasks:", error);
    throw new Response("Failed to fetch user tasks", { status: 500 });
  }
}

export default function UserTasks() {
  const { user } = useLoaderData<typeof loader>();
  const params = useParams();

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">{user.name}'s Tasks</h1>
          <p className="text-sm text-muted-foreground">{user.email}</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" asChild>
            <Link to={`/users/${params.userId}/edit`}>Edit User</Link>
          </Button>
          <Button asChild>
            <Link to={`/users/${params.userId}/new/tasks`}>Add New Task</Link>
          </Button>
        </div>
      </div>

      <div className="grid gap-4">
        {user.tasks.length === 0 ? (
          <Card>
            <CardContent className="p-6 text-center">
              <p className="text-muted-foreground">No tasks assigned yet</p>
            </CardContent>
          </Card>
        ) : (
          user.tasks.map(task => (
            <Card key={task.id}>
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <h3 className="font-medium">{task.title}</h3>
                    <p className="text-sm text-muted-foreground">{task.description}</p>
                    {task.dueDate && (
                      <p className="text-sm text-muted-foreground">
                        Due: {new Date(task.dueDate).toLocaleDateString()}
                      </p>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary">{task.priority}</Badge>
                    <Badge variant={task.status === 'DONE' ? 'default' : 'secondary'}>
                      {task.status}
                    </Badge>
                  </div>
                </div>
                <div className="mt-4 flex gap-2">
                  <Button variant="outline" size="sm" asChild>
                    <Link to={`/tasks/${task.id}`}>Edit Task</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
} 