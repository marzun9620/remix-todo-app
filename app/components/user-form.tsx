"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"

interface User {
  id?: number
  name: string
  createdAt?: string
  updatedAt?: string
}

interface UserFormProps {
  initialData?: User
}

export function UserForm({ initialData }: UserFormProps) {
  const router = useRouter()
  const { toast } = useToast()
  const [name, setName] = useState(initialData?.name || "")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!name.trim()) {
      toast({
        title: "Validation Error",
        description: "User name is required",
        variant: "destructive",
      })
      return
    }

    // In a real app, you would send this data to an API
    console.log("Saving user:", { name })

    toast({
      title: "Success",
      description: initialData ? "User updated successfully" : "User created successfully",
    })

    router.push("/users")
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="name">Name</Label>
        <Input
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Enter user name"
          required
        />
      </div>

      <div className="flex gap-2 justify-end">
        <Button type="button" variant="outline" onClick={() => router.push("/users")}>
          Cancel
        </Button>
        <Button type="submit">{initialData ? "Update User" : "Create User"}</Button>
      </div>
    </form>
  )
}

