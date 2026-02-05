"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"

export function NavbarCenter() {
  const pathname = usePathname()

  return (
    <div className="hidden md:flex items-center gap-8">
      <NavLink href="/" active={pathname === "/"}>
        Home
      </NavLink>

      <NavLink href="/docs" active={pathname.startsWith("/docs")}>
        Docs
      </NavLink>
      
      <NavLink href="/testdocument" active={pathname.startsWith("/testdocument")}>
        TestDocs
      </NavLink>
    </div>
  )
}

function NavLink({
  href,
  active,
  children,
}: {
  href: string
  active: boolean
  children: React.ReactNode
}) {
  return (
    <Link
      href={href}
      className={cn(
        "relative text-sm font-medium transition-colors",
        active
          ? "text-foreground"
          : "text-muted-foreground hover:text-foreground"
      )}
    >
      {children}
      {active && (
        <span className="absolute -bottom-1 left-0 h-0.5 w-full bg-foreground rounded-full" />
      )}
    </Link>
  )
}
