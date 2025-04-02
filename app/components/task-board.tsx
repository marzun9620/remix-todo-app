"use client"

import { useState } from "react"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "./ui/card"
import { Badge } from "./ui/badge"
import { Pencil, Trash2, MoreHorizontal } from "lucide-react"
import { Link } from "@remix-run/react"
import { DeleteTaskModal } from "./delete-task-modal"
import { ChangeStatusModal } from "./change-status-modal"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "./ui/dropdown-menu"

// Mock data - in a real app, this would come from an API
const mockTasks = [
  {
    id: "1",
    title: "Implement login page",
    description: "Create a responsive login page with validation",
    status: "TODO",
    priority: "HIGH",
    dueDate: "2023-04-10",
  },
  {
    id: "2",
    title: "Design dashboard",
    description: "Create wireframes for the main dashboard",
    status: "IN_PROGRESS",
    priority: "MEDIUM",
    dueDate: "2023-04-12",
  },
  {
    id: "3",
    title: "API integration",
    description: "Connect frontend with backend APIs",
    status: "IN_PROGRESS",
    priority: "LOW",
    dueDate: "2023-04-14",
  },
  {
    id: "4",
    title: "Write documentation",
    description: "Document the codebase and APIs",
    status: "DONE",
    priority: "HIGH",
    dueDate: "2023-04-05",
  },
]

type Status = "TODO" | "IN_PROGRESS" | "COMPLETED"

interface Task {
  id: string;
  title: string;
  description: string;
  status: Status;
  priority: string;
  dueDate?: string;
  assignedToId?: string;
}

interface TaskBoardProps {
  tasks: Task[];
}

export function TaskBoard({ tasks }: TaskBoardProps) {
  const [taskToDelete, setTaskToDelete] = useState<string | null>(null)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [taskToChangeStatus, setTaskToChangeStatus] = useState<string | null>(null)
  const [isStatusModalOpen, setIsStatusModalOpen] = useState(false)

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString()
  }

  const handleDeleteTask = (taskId: string) => {
    setTaskToDelete(taskId)
    setIsDeleteModalOpen(true)
  }

  const confirmDelete = () => {
    if (taskToDelete) {
      
      setIsDeleteModalOpen(false)
      setTaskToDelete(null)
    }
  }

  const handleChangeStatus = (taskId: string) => {
    setTaskToChangeStatus(taskId)
    setIsStatusModalOpen(true)
  }

  const confirmStatusChange = (newStatus: Status) => {
    if (taskToChangeStatus) {
      
      setIsStatusModalOpen(false)
      setTaskToChangeStatus(null)
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "HIGH":
        return "destructive"
      case "MEDIUM":
        return "secondary"
      case "LOW":
        return "outline"
      default:
        return "default"
    }
  }

  const statuses = ["TODO", "IN_PROGRESS", "COMPLETED"]

  return (
    <>
      <div className="grid gap-4 md:grid-cols-3">
        {statuses.map((status) => (
          <div key={status} className="space-y-4">
            <h2 className="text-lg font-semibold">
              {status.replace("_", " ")}
            </h2>
            <div className="space-y-4">
              {tasks
                .filter((task) => task.status === status)
                .map((task) => (
                  <Link key={task.id} to={`/tasks/${task.id}`}>
                    <Card className="hover:bg-accent">
                      <CardHeader>
                        <CardTitle className="text-base">{task.title}</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-muted-foreground">
                          {task.description}
                        </p>
                        <div className="mt-2 flex items-center gap-2">
                          <Badge variant={getPriorityColor(task.priority)}>
                            {task.priority}
                          </Badge>
                          {task.dueDate && (
                            <span className="text-xs text-muted-foreground">
                              Due: {formatDate(task.dueDate)}
                            </span>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
            </div>
          </div>
        ))}
      </div>

      <DeleteTaskModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={confirmDelete}
      />

      <ChangeStatusModal
        isOpen={isStatusModalOpen}
        onClose={() => setIsStatusModalOpen(false)}
        onConfirm={confirmStatusChange}
        currentStatus={taskToChangeStatus as Status}
      />
    </>
  )
}

