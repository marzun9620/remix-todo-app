"use client"

import { Link, useLocation } from "@remix-run/react"
import { Button } from "~/components/ui/button"
import { Users, ListTodo } from "lucide-react"

export default function Navbar() {
  const location = useLocation()

  const navItems = [
    {
      name: "Tasks",
      href: "/tasks",
      icon: <ListTodo className="mr-2 h-4 w-4" />,
    },
    {
      name: "Users",
      href: "/users",
      icon: <Users className="mr-2 h-4 w-4" />,
    },
  ]

  return (
    <header className="border-b">
      <div className="container mx-auto flex h-16 items-center px-4">
        <Link to="/" className="font-bold text-xl">
          Task Manager
        </Link>
        <nav className="ml-auto flex gap-2">
          {navItems.map((item) => (
            <Button key={item.href} variant={location.pathname.startsWith(item.href) ? "default" : "ghost"} asChild>
              <Link to={item.href} className="flex items-center">
                {item.icon}
                {item.name}
              </Link>
            </Button>
          ))}
        </nav>
      </div>
    </header>
  )
}

