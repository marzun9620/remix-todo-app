"use client"

import type React from "react"

import { useState } from "react"
import { useLocation } from "@remix-run/react"
import { Button } from "~/components/ui/button"
import { Input } from "~/components/ui/input"
import { Label } from "~/components/ui/label"
import { Textarea } from "~/components/ui/textarea"
import { Select } from "~/components/ui/select"
import { Form } from "@remix-run/react"

interface Task {
  id?: number
  title: string
  content: string
  status: "todo" | "in progress" | "finished"
  userId: number
  createdAt?: string
  updatedAt?: string
}

interface TaskFormProps {
  task?: {
    id: string
    title: string
    description: string
    status: string
    priority: string
    dueDate?: string
    assignedToId?: string
  }
  error?: string
}


const mockUsers = [
  { id: 1, name: "John Doe" },
  { id: 2, name: "Jane Smith" },
  { id: 3, name: "Bob Johnson" },
]

export function TaskForm({ task, error }: TaskFormProps) {
  const location = useLocation()
  const isEditing = location.pathname.includes("/edit")

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="title">Title</Label>
        <Input id="title" name="title" defaultValue={task?.title} required />
      </div>
      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea id="description" name="description" defaultValue={task?.description} />
      </div>
      <div className="space-y-2">
        <Label htmlFor="status">Status</Label>
        <select 
          id="status" 
          name="status" 
          defaultValue={task?.status} 
          required 
          className="w-full rounded-md border border-input bg-background px-3 py-2"
        >
          <option value="TODO">To Do</option>
          <option value="IN_PROGRESS">In Progress</option>
          <option value="COMPLETED">Completed</option>
        </select>
      </div>
      <div className="space-y-2">
        <Label htmlFor="priority">Priority</Label>
        <select 
          id="priority" 
          name="priority" 
          defaultValue={task?.priority} 
          required 
          className="w-full rounded-md border border-input bg-background px-3 py-2"
        >
          <option value="LOW">Low</option>
          <option value="MEDIUM">Medium</option>
          <option value="HIGH">High</option>
        </select>
      </div>
      <div className="space-y-2">
        <Label htmlFor="dueDate">Due Date</Label>
        <Input id="dueDate" name="dueDate" type="date" defaultValue={task?.dueDate} />
      </div>
      {error && <p className="text-sm text-destructive">{error}</p>}
      <Button type="submit">{isEditing ? "Update" : "Create"} Task</Button>
    </div>
  )
}

