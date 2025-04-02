import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { prisma } from "~/lib/prisma.server";
import { UserList } from "~/components/user-list";

type LoaderData = {
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
  }[];
  error?: string;
};

export async function loader() {
  try {
    const users = await prisma.user.findMany({
      include: {
        tasks: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    // Convert dates to strings
    const serializedUsers = users.map(user => ({
      ...user,
      createdAt: user.createdAt.toISOString(),
      updatedAt: user.updatedAt.toISOString(),
      tasks: user.tasks.map(task => ({
        ...task,
        createdAt: task.createdAt.toISOString(),
        updatedAt: task.updatedAt.toISOString(),
        dueDate: task.dueDate?.toISOString() || null,
      })),
    }));

    // Log the data for debugging
    console.log('Loader - Users fetched:', serializedUsers);
    console.log('Loader - Number of users:', serializedUsers.length);

    return json<LoaderData>({ users: serializedUsers });
  } catch (error) {
    console.error('Error fetching users:', error);
    return json<LoaderData>({ users: [], error: 'Failed to fetch users' }, { status: 500 });
  }
}

export default function UsersIndex() {
  const { users, error } = useLoaderData<typeof loader>();
  
  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Userds</h1>
        <a
          href="/users/new"
          className="bg-primary text-primary-foreground px-4 py-2 rounded-md hover:bg-primary/90"
        >
          Add User
        </a>
      </div>
      {error ? (
        <div className="text-center p-4 text-destructive">
          <p>{error}</p>
        </div>
      ) : (
        <UserList users={users} />
      )}
    </div>
  );
} 