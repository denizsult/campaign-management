"use client"

import { MobileNav } from "./mobile-nav"
import { AuthButton } from "@/components/auth-button"

interface PageHeaderProps {
  title: string
  description?: string
  userEmail?: string
}

export function PageHeader({ title, description, userEmail }: PageHeaderProps) {
  return (
    <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <MobileNav />
            <div>
              <h1 className="text-xl md:text-2xl font-bold text-foreground">{title}</h1>
              {description && <p className="text-sm text-muted-foreground hidden sm:block">{description}</p>}
              {userEmail && <p className="text-xs text-muted-foreground md:hidden">Welcome back</p>}
            </div>
          </div>
          <div className="hidden md:block">
            <AuthButton />
          </div>
        </div>
      </div>
    </header>
  )
}
