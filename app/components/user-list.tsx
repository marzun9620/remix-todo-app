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

  return (
    <>
      {users.length === 0 ? (
        <div className="text-center p-4">
          <p className="text-muted-foreground">No users found</p>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {users.map((user) => (
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
                  <div className="flex gap-2 mt-4" onClick={(e) => e.stopPropagation()}>
                    <Button variant="outline" size="sm" asChild>
                      <Link to={`/users/${user.id}/edit`}>
                        Edit
                      </Link>
                    </Button>
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
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </>
  )
}

