"use client"

import { Clock, Move } from "lucide-react"

type GameStatsProps = {
  moves: number
  time: number
  bestScore: { moves: number; time: number } | null
}

export function GameStats({ moves, time, bestScore }: GameStatsProps) {
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  return (
    <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-6">
      <div className="flex items-center gap-6">
        <div className="flex items-center gap-2 bg-white/10 backdrop-blur-md px-4 py-2 rounded-full border border-white/20">
          <Move className="w-5 h-5 text-white" />
          <span className="text-white font-semibold">{moves} moves</span>
        </div>

        <div className="flex items-center gap-2 bg-white/10 backdrop-blur-md px-4 py-2 rounded-full border border-white/20">
          <Clock className="w-5 h-5 text-white" />
          <span className="text-white font-semibold">{formatTime(time)}</span>
        </div>
      </div>

      {bestScore && (
        <div className="text-white/70 text-sm">
          Best: {bestScore.moves} moves, {formatTime(bestScore.time)}
        </div>
      )}
    </div>
  )
}
