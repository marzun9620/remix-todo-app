"use client"

import { Link } from "@remix-run/react"
import { Button } from "~/components/ui/button"
import { Users } from "lucide-react"

export default function Navbar() {
  return (
    <header className="border-b bg-blue-900 text-white">
      <div className="container mx-auto flex h-16 items-center px-4">
        <Link to="/" className="font-bold text-xl">
          Task Manager
        </Link>
        <div className="ml-auto flex items-center space-x-4">
          <Link to="/">
            <Button variant="outline" size="sm" className="text-black border-white hover:bg-gray-800">
              Back
            </Button>
          </Link>
        </div>
      </div>
    </header>
  )
}
