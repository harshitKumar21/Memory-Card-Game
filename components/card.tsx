"use client"

import { memo } from "react"

type CardProps = {
  card: {
    id: number
    emoji: string
    isFlipped: boolean
    isMatched: boolean
  }
  onClick: () => void
  size: "small" | "medium" | "large"
}

export const Card = memo(function Card({ card, onClick, size }: CardProps) {
  const sizeClasses = {
    small: "w-12 h-12 text-lg",
    medium: "w-16 h-16 text-xl",
    large: "w-20 h-20 text-2xl",
  }

  return (
    <div className="perspective-1000">
      <div
        className={`
          ${sizeClasses[size]}
          relative cursor-pointer transition-all duration-500 transform-style-preserve-3d
          ${card.isFlipped || card.isMatched ? "rotate-y-180" : "hover:scale-105"}
          ${card.isMatched ? "animate-pulse" : ""}
        `}
        onClick={onClick}
      >
        {/* Card Back */}
        <div className="absolute inset-0 w-full h-full backface-hidden rounded-xl bg-gradient-to-br from-blue-400 to-purple-600 dark:from-blue-600 dark:to-purple-800 shadow-lg border border-white/20 flex items-center justify-center">
          <div className="w-full h-full bg-white/10 backdrop-blur-sm rounded-xl border border-white/20 flex items-center justify-center">
            <div className="w-6 h-6 bg-white/20 rounded-full animate-pulse"></div>
          </div>
        </div>

        {/* Card Front */}
        <div
          className={`
            absolute inset-0 w-full h-full backface-hidden rotate-y-180 rounded-xl shadow-lg border flex items-center justify-center transition-all duration-300
            ${
              card.isMatched
                ? "bg-gradient-to-br from-green-100 to-emerald-200 dark:from-green-800/50 dark:to-emerald-700/50 border-green-300 dark:border-green-600 shadow-green-200/50 dark:shadow-green-800/50 shadow-lg ring-2 ring-green-300/50 dark:ring-green-500/50"
                : "bg-gradient-to-br from-white to-gray-100 dark:from-gray-800 dark:to-gray-900 border-gray-200 dark:border-gray-700"
            }
          `}
        >
          <span
            className={`
              select-none filter drop-shadow-sm transition-all duration-300
              ${card.isMatched ? "scale-110 drop-shadow-md" : ""}
            `}
          >
            {card.emoji}
          </span>

          {/* Matched indicator glow effect */}
          {card.isMatched && (
            <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-green-200/20 to-emerald-300/20 dark:from-green-400/10 dark:to-emerald-500/10 animate-pulse"></div>
          )}
        </div>
      </div>
    </div>
  )
})
