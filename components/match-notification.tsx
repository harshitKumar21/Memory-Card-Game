"use client"

import { CheckCircle } from "lucide-react"

type MatchNotificationProps = {
  isVisible: boolean
}

export function MatchNotification({ isVisible }: MatchNotificationProps) {
  if (!isVisible) return null

  return (
    <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-40 animate-in fade-in-0 zoom-in-95 duration-300">
      <div className="bg-green-500 text-white px-6 py-3 rounded-full shadow-2xl flex items-center gap-2 border-2 border-green-400">
        <CheckCircle className="w-5 h-5" />
        <span className="font-semibold text-lg">Match!</span>
      </div>
    </div>
  )
}
