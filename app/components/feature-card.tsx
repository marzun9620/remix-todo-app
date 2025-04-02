import { Button } from "./ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "./ui/card"
import { LucideIcon } from "lucide-react"
import { Badge } from "./ui/badge"
import { TaskPriority, TaskStatus } from "@/types/task"

interface TaskCardProps {
  title: string
  description: string
  icon: LucideIcon
  status: TaskStatus
  priority: TaskPriority
  dueDate?: string
  assignedTo?: string
  onEdit?: () => void
  onDelete?: () => void
  onStatusChange?: () => void
}

export function TaskCard({
  title,
  description,
  icon: Icon,
  status,
  priority,
  dueDate,
  assignedTo,
  onEdit,
  onDelete,
  onStatusChange,
}: TaskCardProps) {
  const getStatusColor = (status: TaskStatus) => {
    switch (status) {
      case "TODO":
        return "bg-yellow-500"
      case "IN_PROGRESS":
        return "bg-blue-500"
      case "DONE":
        return "bg-green-500"
      default:
        return "bg-gray-500"
    }
  }

  const getPriorityColor = (priority: TaskPriority) => {
    switch (priority) {
      case "HIGH":
        return "bg-red-500"
      case "MEDIUM":
        return "bg-orange-500"
      case "LOW":
        return "bg-green-500"
      default:
        return "bg-gray-500"
    }
  }

  return (
    <Card className="w-full max-w-sm hover:shadow-lg transition-shadow">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Icon className="w-6 h-6 text-primary" />
            <CardTitle>{title}</CardTitle>
          </div>
          <div className="flex gap-2">
            <Badge className={getStatusColor(status)}>{status}</Badge>
            <Badge className={getPriorityColor(priority)}>{priority}</Badge>
          </div>
        </div>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {dueDate && (
            <p className="text-sm text-muted-foreground">
              Due: {new Date(dueDate).toLocaleDateString()}
            </p>
          )}
          {assignedTo && (
            <p className="text-sm text-muted-foreground">
              Assigned to: {assignedTo}
            </p>
          )}
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline" onClick={onEdit}>
          Edit
        </Button>
        <div className="flex gap-2">
          <Button variant="outline" onClick={onStatusChange}>
            Change Status
          </Button>
          <Button variant="destructive" onClick={onDelete}>
            Delete
          </Button>
        </div>
      </CardFooter>
    </Card>
  )
} 