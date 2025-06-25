"use client"

import { useState, useEffect } from "react"
import { Sun, Moon, Shield } from "lucide-react"
import { Button } from "@/components/ui/button"
import { AdminLogin } from "./admin-login"
import { AdminPanel } from "./admin-panel"

export function ThemeToggle() {
  const [isDark, setIsDark] = useState(false)
  const [showAdminLogin, setShowAdminLogin] = useState(false)
  const [showAdminPanel, setShowAdminPanel] = useState(false)
  const [gameEntries, setGameEntries] = useState<
    Array<{
      id: string
      playerName: string
      difficulty: string
      moves: number
      time: number
      score: number
      completedAt: string
    }>
  >([])

  useEffect(() => {
    const saved = localStorage.getItem("theme")
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches
    const shouldBeDark = saved === "dark" || (!saved && prefersDark)

    setIsDark(shouldBeDark)
    document.documentElement.classList.toggle("dark", shouldBeDark)
  }, [])

  useEffect(() => {
    const savedEntries = localStorage.getItem("memory-game-entries")
    if (savedEntries) {
      setGameEntries(JSON.parse(savedEntries))
    }
  }, [showAdminPanel])

  const toggleTheme = () => {
    const newTheme = !isDark
    setIsDark(newTheme)
    document.documentElement.classList.toggle("dark", newTheme)
    localStorage.setItem("theme", newTheme ? "dark" : "light")
  }

  const handleAdminAccess = () => {
    setShowAdminLogin(true)
  }

  const handleAdminLogin = () => {
    setShowAdminLogin(false)
    setShowAdminPanel(true)
  }

  return (
    <>
      <div className="fixed top-4 right-4 z-50 flex gap-2">
        <Button
          onClick={toggleTheme}
          variant="outline"
          size="icon"
          className="bg-white/10 backdrop-blur-md border-white/20 text-white hover:bg-white/20"
        >
          {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
        </Button>

        <Button
          onClick={handleAdminAccess}
          variant="outline"
          size="icon"
          className="bg-white/10 backdrop-blur-md border-white/20 text-white hover:bg-white/20"
          title="Admin Access"
        >
          <Shield className="h-4 w-4" />
        </Button>
      </div>

      {showAdminLogin && <AdminLogin onLogin={handleAdminLogin} onCancel={() => setShowAdminLogin(false)} />}

      {showAdminPanel && <AdminPanel gameEntries={gameEntries} onClose={() => setShowAdminPanel(false)} />}
    </>
  )
}
