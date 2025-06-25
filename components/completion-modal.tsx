"use client"

import { useEffect, useState } from "react"
import { Trophy, Star, Clock, Move } from "lucide-react"
import { Button } from "@/components/ui/button"

type CompletionModalProps = {
  isOpen: boolean
  moves: number
  time: number
  playerName: string
  isNewBest: boolean
  onNewGame: () => void
  gameEntries: Array<{
    id: string
    playerName: string
    difficulty: string
    moves: number
    time: number
    score: number
    completedAt: string
  }>
}

export function CompletionModal({
  isOpen,
  moves,
  time,
  playerName,
  isNewBest,
  onNewGame,
  gameEntries,
}: CompletionModalProps) {
  const [show, setShow] = useState(false)

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => setShow(true), 100)
    } else {
      setShow(false)
    }
  }, [isOpen])

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  const calculateScore = () => {
    // Lower is better: base score minus penalties for time and moves
    const baseScore = 10000
    const timePenalty = time * 10
    const movePenalty = moves * 50
    return Math.max(0, baseScore - timePenalty - movePenalty)
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div
        className={`
        bg-white dark:bg-gray-900 rounded-3xl p-8 max-w-md w-full shadow-2xl border border-gray-200 dark:border-gray-700
        transform transition-all duration-500 ${show ? "scale-100 opacity-100" : "scale-95 opacity-0"}
      `}
      >
        <div className="text-center">
          {/* Celebration Icons */}
          <div className="flex justify-center mb-6">
            <div className="relative">
              <Trophy className="w-16 h-16 text-yellow-500 animate-bounce" />
              {isNewBest && <Star className="w-6 h-6 text-yellow-400 absolute -top-1 -right-1 animate-spin" />}
              {/* Celebration particles */}
              <div className="absolute -inset-4">
                <div className="w-2 h-2 bg-yellow-400 rounded-full absolute top-0 left-0 animate-ping"></div>
                <div className="w-1 h-1 bg-pink-400 rounded-full absolute top-2 right-0 animate-ping animation-delay-200"></div>
                <div className="w-1.5 h-1.5 bg-purple-400 rounded-full absolute bottom-0 left-2 animate-ping animation-delay-500"></div>
                <div className="w-1 h-1 bg-blue-400 rounded-full absolute bottom-2 right-2 animate-ping animation-delay-700"></div>
              </div>
            </div>
          </div>

          {/* Title */}
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Congratulations, {playerName}! 🎉</h2>

          {isNewBest && <p className="text-yellow-600 dark:text-yellow-400 font-semibold mb-4">New Best Score! ⭐</p>}

          {/* Stats */}
          <div className="space-y-4 mb-8">
            <div className="flex items-center justify-between bg-gray-50 dark:bg-gray-800 rounded-lg p-3">
              <div className="flex items-center gap-2">
                <Move className="w-5 h-5 text-blue-500" />
                <span className="text-gray-700 dark:text-gray-300">Moves</span>
              </div>
              <span className="font-bold text-gray-900 dark:text-white">{moves}</span>
            </div>

            <div className="flex items-center justify-between bg-gray-50 dark:bg-gray-800 rounded-lg p-3">
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-green-500" />
                <span className="text-gray-700 dark:text-gray-300">Time</span>
              </div>
              <span className="font-bold text-gray-900 dark:text-white">{formatTime(time)}</span>
            </div>

            <div className="flex items-center justify-between bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-lg p-3 border border-purple-200 dark:border-purple-700">
              <div className="flex items-center gap-2">
                <Trophy className="w-5 h-5 text-purple-500" />
                <span className="text-gray-700 dark:text-gray-300">Score</span>
              </div>
              <span className="font-bold text-purple-600 dark:text-purple-400">
                {calculateScore().toLocaleString()}
              </span>
            </div>
          </div>

          {/* Action Button */}
          <Button
            onClick={onNewGame}
            className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-semibold py-3 rounded-xl transition-all duration-200 transform hover:scale-105"
          >
            Play Again
          </Button>
        </div>
      </div>
    </div>
  )
}
