import { json, type LoaderFunctionArgs } from "@remix-run/node"
import { prisma } from "~/lib/prisma.server"

export async function loader({ params }: LoaderFunctionArgs) {
  const userId = params.userId

  if (!userId) {
    return json({ canDelete: false, message: "User ID is required" })
  }

  try {
    
    const tasks = await prisma.task.findMany({
      where: {
        assignedToId: userId,
      },
      select: {
        status: true,
      },
    })

    
    const pendingTasks = tasks.filter(
      task => task.status === "IN_PROGRESS" || task.status === "TO_DO"
    )

    if (pendingTasks.length > 0) {
      return json({
        canDelete: false,
        message: `Cannot delete user. They have ${pendingTasks.length} pending tasks (in progress or to do). Please reassign or complete these tasks first.`,
        pendingTasks: pendingTasks.length
      })
    }

    return json({
      canDelete: true,
      message: "Are you sure you want to delete this user? This action cannot be undone."
    })
  } catch (error) {
    console.error("Error checking task status:", error)
    return json({
      canDelete: false,
      message: "An error occurred while checking task status."
    })
  }
} 