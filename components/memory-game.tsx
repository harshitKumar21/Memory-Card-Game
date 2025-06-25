"use client"

import { useState, useEffect, useCallback, useMemo } from "react"
import { Card } from "./card"
import { GameStats } from "./game-stats"
import { CompletionModal } from "./completion-modal"
import { ThemeToggle } from "./theme-toggle"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { MatchNotification } from "./match-notification"
import { PlayerNameModal } from "./player-name-modal"

type Difficulty = "easy" | "medium" | "hard"
type CardType = {
  id: number
  emoji: string
  isFlipped: boolean
  isMatched: boolean
  pairId: string // Unique identifier for matching pairs
}

type GameState = "playing" | "completed"
type BestScore = {
  moves: number
  time: number
}

const CARD_EMOJIS = [
  "🎮",
  "🎯",
  "🎨",
  "🎭",
  "🎪",
  "🎸",
  "🎺",
  "🎹",
  "🎲",
  "🎳",
  "🏆",
  "🏅",
  "⚽",
  "🏀",
  "🎾",
  "🏐",
  "🏈",
  "⚾",
  "🥎",
  "🏓",
  "🏸",
  "🏒",
  "🏑",
  "🥍",
  "🏏",
  "🪃",
  "🥊",
  "🥋",
  "🎿",
  "⛷️",
  "🏂",
  "🪂",
  "🎪",
  "🎨",
  "🎭",
  "🎯",
  "🎮",
  "🎸",
  "🎺",
  "🎹",
  "🎲",
  "🎳",
  "🏆",
  "🏅",
  "⚽",
  "🏀",
  "🎾",
  "🏐",
  "🏈",
  "⚾",
]

const DIFFICULTY_CONFIG = {
  easy: { rows: 4, cols: 4, name: "Easy (4×4)" },
  medium: { rows: 6, cols: 6, name: "Medium (6×6)" },
  hard: { rows: 8, cols: 8, name: "Hard (8×8)" },
}

