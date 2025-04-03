import { json, redirect } from "@remix-run/node";
import { Form, useActionData } from "@remix-run/react";
import { prisma } from "~/lib/prisma.server";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Button } from "~/components/ui/button";

export async function action({ request }: { request: Request }) {
  const formData = await request.formData();
  const name = formData.get("name") as string;
  const email = formData.get("email") as string;
  const role = formData.get("role") as string;

  if (!name || !email) {
    return json({ error: "All fields are required" }, { status: 400 });
  }

  try {
    await prisma.user.create({
      data: {
        name,
        email,
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
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-semibold text-center mb-6">Add New User</h1>
      <Form method="post" className="space-y-6 max-w-lg mx-auto bg-white p-6 rounded-lg shadow-lg">
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name" className="block text-lg font-medium">Name</Label>
            <Input
              id="name"
              name="name"
              type="text"
              required
              placeholder="Enter user's name"
              className="w-full px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email" className="block text-lg font-medium">Email</Label>
            <Input
              id="email"
              name="email"
              type="email"
              required
              placeholder="Enter user's email"
              className="w-full px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {actionData?.error && (
          <p className="text-sm text-red-600 text-center">{actionData.error}</p>
        )}

        <div className="flex justify-between items-center mt-6">
          <Button
            type="submit"
            className="w-full py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Create User
          </Button>
          <Button
            type="button"
            variant="outline"
            asChild
            className="w-full py-2 px-4 border border-gray-300 text-blue-600 rounded-md hover:bg-gray-100 focus:outline-none"
          >
            <a href="/users">Cancel</a>
          </Button>
        </div>
      </Form>
    </div>
  );
}
