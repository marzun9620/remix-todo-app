import { json } from "@remix-run/node";
import { Form, Link, useLoaderData } from "@remix-run/react";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import { prisma } from "~/lib/prisma.server";

type LoaderData = {
  users: {
    id: string;
    name: string;
    email: string;
    role: string;
    createdAt: string;
    updatedAt: string;
    tasks: {
      id: string;
      title: string;
      status: string;
      priority: string;
      dueDate: string | null;
    }[];
  }[];
  error?: string;
};

export async function loader() {
  try {
    const users = await prisma.user.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        tasks: {
          orderBy: { createdAt: 'desc' },
          select: {
            id: true,
            title: true,
            status: true,
            priority: true,
            dueDate: true,
          }
        }
      }
    });

    return json<LoaderData>({ 
      users: users.map(user => ({
        ...user,
        createdAt: user.createdAt.toISOString(),
        updatedAt: user.updatedAt.toISOString(),
        tasks: user.tasks.map(task => ({
          ...task,
          dueDate: task.dueDate?.toISOString() || null,
        }))
      }))
    });
  } catch (error) {
    console.error('Error fetching users data:', error);
    return json<LoaderData>({ users: [], error: 'Failed to fetch users data' });
  }
}

export default function Dashboard() {
  const { users, error } = useLoaderData<typeof loader>();

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Users Dashboard</h1>
        <Button asChild>
          <Link to="/users/new">Add New User</Link>
        </Button>
      </div>
      
      {error && (
        <div className="mb-4 p-4 bg-destructive/10 text-destructive rounded-md">
          {error}
        </div>
      )}
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {users.map((user) => (
          <Card key={user.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">{user.name}</CardTitle>
                <Badge variant={user.role === 'ADMIN' ? 'destructive' : 'default'}>
                  {user.role}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-muted-foreground">{user.email}</p>
                  <p className="text-sm text-muted-foreground">
                    Tasks: {user.tasks.length}
                  </p>
                </div>

                {user.tasks.length > 0 && (
                  <div>
                    <h3 className="text-sm font-medium mb-2">Recent Tasks</h3>
                    <div className="space-y-2">
                      {user.tasks.slice(0, 3).map(task => (
                        <div key={task.id} className="text-sm">
                          <div className="flex items-center justify-between">
                            <span className="truncate">{task.title}</span>
                            <Badge variant="secondary" className="ml-2">
                              {task.status}
                            </Badge>
                          </div>
                          {task.dueDate && (
                            <p className="text-xs text-muted-foreground">
                              Due: {new Date(task.dueDate).toLocaleDateString()}
                            </p>
                          )}
                        </div>
                      ))}
                      {user.tasks.length > 3 && (
                        <p className="text-xs text-muted-foreground">
                          +{user.tasks.length - 3} more tasks
                        </p>
                      )}
                    </div>
                  </div>
                )}

                <div className="flex gap-2 pt-2">
                  <Button variant="outline" size="sm" asChild>
                    <Link to={`/users/${user.id}/edit`}>Edit</Link>
                  </Button>
                  <Button variant="outline" size="sm" asChild>
                    <Link to={`/users/${user.id}/tasks`}>View Tasks</Link>
                  </Button>
                  <Button variant="outline" size="sm" asChild>
                    <Link to={`/users/${user.id}/new/tasks`}>Add Task</Link>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
