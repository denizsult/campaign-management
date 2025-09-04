"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Menu, BarChart3, Users, Settings } from "lucide-react"
import Link from "next/link"
import { AuthButton } from "@/components/auth-button"

export function MobileNav() {
  const [open, setOpen] = useState(false)

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="sm" className="md:hidden">
          <Menu className="h-5 w-5" />
          <span className="sr-only">Toggle menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-[300px] sm:w-[400px]">
        <nav className="flex flex-col gap-4">
          <div className="flex flex-col gap-2 pt-4">
            <h2 className="text-lg font-semibold">Campaign Manager</h2>
            <p className="text-sm text-muted-foreground">Manage your campaigns</p>
          </div>

          <div className="flex flex-col gap-2 pt-4">
            <Link
              href="/dashboard"
              className="flex items-center gap-2 px-3 py-2 rounded-md hover:bg-accent transition-colors"
              onClick={() => setOpen(false)}
            >
              <BarChart3 className="h-4 w-4" />
              Dashboard
            </Link>

            <Link
              href="/dashboard"
              className="flex items-center gap-2 px-3 py-2 rounded-md hover:bg-accent transition-colors"
              onClick={() => setOpen(false)}
            >
              <Users className="h-4 w-4" />
              Influencers
            </Link>

            <Link
              href="/dashboard"
              className="flex items-center gap-2 px-3 py-2 rounded-md hover:bg-accent transition-colors"
              onClick={() => setOpen(false)}
            >
              <Settings className="h-4 w-4" />
              Settings
            </Link>
          </div>

          <div className="mt-auto pt-4 border-t">
            <AuthButton />
          </div>
        </nav>
      </SheetContent>
    </Sheet>
  )
}
