import { json } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Button } from "~/components/ui/button";
import { prisma } from "~/lib/prisma.server";

type LoaderData = {
  users: {
    id: string;
    name: string;
    email: string;
    createdAt: string;
    updatedAt: string;
    tasks: {
      id: string;
      title: string;
      status: string;
      priority: string;
      dueDate: string | null;
    }[];
  }[];
  error?: string;
};

export async function loader() {
  try {
    const users = await prisma.user.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        tasks: {
          orderBy: { createdAt: 'desc' },
          select: {
            id: true,
            title: true,
            status: true,
            priority: true,
            dueDate: true,
          }
        }
      }
    });

    return json<LoaderData>({ 
      users: users.map(user => ({
        ...user,
        createdAt: user.createdAt.toISOString(),
        updatedAt: user.updatedAt.toISOString(),
        tasks: user.tasks.map(task => ({
          ...task,
          dueDate: task.dueDate?.toISOString() || null,
        }))
      }))
    });
  } catch (error) {
    console.error('Error fetching users data:', error);
    return json<LoaderData>({ users: [], error: 'Failed to fetch users data' });
  }
}

export default function Dashboard() {
  const { users, error } = useLoaderData<typeof loader>();

  const totalUsers = users.length;
  const totalTasks = users.reduce((acc, user) => acc + user.tasks.length, 0);

  return (
    <div className="container mx-auto p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-extrabold text-gray-800">Dashboard</h1>
      </div>
      
      {error && (
        <div className="mb-4 p-4 bg-red-100 text-red-800 rounded-lg">
          {error}
        </div>
      )}

      {/* Stats Cards Section */}
      <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-2">
        {/* Total Users Card */}
        <Card className="hover:shadow-xl transition-shadow rounded-lg border border-gray-200">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-gray-800">Total Users</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col justify-center items-center text-center py-6">
            <div className="text-4xl font-extrabold text-indigo-600">{totalUsers}</div>
            <Button asChild className="mt-6 bg-indigo-600 text-white hover:bg-indigo-700 rounded-lg p-2 px-4">
              <Link to="/users">View Users</Link>
            </Button>
          </CardContent>
        </Card>

        
        <Card className="hover:shadow-xl transition-shadow rounded-lg border border-gray-200">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-gray-800">Total Tasks</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col justify-center items-center text-center py-6">
            <div className="text-4xl font-extrabold text-green-600">{totalTasks}</div>
            <Button asChild className="mt-6 bg-green-600 text-white hover:bg-green-700 rounded-lg p-2 px-4">
              <Link to="/tasks">View Tasks</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
