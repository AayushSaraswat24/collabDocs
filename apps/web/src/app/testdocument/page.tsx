"use client"

import { ThemeToggle } from "@/components/themeToggle"

export default function TestTheme() {
  return (
    <div className="p-6">
      <div>
        <ThemeToggle />
      </div>
      <p className="text-black dark:text-white">
        Dark mode works
      </p>
    </div>
  )
}
