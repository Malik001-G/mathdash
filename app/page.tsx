"use client"

import { useState, useCallback, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Trophy, Clock, Brain, LogOut, CheckCircle2, XCircle, MousePointer2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import { PUZZLES, parseEquations, getCorrectAnswers, type Difficulty, type Puzzle } from "@/lib/puzzles"

function SelectableNumber({
  value,
  isSelected,
  onClick,
}: {
  value: number
  isSelected: boolean
  onClick: () => void
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "w-12 h-12 md:w-14 md:h-14 flex items-center justify-center bg-primary text-primary-foreground text-xl font-black rounded-lg shadow-md transition-all",
        isSelected ? "ring-4 ring-accent scale-105 shadow-lg" : "hover:scale-105 active:scale-95",
      )}
    >
      {value}
    </button>
  )
}

function ClickableSlot({
  value,
  isCorrect,
  isSelected,
  onClick,
}: {
  value?: number
  isCorrect?: boolean
  isSelected: boolean
  onClick: () => void
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "w-12 h-12 md:w-14 md:h-14 flex items-center justify-center border-2 border-dashed rounded-lg transition-all relative",
        isSelected
          ? "bg-accent/20 border-accent border-solid ring-4 ring-accent/30"
          : "bg-card border-border hover:bg-muted/50",
        value && "border-solid bg-white shadow-inner",
        isCorrect === true && "border-green-500 bg-green-50",
        isCorrect === false && "border-destructive bg-destructive/10",
      )}
    >
      {value && <span className="text-2xl font-black">{value}</span>}
      {!value && <span className="text-muted-foreground opacity-30 text-3xl">?</span>}
      {isCorrect === true && (
        <CheckCircle2 className="absolute -top-2 -right-2 w-6 h-6 text-green-500 bg-white rounded-full" />
      )}
      {isCorrect === false && (
        <XCircle className="absolute -top-2 -right-2 w-6 h-6 text-destructive bg-white rounded-full" />
      )}
    </button>
  )
}

