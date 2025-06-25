"use client"

import { useState } from "react"
import { Shield, Users, Trophy, Clock, Move, Calendar, X, Download } from "lucide-react"
import { Button } from "@/components/ui/button"

type GameEntry = {
  id: string
  playerName: string
  difficulty: string
  moves: number
  time: number
  score: number
  completedAt: string
}

type AdminPanelProps = {
  gameEntries: GameEntry[]
  onClose: () => void
}

export function AdminPanel({ gameEntries, onClose }: AdminPanelProps) {
  const [sortBy, setSortBy] = useState<keyof GameEntry>("completedAt")
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc")

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  const formatDate = (isoString: string) => {
    return new Date(isoString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const exportData = () => {
    const csvContent = [
      ["Player Name", "Difficulty", "Moves", "Time", "Score", "Completed At"],
      ...gameEntries.map((entry) => [
        entry.playerName,
        entry.difficulty,
        entry.moves.toString(),
        formatTime(entry.time),
        entry.score.toString(),
        formatDate(entry.completedAt),
      ]),
    ]
      .map((row) => row.join(","))
      .join("\n")

    const blob = new Blob([csvContent], { type: "text/csv" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `match-the-emoji-data-${new Date().toISOString().split("T")[0]}.csv`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const sortedEntries = [...gameEntries].sort((a, b) => {
    const aVal = a[sortBy]
    const bVal = b[sortBy]

    if (typeof aVal === "string" && typeof bVal === "string") {
      return sortOrder === "asc" ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal)
    }

    if (typeof aVal === "number" && typeof bVal === "number") {
      return sortOrder === "asc" ? aVal - bVal : bVal - aVal
    }

    return 0
  })

  const handleSort = (field: keyof GameEntry) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc")
    } else {
      setSortBy(field)
      setSortOrder("desc")
    }
  }

  const stats = {
    totalGames: gameEntries.length,
    uniquePlayers: new Set(gameEntries.map((entry) => entry.playerName)).size,
    averageScore:
      gameEntries.length > 0
        ? Math.round(gameEntries.reduce((sum, entry) => sum + entry.score, 0) / gameEntries.length)
        : 0,
    bestScore: gameEntries.length > 0 ? Math.max(...gameEntries.map((entry) => entry.score)) : 0,
    averageMoves:
      gameEntries.length > 0
        ? Math.round(gameEntries.reduce((sum, entry) => sum + entry.moves, 0) / gameEntries.length)
        : 0,
    averageTime:
      gameEntries.length > 0
        ? Math.round(gameEntries.reduce((sum, entry) => sum + entry.time, 0) / gameEntries.length)
        : 0,
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white dark:bg-gray-900 rounded-3xl w-full max-w-7xl max-h-[90vh] shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-500 to-indigo-600 p-6 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Shield className="w-8 h-8" />
              <div>
                <h2 className="text-2xl font-bold">Match the Emoji - Admin Panel</h2>
                <p className="text-blue-100">Game Statistics & Player Data</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {gameEntries.length > 0 && (
                <Button onClick={exportData} variant="ghost" size="sm" className="text-white hover:bg-white/20">
                  <Download className="w-4 h-4 mr-2" />
                  Export CSV
                </Button>
              )}
              <Button onClick={onClose} variant="ghost" size="icon" className="text-white hover:bg-white/20">
                <X className="w-6 h-6" />
              </Button>
            </div>
          </div>
        </div>

        {/* Enhanced Stats Cards */}
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            <div className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 p-4 rounded-xl border border-purple-200 dark:border-purple-700">
              <div className="flex items-center gap-2 mb-2">
                <Users className="w-5 h-5 text-purple-600" />
                <span className="text-sm text-purple-600 dark:text-purple-400">Total Games</span>
              </div>
              <div className="text-2xl font-bold text-gray-900 dark:text-white">{stats.totalGames}</div>
            </div>

            <div className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 p-4 rounded-xl border border-green-200 dark:border-green-700">
              <div className="flex items-center gap-2 mb-2">
                <Users className="w-5 h-5 text-green-600" />
                <span className="text-sm text-green-600 dark:text-green-400">Players</span>
              </div>
              <div className="text-2xl font-bold text-gray-900 dark:text-white">{stats.uniquePlayers}</div>
            </div>

            <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 dark:from-yellow-900/20 dark:to-yellow-800/20 p-4 rounded-xl border border-yellow-200 dark:border-yellow-700">
              <div className="flex items-center gap-2 mb-2">
                <Trophy className="w-5 h-5 text-yellow-600" />
                <span className="text-sm text-yellow-600 dark:text-yellow-400">Avg Score</span>
              </div>
              <div className="text-2xl font-bold text-gray-900 dark:text-white">
                {stats.averageScore.toLocaleString()}
              </div>
            </div>

            <div className="bg-gradient-to-br from-red-50 to-red-100 dark:from-red-900/20 dark:to-red-800/20 p-4 rounded-xl border border-red-200 dark:border-red-700">
              <div className="flex items-center gap-2 mb-2">
                <Trophy className="w-5 h-5 text-red-600" />
                <span className="text-sm text-red-600 dark:text-red-400">Best Score</span>
              </div>
              <div className="text-2xl font-bold text-gray-900 dark:text-white">{stats.bestScore.toLocaleString()}</div>
            </div>

            <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 p-4 rounded-xl border border-blue-200 dark:border-blue-700">
              <div className="flex items-center gap-2 mb-2">
                <Move className="w-5 h-5 text-blue-600" />
                <span className="text-sm text-blue-600 dark:text-blue-400">Avg Moves</span>
              </div>
              <div className="text-2xl font-bold text-gray-900 dark:text-white">{stats.averageMoves}</div>
            </div>

            <div className="bg-gradient-to-br from-indigo-50 to-indigo-100 dark:from-indigo-900/20 dark:to-indigo-800/20 p-4 rounded-xl border border-indigo-200 dark:border-indigo-700">
              <div className="flex items-center gap-2 mb-2">
                <Clock className="w-5 h-5 text-indigo-600" />
                <span className="text-sm text-indigo-600 dark:text-indigo-400">Avg Time</span>
              </div>
              <div className="text-2xl font-bold text-gray-900 dark:text-white">{formatTime(stats.averageTime)}</div>
            </div>
          </div>
        </div>

        {/* Data Table */}
        <div className="flex-1 overflow-auto p-6">
          {gameEntries.length === 0 ? (
            <div className="text-center py-12">
              <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-500 mb-2">No Game Data</h3>
              <p className="text-gray-400">No games have been completed yet.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200 dark:border-gray-700">
                    <th className="text-left p-3 font-semibold text-gray-900 dark:text-white">
                      <button
                        onClick={() => handleSort("playerName")}
                        className="flex items-center gap-1 hover:text-blue-600"
                      >
                        Player Name
                        {sortBy === "playerName" && <span className="text-xs">{sortOrder === "asc" ? "↑" : "↓"}</span>}
                      </button>
                    </th>
                    <th className="text-left p-3 font-semibold text-gray-900 dark:text-white">
                      <button
                        onClick={() => handleSort("difficulty")}
                        className="flex items-center gap-1 hover:text-blue-600"
                      >
                        Difficulty
                        {sortBy === "difficulty" && <span className="text-xs">{sortOrder === "asc" ? "↑" : "↓"}</span>}
                      </button>
                    </th>
                    <th className="text-left p-3 font-semibold text-gray-900 dark:text-white">
                      <button
                        onClick={() => handleSort("moves")}
                        className="flex items-center gap-1 hover:text-blue-600"
                      >
                        <Move className="w-4 h-4" />
                        Moves
                        {sortBy === "moves" && <span className="text-xs">{sortOrder === "asc" ? "↑" : "↓"}</span>}
                      </button>
                    </th>
                    <th className="text-left p-3 font-semibold text-gray-900 dark:text-white">
                      <button
                        onClick={() => handleSort("time")}
                        className="flex items-center gap-1 hover:text-blue-600"
                      >
                        <Clock className="w-4 h-4" />
                        Time
                        {sortBy === "time" && <span className="text-xs">{sortOrder === "asc" ? "↑" : "↓"}</span>}
                      </button>
                    </th>
                    <th className="text-left p-3 font-semibold text-gray-900 dark:text-white">
                      <button
                        onClick={() => handleSort("score")}
                        className="flex items-center gap-1 hover:text-blue-600"
                      >
                        <Trophy className="w-4 h-4" />
                        Score
                        {sortBy === "score" && <span className="text-xs">{sortOrder === "asc" ? "↑" : "↓"}</span>}
                      </button>
                    </th>
                    <th className="text-left p-3 font-semibold text-gray-900 dark:text-white">
                      <button
                        onClick={() => handleSort("completedAt")}
                        className="flex items-center gap-1 hover:text-blue-600"
                      >
                        <Calendar className="w-4 h-4" />
                        Completed
                        {sortBy === "completedAt" && <span className="text-xs">{sortOrder === "asc" ? "↑" : "↓"}</span>}
                      </button>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {sortedEntries.map((entry, index) => (
                    <tr
                      key={entry.id}
                      className={`border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50 ${
                        index % 2 === 0 ? "bg-gray-25 dark:bg-gray-900/25" : ""
                      }`}
                    >
                      <td className="p-3 font-medium text-gray-900 dark:text-white">{entry.playerName}</td>
                      <td className="p-3 text-gray-600 dark:text-gray-400 capitalize">{entry.difficulty}</td>
                      <td className="p-3 text-gray-600 dark:text-gray-400">{entry.moves}</td>
                      <td className="p-3 text-gray-600 dark:text-gray-400">{formatTime(entry.time)}</td>
                      <td className="p-3 font-semibold text-purple-600 dark:text-purple-400">
                        {entry.score.toLocaleString()}
                      </td>
                      <td className="p-3 text-gray-600 dark:text-gray-400 text-sm">{formatDate(entry.completedAt)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
