"use client"

import React from "react"

import { Button } from "./ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog"

type Status = "TODO" | "IN_PROGRESS" | "COMPLETED"

interface ChangeStatusModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: (status: Status) => void
  currentStatus: Status
}

export function ChangeStatusModal({
  isOpen,
  onClose,
  onConfirm,
  currentStatus,
}: ChangeStatusModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Change Status</DialogTitle>
          <DialogDescription>
            Select the new status for this task.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          {["TODO", "IN_PROGRESS", "COMPLETED"].map((status) => (
            <Button
              key={status}
              variant={currentStatus === status ? "default" : "outline"}
              onClick={() => onConfirm(status as Status)}
            >
              {status.replace("_", " ")}
            </Button>
          ))}
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