export default function MemoryGame() {
  const [difficulty, setDifficulty] = useState<Difficulty>("easy")
  const [cards, setCards] = useState<CardType[]>([])
  const [flippedCards, setFlippedCards] = useState<number[]>([])
  const [matchedPairs, setMatchedPairs] = useState<Set<string>>(new Set())
  const [moves, setMoves] = useState(0)
  const [time, setTime] = useState(0)
  const [gameState, setGameState] = useState<GameState>("playing")
  const [bestScores, setBestScores] = useState<Record<Difficulty, BestScore | null>>({
    easy: null,
    medium: null,
    hard: null,
  })
  const [playerName, setPlayerName] = useState<string>("")
  const [showNameModal, setShowNameModal] = useState(true)
  const [showMatchNotification, setShowMatchNotification] = useState(false)
  const [gameEntries, setGameEntries] = useState<
    Array<{
      id: string
      playerName: string
      difficulty: Difficulty
      moves: number
      time: number
      score: number
      completedAt: string
    }>
  >([])

  // Memoized card lookup for performance optimization
  const cardLookup = useMemo(() => {
    const lookup = new Map<number, CardType>()
    cards.forEach((card) => lookup.set(card.id, card))
    return lookup
  }, [cards])

  // Load best scores from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("memory-game-scores")
    if (saved) {
      setBestScores(JSON.parse(saved))
    }
  }, [])

  // Save best scores to localStorage
  const saveBestScore = useCallback(
    (difficulty: Difficulty, moves: number, time: number) => {
      setBestScores((prev) => {
        const current = prev[difficulty]
        const isNewBest = !current || moves < current.moves || (moves === current.moves && time < current.time)

        if (isNewBest) {
          const newScores = { ...prev, [difficulty]: { moves, time } }
          localStorage.setItem("memory-game-scores", JSON.stringify(newScores))
          return newScores
        }
        return prev
      })

      // Save game entry
      const gameEntry = {
        id: Date.now().toString(),
        playerName,
        difficulty,
        moves,
        time,
        score: Math.max(0, 10000 - time * 10 - moves * 50),
        completedAt: new Date().toISOString(),
      }

      setGameEntries((prev) => {
        const updated = [...prev, gameEntry]
        localStorage.setItem("memory-game-entries", JSON.stringify(updated))
        return updated
      })
    },
    [playerName],
  )

  // Optimized card generation with Fisher-Yates shuffle
  const generateCards = useCallback((difficulty: Difficulty) => {
    const config = DIFFICULTY_CONFIG[difficulty]
    const totalCards = config.rows * config.cols
    const pairCount = totalCards / 2

    // Select random emojis for this game
    const selectedEmojis = CARD_EMOJIS.slice(0, pairCount)
    const cardPairs: Array<{ emoji: string; pairId: string }> = []

    // Create pairs with unique identifiers
    selectedEmojis.forEach((emoji, index) => {
      const pairId = `pair-${index}`
      cardPairs.push({ emoji, pairId }, { emoji, pairId })
    })

    // Fisher-Yates shuffle for optimal randomization
    for (let i = cardPairs.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      ;[cardPairs[i], cardPairs[j]] = [cardPairs[j], cardPairs[i]]
    }

    return cardPairs.map((card, index) => ({
      id: index,
      emoji: card.emoji,
      pairId: card.pairId,
      isFlipped: false,
      isMatched: false,
    }))
  }, [])

  // Initialize game
  const initializeGame = useCallback(() => {
    const newCards = generateCards(difficulty)
    setCards(newCards)
    setFlippedCards([])
    setMatchedPairs(new Set())
    setMoves(0)
    setTime(0)
    setGameState("playing")
  }, [difficulty, generateCards])

  // Initialize game on mount and difficulty change
  useEffect(() => {
    initializeGame()
  }, [initializeGame])

  // Timer effect
  useEffect(() => {
    let interval: NodeJS.Timeout
    if (gameState === "playing") {
      interval = setInterval(() => {
        setTime((prev) => prev + 1)
      }, 1000)
    }
    return () => clearInterval(interval)
  }, [gameState])

  // Load game entries from localStorage
  useEffect(() => {
    const savedEntries = localStorage.getItem("memory-game-entries")
    if (savedEntries) {
      setGameEntries(JSON.parse(savedEntries))
    }
  }, [])

  // Optimized match checking algorithm
  const checkForMatch = useCallback(
    (firstId: number, secondId: number) => {
      const firstCard = cardLookup.get(firstId)
      const secondCard = cardLookup.get(secondId)

      if (!firstCard || !secondCard) return false

      return firstCard.pairId === secondCard.pairId
    },
    [cardLookup],
  )

  // Handle card click with optimized matching logic
  const handleCardClick = useCallback(
    (cardId: number) => {
      const card = cardLookup.get(cardId)

      // Prevent clicks on matched cards, already flipped cards, or when 2 cards are already flipped
      if (!card || card.isMatched || flippedCards.includes(cardId) || flippedCards.length >= 2) {
        return
      }

      const newFlippedCards = [...flippedCards, cardId]
      setFlippedCards(newFlippedCards)

      // Flip the card immediately for responsive feedback
      setCards((prev) => prev.map((c) => (c.id === cardId ? { ...c, isFlipped: true } : c)))

      if (newFlippedCards.length === 2) {
        setMoves((prev) => prev + 1)

        const [firstId, secondId] = newFlippedCards
        const isMatch = checkForMatch(firstId, secondId)

        if (isMatch) {
          const firstCard = cardLookup.get(firstId)
          if (firstCard) {
            // Match found - show notification
            setShowMatchNotification(true)
            setTimeout(() => setShowMatchNotification(false), 1000)

            // Mark cards as matched and add to matched pairs set
            setTimeout(() => {
              setMatchedPairs((prev) => new Set(prev).add(firstCard.pairId))
              setCards((prev) =>
                prev.map((card) =>
                  card.id === firstId || card.id === secondId ? { ...card, isMatched: true, isFlipped: true } : card,
                ),
              )
              setFlippedCards([])
            }, 600)
          }
        } else {
          // No match - flip cards back after delay
          setTimeout(() => {
            setCards((prev) =>
              prev.map((card) => (card.id === firstId || card.id === secondId ? { ...card, isFlipped: false } : card)),
            )
            setFlippedCards([])
          }, 1000)
        }
      }
    },
    [flippedCards, cardLookup, checkForMatch],
  )

  // Check for game completion with optimized logic
  useEffect(() => {
    if (cards.length > 0) {
      const totalPairs = cards.length / 2
      const isGameComplete = matchedPairs.size === totalPairs

      if (isGameComplete && gameState === "playing") {
        setGameState("completed")
        saveBestScore(difficulty, moves, time)
      }
    }
  }, [matchedPairs.size, cards.length, gameState, difficulty, moves, time, saveBestScore])

  const config = DIFFICULTY_CONFIG[difficulty]

  return (
    <div className="relative min-h-screen p-4 flex flex-col items-center justify-center">
      <ThemeToggle />

      <div className="w-full max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-4 drop-shadow-lg">Match the Emoji</h1>
          <p className="text-white/80 text-lg mb-6">Flip cards to find matching emoji pairs!</p>

          {/* Controls */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-6">
            <Select value={difficulty} onValueChange={(value: Difficulty) => setDifficulty(value)}>
              <SelectTrigger className="w-48 bg-white/10 backdrop-blur-md border-white/20 text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(DIFFICULTY_CONFIG).map(([key, config]) => (
                  <SelectItem key={key} value={key}>
                    {config.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Button
              onClick={initializeGame}
              className="bg-white/20 hover:bg-white/30 backdrop-blur-md border border-white/20 text-white"
            >
              New Game
            </Button>
          </div>
        </div>

        {/* Game Stats */}
        <GameStats moves={moves} time={time} bestScore={bestScores[difficulty]} />

        {/* Game Board */}
        <div
          className="grid gap-2 md:gap-4 mx-auto mb-8 p-4 md:p-6 bg-white/10 backdrop-blur-md rounded-3xl border border-white/20 shadow-2xl"
          style={{
            gridTemplateColumns: `repeat(${config.cols}, minmax(0, 1fr))`,
            maxWidth: `${Math.min(config.cols * 80 + (config.cols - 1) * 16 + 48, 600)}px`,
          }}
        >
          {cards.map((card) => (
            <Card
              key={card.id}
              card={card}
              onClick={() => handleCardClick(card.id)}
              size={config.cols <= 4 ? "large" : config.cols <= 6 ? "medium" : "small"}
            />
          ))}
        </div>

        {/* Best Score Display */}
        {bestScores[difficulty] && (
          <div className="text-center text-white/80">
            <p className="text-sm">
              Best Score: {bestScores[difficulty]!.moves} moves in {Math.floor(bestScores[difficulty]!.time / 60)}:
              {(bestScores[difficulty]!.time % 60).toString().padStart(2, "0")}
            </p>
          </div>
        )}
      </div>

      {/* Player Name Modal */}
      <PlayerNameModal
        isOpen={showNameModal}
        onSubmit={(name) => {
          setPlayerName(name)
          setShowNameModal(false)
        }}
      />

      {/* Match Notification */}
      <MatchNotification isVisible={showMatchNotification} />

      {/* Completion Modal */}
      <CompletionModal
        isOpen={gameState === "completed"}
        moves={moves}
        time={time}
        playerName={playerName}
        isNewBest={bestScores[difficulty]?.moves === moves && bestScores[difficulty]?.time === time}
        onNewGame={initializeGame}
        gameEntries={gameEntries}
      />
    </div>
  )
}
