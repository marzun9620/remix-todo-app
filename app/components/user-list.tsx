"use client"

import { Button } from "~/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "~/components/ui/table"
import { Pencil, Trash2 } from "lucide-react"
import { Link, Form } from "@remix-run/react"
import { User } from "@prisma/client"
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card"
import { Badge } from "./ui/badge"

interface UserListProps {
  users: {
    id: string;
    name: string;
    email: string;
    role: string;
    createdAt: string;
    updatedAt: string;
    tasks: {
      id: string;
      createdAt: string;
      updatedAt: string;
      title: string;
      description: string;
      status: string;
      priority: string;
      dueDate: string | null;
      assignedToId: string | null;
    }[];
  }[]
}

export function UserList({ users }: UserListProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString()
  }

  const handleCardClick = (e: React.MouseEvent, userId: string) => {
    if ((e.target as HTMLElement).closest('button')) {
      return;
    }
    window.location.href = `/users/${userId}`;
  }

  // Function to check if user has any pending tasks
  const hasPendingTasks = (tasks: { status: string }[]) => {
    return tasks.some(task => task.status === "TODO" || task.status === "IN_PROGRESS");
  }

  // Function to get task counts by status
  const getTaskCounts = (tasks: { status: string }[]) => {
    const counts = {
      todo: 0,
      inProgress: 0,
      completed: 0,
    };

    tasks.forEach(task => {
      if (task.status === "TODO") {
        counts.todo += 1;
      } else if (task.status === "IN_PROGRESS") {
        counts.inProgress += 1;
      } else if (task.status === "COMPLETED") {
        counts.completed += 1;
      }
    });

    return counts;
  };

  return (
    <>
      {users.length === 0 ? (
        <div className="text-center p-4">
          <p className="text-muted-foreground">No users found</p>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {users.map((user) => {
            const { todo, inProgress, completed } = getTaskCounts(user.tasks);

            return (
              <Card 
                key={user.id} 
                className="hover:shadow-lg transition-shadow cursor-pointer"
                onClick={(e) => handleCardClick(e, user.id)}
              >
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span className="font-medium">{user.name}</span>
                    <Badge variant={user.role === "ADMIN" ? "destructive" : "default"}>
                      {user.role}
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <p className="text-sm text-muted-foreground">{user.email}</p>
                    <p className="text-sm">
                      Assigned tasks: {user.tasks.length}
                    </p>
                    <p className="text-sm">To Do: {todo}</p>
                    <p className="text-sm">In Progress: {inProgress}</p>
                    <p className="text-sm">Completed: {completed}</p>

                    <div className="flex gap-2 mt-4" onClick={(e) => e.stopPropagation()}>
                      <Button variant="outline" size="sm" asChild>
                        <Link to={`/users/${user.id}/edit`}>
                          Edit
                        </Link>
                      </Button>

                      {/* Prevent deletion if user has pending tasks */}
                      {!hasPendingTasks(user.tasks) ? (
                        <Form method="post" action={`/users/${user.id}/delete`}>
                          <input type="hidden" name="intent" value="delete" />
                          <Button 
                            type="submit"
                            variant="destructive" 
                            size="sm"
                          >
                            Delete
                          </Button>
                        </Form>
                      ) : (
                        <Button 
                          variant="destructive" 
                          size="sm" 
                          disabled
                        >
                          Delete (Pending Tasks)
                        </Button>
                      )}
                    </div>

                    {/* View Tasks and Add Task Buttons */}
                    <div className="flex gap-2 mt-4">
                      <Button variant="outline" size="sm" asChild>
                        <Link to={`/users/${user.id}/tasks`}>
                          View Tasks
                        </Link>
                      </Button>
                      <Button variant="outline" size="sm" asChild>
                        <Link to={`/users/${user.id}/new/tasks`}>
                          Add Task
                        </Link>
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </>
  );
}
