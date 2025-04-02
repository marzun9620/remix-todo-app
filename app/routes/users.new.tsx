import { json, redirect } from "@remix-run/node";
import { Form, useActionData } from "@remix-run/react";
import { prisma } from "~/lib/prisma.server";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Button } from "~/components/ui/button";
import { Select } from "~/components/ui/select";

export async function action({ request }: { request: Request }) {
  const formData = await request.formData();
  const name = formData.get("name") as string;
  const email = formData.get("email") as string;
  const role = formData.get("role") as string;

  if (!name || !email || !role) {
    return json({ error: "All fields are required" }, { status: 400 });
  }

  try {
    await prisma.user.create({
      data: {
        name,
        email,
        role,
      },
    });
    return redirect("/users");
  } catch (error) {
    return json({ error: "Failed to create user" }, { status: 500 });
  }
}

export default function NewUser() {
  const actionData = useActionData<typeof action>();

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Add New User</h1>
      <Form method="post" className="space-y-4 max-w-md">
        <div className="space-y-2">
          <Label htmlFor="name">Name</Label>
          <Input
            id="name"
            name="name"
            type="text"
            required
            placeholder="Enter user's name"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            name="email"
            type="email"
            required
            placeholder="Enter user's email"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="role">Role</Label>
          <Select name="role" required>
            <option value="">Select a role</option>
            <option value="USER">User</option>
            <option value="ADMIN">Admin</option>
          </Select>
        </div>
        {actionData?.error && (
          <p className="text-sm text-destructive">{actionData.error}</p>
        )}
        <div className="flex gap-2">
          <Button type="submit">Create User</Button>
          <Button type="button" variant="outline" asChild>
            <a href="/users">Cancel</a>
          </Button>
        </div>
      </Form>
    </div>
  );
} 