export default function ArithmeticPuzzleGame() {
  const [gameState, setGameState] = useState<"menu" | "playing" | "results">("menu")
  const [difficulty, setDifficulty] = useState<Difficulty>("Easy")
  const [puzzleIndex, setPuzzleIndex] = useState(0)
  const [shuffledIndices, setShuffledIndices] = useState<number[]>([])
  const [slots, setSlots] = useState<Record<string, number>>({})
  const [bank, setBank] = useState<number[]>([])
  const [score, setScore] = useState(0)
  const [timeLeft, setTimeLeft] = useState(120)
  const [verificationState, setVerificationState] = useState<Record<string, boolean>>({})
  const [completedPuzzles, setCompletedPuzzles] = useState(0)
  const [selectedNumber, setSelectedNumber] = useState<{ value: number; index: number } | null>(null)
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null)
  const [showScorePopup, setShowScorePopup] = useState<{ x: number; y: number; points: number } | null>(null) // state for score animation
  const [isVerifying, setIsVerifying] = useState(false)

  const currentPuzzle: Puzzle =
    shuffledIndices.length > 0
      ? PUZZLES[difficulty][shuffledIndices[puzzleIndex % shuffledIndices.length]]
      : PUZZLES[difficulty][0]
  const parsedEquations = parseEquations(currentPuzzle.equations)

  const getSlotId = (eqIndex: number, partIndex: number) => `slot-${eqIndex}-${partIndex}`

  const initPuzzle = useCallback((puzzle: Puzzle) => {
    setSlots({})
    setVerificationState({})
    const correctAnswers = getCorrectAnswers(puzzle)
    const baseBank = [...puzzle.numberBank]

    // Generate 2 random numbers that aren't already in the bank to avoid confusion
    const decoys: number[] = []
    while (decoys.length < 2) {
      const randomNum = Math.floor(Math.random() * 50) + 1
      if (!baseBank.includes(randomNum) && !decoys.includes(randomNum)) {
        decoys.push(randomNum)
      }
    }

    setBank([...baseBank, ...decoys].sort(() => Math.random() - 0.5))
    setSelectedNumber(null)
    setSelectedSlot(null)
  }, [])

  useEffect(() => {
    if (gameState === "playing") {
      initPuzzle(currentPuzzle)
    }
  }, [gameState, currentPuzzle, initPuzzle])

  useEffect(() => {
    let timer: NodeJS.Timeout
    if (gameState === "playing" && timeLeft > 0) {
      timer = setInterval(() => setTimeLeft((t) => t - 1), 1000)
    } else if (timeLeft === 0) {
      setGameState("results")
    }
    return () => clearInterval(timer)
  }, [gameState, timeLeft])

  const handleNumberClick = (value: number, index: number) => {
    if (selectedSlot) {
      const slotId = selectedSlot
      const prevValue = slots[slotId]

      setSlots((prev) => ({ ...prev, [slotId]: value }))

      setBank((prev) => {
        const newBank = [...prev]
        newBank.splice(index, 1)
        if (prevValue !== undefined) {
          newBank.push(prevValue)
        }
        return newBank
      })

      setSelectedSlot(null)
      setSelectedNumber(null)
    } else {
      if (selectedNumber?.index === index) {
        setSelectedNumber(null)
      } else {
        setSelectedNumber({ value, index })
      }
    }
  }

  const handleSlotClick = (slotId: string) => {
    const existingValue = slots[slotId]

    if (selectedNumber) {
      const { value, index } = selectedNumber

      setSlots((prev) => ({ ...prev, [slotId]: value }))

      setBank((prev) => {
        const newBank = [...prev]
        newBank.splice(index, 1)
        if (existingValue !== undefined) {
          newBank.push(existingValue)
        }
        return newBank
      })

      setSelectedNumber(null)
      setSelectedSlot(null)
    } else if (existingValue !== undefined) {
      setSlots((prev) => {
        const newSlots = { ...prev }
        delete newSlots[slotId]
        return newSlots
      })
      setBank((prev) => [...prev, existingValue])
      setVerificationState((prev) => {
        const newState = { ...prev }
        delete newState[slotId]
        return newState
      })
    } else {
      setSelectedSlot(selectedSlot === slotId ? null : slotId)
    }
  }

  const checkSolution = () => {
    const totalBlanks = parsedEquations.reduce((acc, eq) => acc + eq.parts.filter((p) => p.isBlank).length, 0)

    const filledSlotsCount = Object.keys(slots).length
    if (filledSlotsCount < totalBlanks || isVerifying) {
      return
    }

    setIsVerifying(true)
    const newVerificationState: Record<string, boolean> = {}
    let correctCount = 0
    let globalBlankIndex = 0
    const expectedAnswers = getCorrectAnswers(currentPuzzle)

    parsedEquations.forEach((eq, eqIndex) => {
      eq.parts.forEach((part, partIndex) => {
        if (part.isBlank) {
          const slotId = getSlotId(eqIndex, partIndex)
          const userAnswer = slots[slotId]
          const correctAnswer = expectedAnswers[globalBlankIndex]
          const isCorrect = userAnswer === correctAnswer

          newVerificationState[slotId] = isCorrect
          if (isCorrect) correctCount++
          globalBlankIndex++
        }
      })
    })

    setVerificationState(newVerificationState)

    if (correctCount === totalBlanks) {
      const totalPuzzles = PUZZLES[difficulty].length
      const basePointsPerPuzzle = 100 / totalPuzzles

      // Calculate time bonus (max 10% extra)
      const maxTime = difficulty === "Easy" ? 120 : difficulty === "Medium" ? 180 : 300
      const timeRatio = timeLeft / maxTime
      const timeBonus = basePointsPerPuzzle * 0.1 * timeRatio

      const puzzleScore = basePointsPerPuzzle + timeBonus

      setScore((s) => Math.min(100, s + puzzleScore))
      setCompletedPuzzles((c) => c + 1)

      setShowScorePopup({ x: window.innerWidth / 2, y: window.innerHeight / 2, points: Math.round(puzzleScore) })
      setTimeout(() => setShowScorePopup(null), 1500)
    }

    setTimeout(() => {
      setIsVerifying(false)
      if (puzzleIndex + 1 < shuffledIndices.length) {
        setPuzzleIndex((i) => i + 1)
      } else {
        setGameState("results")
      }
    }, 2000)
  }

  const startGame = (selectedDifficulty: Difficulty) => {
    const indices = Array.from({ length: PUZZLES[selectedDifficulty].length }, (_, i) => i)
    for (let i = indices.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      ;[indices[i], indices[j]] = [indices[j], indices[i]]
    }
    setShuffledIndices(indices)
    setDifficulty(selectedDifficulty)
    setGameState("playing")
    setPuzzleIndex(0)
    setScore(0)
    setCompletedPuzzles(0)
    setTimeLeft(selectedDifficulty === "Easy" ? 120 : selectedDifficulty === "Medium" ? 180 : 300)
  }

  return (
    <div className="min-h-screen p-4 flex items-center justify-center font-sans bg-gradient-to-br from-background via-secondary/20 to-accent/10">
      <Card className="w-full max-w-6xl border-8 border-border bg-background shadow-[12px_12px_0px_0px] shadow-border p-8 rounded-3xl">
        <AnimatePresence mode="wait">
          {gameState === "menu" && (
            <motion.div
              key="menu"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="text-center space-y-12 py-12"
            >
              <div className="space-y-6">
                {/* <div className="inline-flex items-center justify-center p-4 bg-primary rounded-3xl border-4 border-border shadow-lg">
                  <Brain className="w-16 h-16 text-primary-foreground" />
                </div> */}
                <h1 className="text-3xl lg:text-5xl font-black uppercase tracking-tighter bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                  Math Dash Challenge
                </h1>
                <p className="text-xl font-medium max-w-2xl mx-auto text-muted-foreground leading-relaxed">
                  Click a number from the bank and then an empty slot to solve the equations. Each puzzle uses a shared
                  bank with two extra decoy numbers to test your skills!
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
                {(["Easy", "Medium", "Hard"] as Difficulty[]).map((level) => (
                  <Button
                    key={level}
                    onClick={() => startGame(level)}
                    className={cn(
                      "h-40 text-4xl font-black uppercase border-8 border-border shadow-[8px_8px_0px_0px] shadow-border hover:translate-x-[4px] hover:translate-y-[4px] hover:shadow-none transition-all rounded-2xl",
                      level === "Easy" && "bg-green-100 hover:bg-green-200 text-green-900",
                      level === "Medium" && "bg-yellow-100 hover:bg-yellow-200 text-yellow-900",
                      level === "Hard" && "bg-red-100 hover:bg-red-200 text-red-900",
                    )}
                  >
                    <div className="flex flex-col items-center gap-2">
                      <span>{level}</span>
                      <span className="text-sm font-medium opacity-70">{PUZZLES[level].length} Puzzles</span>
                    </div>
                  </Button>
                ))}
              </div>
            </motion.div>
          )}

          {gameState === "playing" && (
            <motion.div
              key="playing"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.05 }}
              className="space-y-4"
            >
              <div className="flex items-center justify-between border-b-4 border-border pb-4">
                <div className="flex items-center gap-4">
                  <div className="bg-card border-2 border-border p-2 rounded-xl flex items-center gap-2 shadow-sm">
                    <Clock className="w-5 h-5 text-primary" />
                    <span className={cn("text-xl font-black tabular-nums", timeLeft < 20 && "text-destructive")}>
                      {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, "0")}
                    </span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm font-bold uppercase tracking-widest text-muted-foreground">Level</span>
                    <span className="text-2xl font-black">{difficulty}</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm font-bold uppercase tracking-widest text-muted-foreground">Puzzle</span>
                    <span className="text-2xl font-black">
                      {puzzleIndex + 1} / {PUZZLES[difficulty].length}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-4 relative">
                  <AnimatePresence>
                    {showScorePopup && (
                      <motion.div
                        initial={{ opacity: 0, y: 0, scale: 0.5 }}
                        animate={{ opacity: 1, y: -100, scale: 1.5 }}
                        exit={{ opacity: 0 }}
                        className="absolute right-20 top-0 text-4xl font-black text-accent pointer-events-none z-50"
                      >
                        +{showScorePopup.points}%
                      </motion.div>
                    )}
                  </AnimatePresence>
                  <div className="text-right">
                    <div className="text-sm font-bold opacity-60 uppercase tracking-wider">Score</div>
                    <motion.div
                      key={score}
                      initial={{ scale: 1.2 }}
                      animate={{ scale: 1 }}
                      className="text-5xl font-black text-primary"
                    >
                      {Math.round(score)}%
                    </motion.div>
                  </div>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setGameState("menu")}
                    className="border-4 border-border w-14 h-14 hover:bg-destructive/10"
                  >
                    <LogOut className="w-6 h-6" />
                  </Button>
                </div>
              </div>

              <div className="space-y-8">
                <div className="bg-card/50 border-4 border-border rounded-2xl p-4 min-h-[200px] flex flex-col items-center justify-center gap-4 shadow-inner">
                  <div className="flex items-center gap-4 mb-2">
                    <div className="text-xs font-black uppercase tracking-widest opacity-60 bg-muted px-4 py-1.5 rounded-full border-2 border-border flex items-center gap-2">
                      <MousePointer2 className="w-3 h-3" /> Click to select & place
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-6 w-full">
                    {parsedEquations.map((eqData, eqIndex) => {
                      return (
                        <div key={eqIndex} className="flex items-center gap-2 text-2xl md:text-3xl font-black">
                          {eqData.parts.map((part, partIndex) => {
                            if (part.isBlank) {
                              const slotId = getSlotId(eqIndex, partIndex)
                              return (
                                <ClickableSlot
                                  key={partIndex}
                                  value={slots[slotId]}
                                  isCorrect={verificationState[slotId]}
                                  isSelected={selectedSlot === slotId}
                                  onClick={() => handleSlotClick(slotId)}
                                />
                              )
                            }
                            return (
                              <span key={partIndex} className="select-none">
                                {part.value}
                              </span>
                            )
                          })}
                        </div>
                      )
                    })}
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="text-center">
                    <div className="inline-block text-xs font-black uppercase tracking-widest bg-primary text-primary-foreground px-4 py-2 rounded-full border-2 border-border shadow-sm">
                      Number Bank
                    </div>
                  </div>
                  <div className="flex flex-wrap justify-center gap-3 p-4 bg-white border-4 border-border rounded-2xl shadow-inner min-h-[80px]">
                    {bank.length === 0 && <div className="text-muted-foreground italic text-sm">All numbers used!</div>}
                    {bank.map((num, idx) => (
                      <SelectableNumber
                        key={`${num}-${idx}`}
                        value={num}
                        isSelected={selectedNumber?.index === idx}
                        onClick={() => handleNumberClick(num, idx)}
                      />
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex justify-center pt-4">
                <Button
                  size="lg"
                  onClick={checkSolution}
                  disabled={Object.keys(slots).length < currentPuzzle.numberBank.length}
                  className="h-20 px-16 text-3xl font-black uppercase border-4 border-border shadow-[8px_8px_0px_0px] shadow-border hover:translate-x-[4px] hover:translate-y-[4px] hover:shadow-none disabled:opacity-40 disabled:cursor-not-allowed transition-all rounded-2xl"
                >
                  Verify Solution
                </Button>
              </div>
            </motion.div>
          )}

          {gameState === "results" && (
            <motion.div
              key="results"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center space-y-12 py-16"
            >
              <Trophy className="w-40 h-40 mx-auto text-accent animate-bounce" />
              <div className="space-y-4">
                <h2 className="text-6xl font-black uppercase bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                  Game Complete!
                </h2>
                <p className="text-2xl font-medium opacity-70">
                  You solved {completedPuzzles} out of {PUZZLES[difficulty].length} puzzles!
                </p>
              </div>
              <div className="space-y-2">
                <div className="text-xl font-bold uppercase tracking-wider opacity-60">Final Score</div>
                <div className="text-9xl font-black text-primary">{Math.round(score)}%</div>
              </div>
              <div className="flex justify-center gap-6">
                <Button
                  variant="outline"
                  size="lg"
                  onClick={() => setGameState("menu")}
                  className="h-20 px-12 text-2xl font-bold border-4 border-border rounded-2xl hover:bg-muted"
                >
                  Main Menu
                </Button>
                <Button
                  size="lg"
                  onClick={() => startGame(difficulty)}
                  className="h-20 px-12 text-2xl font-bold border-4 border-border shadow-[8px_8px_0px_0px] shadow-border hover:translate-x-[4px] hover:translate-y-[4px] hover:shadow-none rounded-2xl"
                >
                  Play Again
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </Card>
    </div>
  )
}
