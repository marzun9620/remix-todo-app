import { json, redirect } from "@remix-run/node"
import { Form, useLoaderData, useActionData } from "@remix-run/react"
import { prisma } from "~/lib/prisma.server"
import { Button } from "~/components/ui/button"
import { Input } from "~/components/ui/input"
import { Label } from "~/components/ui/label"

export async function loader({ params }: { params: { userId: string } }) {
  const user = await prisma.user.findUnique({
    where: { id: params.userId }
  })

  if (!user) {
    throw new Response("User not found", { status: 404 })
  }

  return json({ user })
}

export async function action({ request, params }: { request: Request, params: { userId: string } }) {
  const formData = await request.formData()
  const name = formData.get("name") as string
  const email = formData.get("email") as string

  if (!name || !email) {
    return json({ error: "Name and email are required" }, { status: 400 })
  }

  try {
    await prisma.user.update({
      where: { id: params.userId },
      data: {
        name,
        email,
      },
    })
    return redirect("/users")
  } catch (error) {
    return json({ error: "Failed to update user" }, { status: 500 })
  }
}

export default function EditUser() {
  const { user } = useLoaderData<typeof loader>()
  const actionData = useActionData<typeof action>()

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Edit User</h1>
      <Form method="post" className="space-y-4 max-w-md">
        <div className="space-y-2">
          <Label htmlFor="name">Name</Label>
          <Input id="name" name="name" defaultValue={user.name} required />
        </div>
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input id="email" name="email" type="email" defaultValue={user.email} required />
        </div>
        {actionData?.error && (
          <p className="text-sm text-destructive">{actionData.error}</p>
        )}
        <Button type="submit">Update User</Button>
      </Form>
    </div>
  )
} 