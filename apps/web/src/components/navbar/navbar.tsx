"use client"

import { NavbarLeft } from "./navbarLeft"
import { NavbarCenter } from "./navbarCenter"
import { NavbarRight } from "./navbarRight"
import { MobileMenu } from "./mobileMenu"
import { useState } from "react"

export function Navbar() {
  const [open, setOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 h-14 border-b bg-background">
      <nav className="mx-auto flex h-full max-w-7xl items-center px-4">
 
        <NavbarLeft />

        {/* CENTER (desktop nav) */}
        <div className="flex-1 flex justify-center">
          <NavbarCenter />
        </div>

       
        <div className="flex items-center gap-2">
          <NavbarRight />

          {/* Hamburger */}
          <button
            onClick={() => setOpen(true)}
            className="md:hidden p-2 rounded-md hover:bg-accent"
          >
            ☰
          </button>
        </div>
      </nav>

      {open && <MobileMenu onClose={() => setOpen(false)} />}
    </header>
  )
}
