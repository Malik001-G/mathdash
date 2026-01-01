"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Trophy, Clock, Home, CheckCircle2, XCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { cn } from "@/lib/utils"

type Cell = {
  value: number | string
  isBlank: boolean
  correctAnswer?: number
  id: string
}

type GridPuzzle = {
  grid: Cell[][]
  numberBank: number[]
  rows: number
  cols: number
}

const PUZZLES = {
  Easy: [
    {
      grid: [
        [
          { value: 12, isBlank: false, id: "0-0" },
          { value: "+", isBlank: false, id: "0-1" },
          { value: 24, isBlank: true, correctAnswer: 24, id: "0-2" },
          { value: "=", isBlank: false, id: "0-3" },
          { value: 36, isBlank: false, id: "0-4" },
        ],
        [
          { value: "/", isBlank: false, id: "1-0" },
          { value: "", isBlank: false, id: "1-1" },
          { value: "/", isBlank: false, id: "1-2" },
          { value: "", isBlank: false, id: "1-3" },
          { value: "", isBlank: false, id: "1-4" },
        ],
        [
          { value: 4, isBlank: true, correctAnswer: 4, id: "2-0" },
          { value: "-", isBlank: false, id: "2-1" },
          { value: 6, isBlank: true, correctAnswer: 6, id: "2-2" },
          { value: "=", isBlank: false, id: "2-3" },
          { value: -2, isBlank: false, id: "2-4" },
        ],
        [
          { value: "=", isBlank: false, id: "3-0" },
          { value: "", isBlank: false, id: "3-1" },
          { value: "=", isBlank: false, id: "3-2" },
          { value: "", isBlank: false, id: "3-3" },
          { value: "", isBlank: false, id: "3-4" },
        ],
        [
          { value: 3, isBlank: false, id: "4-0" },
          { value: "", isBlank: false, id: "4-1" },
          { value: 4, isBlank: false, id: "4-2" },
          { value: "", isBlank: false, id: "4-3" },
          { value: "", isBlank: false, id: "4-4" },
        ],
      ],
      numberBank: [24, 4, 6],
      rows: 5,
      cols: 5,
    },
    {
      grid: [
        [
          { value: 8, isBlank: true, correctAnswer: 8, id: "0-0" },
          { value: "-", isBlank: false, id: "0-1" },
          { value: 4, isBlank: true, correctAnswer: 4, id: "0-2" },
          { value: "=", isBlank: false, id: "0-3" },
          { value: 4, isBlank: false, id: "0-4" },
        ],
        [
          { value: "*", isBlank: false, id: "1-0" },
          { value: "", isBlank: false, id: "1-1" },
          { value: "=", isBlank: false, id: "1-2" },
          { value: "", isBlank: false, id: "1-3" },
          { value: "", isBlank: false, id: "1-4" },
        ],
        [
          { value: 7, isBlank: true, correctAnswer: 7, id: "2-0" },
          { value: "", isBlank: false, id: "2-1" },
          { value: 4, isBlank: false, id: "2-2" },
          { value: "", isBlank: false, id: "2-3" },
          { value: "", isBlank: false, id: "2-4" },
        ],
        [
          { value: "=", isBlank: false, id: "3-0" },
          { value: "", isBlank: false, id: "3-1" },
          { value: "", isBlank: false, id: "3-2" },
          { value: "", isBlank: false, id: "3-3" },
          { value: "", isBlank: false, id: "3-4" },
        ],
        [
          { value: 56, isBlank: false, id: "4-0" },
          { value: "", isBlank: false, id: "4-1" },
          { value: "", isBlank: false, id: "4-2" },
          { value: "", isBlank: false, id: "4-3" },
          { value: "", isBlank: false, id: "4-4" },
        ],
      ],
      numberBank: [8, 4, 7],
      rows: 5,
      cols: 5,
    },
  ],
  Medium: [
    {
      grid: [
        [
          { value: 15, isBlank: false, id: "0-0" },
          { value: "+", isBlank: false, id: "0-1" },
          { value: 9, isBlank: true, correctAnswer: 9, id: "0-2" },
          { value: "=", isBlank: false, id: "0-3" },
          { value: 24, isBlank: false, id: "0-4" },
        ],
        [
          { value: "*", isBlank: false, id: "1-0" },
          { value: "", isBlank: false, id: "1-1" },
          { value: "*", isBlank: false, id: "1-2" },
          { value: "", isBlank: false, id: "1-3" },
          { value: "/", isBlank: false, id: "1-4" },
        ],
        [
          { value: 4, isBlank: true, correctAnswer: 4, id: "2-0" },
          { value: "-", isBlank: false, id: "2-1" },
          { value: 2, isBlank: true, correctAnswer: 2, id: "2-2" },
          { value: "=", isBlank: false, id: "2-3" },
          { value: 2, isBlank: false, id: "2-4" },
        ],
        [
          { value: "=", isBlank: false, id: "3-0" },
          { value: "", isBlank: false, id: "3-1" },
          { value: "=", isBlank: false, id: "3-2" },
          { value: "", isBlank: false, id: "3-3" },
          { value: "=", isBlank: false, id: "3-4" },
        ],
        [
          { value: 60, isBlank: false, id: "4-0" },
          { value: "", isBlank: false, id: "4-1" },
          { value: 18, isBlank: false, id: "4-2" },
          { value: "", isBlank: false, id: "4-3" },
          { value: 12, isBlank: true, correctAnswer: 12, id: "4-4" },
        ],
      ],
      numberBank: [9, 4, 2, 12],
      rows: 5,
      cols: 5,
    },
    {
      grid: [
        [
          { value: 20, isBlank: false, id: "0-0" },
          { value: "-", isBlank: false, id: "0-1" },
          { value: 9, isBlank: true, correctAnswer: 9, id: "0-2" },
          { value: "=", isBlank: false, id: "0-3" },
          { value: 11, isBlank: false, id: "0-4" },
        ],
        [
          { value: "+", isBlank: false, id: "1-0" },
          { value: "", isBlank: false, id: "1-1" },
          { value: "*", isBlank: false, id: "1-2" },
          { value: "", isBlank: false, id: "1-3" },
          { value: "*", isBlank: false, id: "1-4" },
        ],
        [
          { value: 12, isBlank: true, correctAnswer: 12, id: "2-0" },
          { value: "+", isBlank: false, id: "2-1" },
          { value: 5, isBlank: true, correctAnswer: 5, id: "2-2" },
          { value: "=", isBlank: false, id: "2-3" },
          { value: 17, isBlank: false, id: "2-4" },
        ],
        [
          { value: "=", isBlank: false, id: "3-0" },
          { value: "", isBlank: false, id: "3-1" },
          { value: "=", isBlank: false, id: "3-2" },
          { value: "", isBlank: false, id: "3-3" },
          { value: "=", isBlank: false, id: "3-4" },
        ],
        [
          { value: 32, isBlank: false, id: "4-0" },
          { value: "", isBlank: false, id: "4-1" },
          { value: 45, isBlank: false, id: "4-2" },
          { value: "", isBlank: false, id: "4-3" },
          { value: 187, isBlank: true, correctAnswer: 187, id: "4-4" },
        ],
      ],
      numberBank: [9, 12, 5, 187],
      rows: 5,
      cols: 5,
    },
  ],
  Hard: [
    {
      grid: [
        [
          { value: 84, isBlank: false, id: "0-0" },
          { value: "+", isBlank: false, id: "0-1" },
          { value: 12, isBlank: true, correctAnswer: 12, id: "0-2" },
          { value: "=", isBlank: false, id: "0-3" },
          { value: 96, isBlank: true, correctAnswer: 96, id: "0-4" },
        ],
        [
          { value: "÷", isBlank: false, id: "1-0" },
          { value: "", isBlank: false, id: "1-1" },
          { value: "÷", isBlank: false, id: "1-2" },
          { value: "", isBlank: false, id: "1-3" },
          { value: "÷", isBlank: false, id: "1-4" },
        ],
        [
          { value: 7, isBlank: true, correctAnswer: 7, id: "2-0" },
          { value: "*", isBlank: false, id: "2-1" },
          { value: 4, isBlank: true, correctAnswer: 4, id: "2-2" },
          { value: "=", isBlank: false, id: "2-3" },
          { value: 28, isBlank: false, id: "2-4" },
        ],
        [
          { value: "=", isBlank: false, id: "3-0" },
          { value: "", isBlank: false, id: "3-1" },
          { value: "=", isBlank: false, id: "3-2" },
          { value: "", isBlank: false, id: "3-3" },
          { value: "=", isBlank: false, id: "3-4" },
        ],
        [
          { value: 12, isBlank: false, id: "4-0" },
          { value: "", isBlank: false, id: "4-1" },
          { value: 3, isBlank: true, correctAnswer: 3, id: "4-2" },
          { value: "", isBlank: false, id: "4-3" },
          { value: 32, isBlank: true, correctAnswer: 32, id: "4-4" },
        ],
      ],
      numberBank: [12, 96, 7, 4, 3, 32],
      rows: 5,
      cols: 5,
    },
    {
      grid: [
        [
          { value: 13, isBlank: true, correctAnswer: 13, id: "0-0" },
          { value: "+", isBlank: false, id: "0-1" },
          { value: 23, isBlank: true, correctAnswer: 23, id: "0-2" },
          { value: "=", isBlank: false, id: "0-3" },
          { value: 36, isBlank: false, id: "0-4" },
        ],
        [
          { value: "/", isBlank: false, id: "1-0" },
          { value: "", isBlank: false, id: "1-1" },
          { value: "/", isBlank: false, id: "1-2" },
          { value: "", isBlank: false, id: "1-3" },
          { value: "/", isBlank: false, id: "1-4" },
        ],
        [
          { value: 13, isBlank: false, id: "2-0" },
          { value: "*", isBlank: false, id: "2-1" },
          { value: 23, isBlank: false, id: "2-2" },
          { value: "=", isBlank: false, id: "2-3" },
          { value: 299, isBlank: true, correctAnswer: 299, id: "2-4" },
        ],
        [
          { value: "=", isBlank: false, id: "3-0" },
          { value: "", isBlank: false, id: "3-1" },
          { value: "=", isBlank: false, id: "3-2" },
          { value: "", isBlank: false, id: "3-3" },
          { value: "=", isBlank: false, id: "3-4" },
        ],
        [
          { value: 1, isBlank: false, id: "4-0" },
          { value: "", isBlank: false, id: "4-1" },
          { value: 1, isBlank: false, id: "4-2" },
          { value: "", isBlank: false, id: "4-3" },
          { value: 299, isBlank: true, correctAnswer: 299, id: "4-4" },
        ],
      ],
      numberBank: [13, 23, 299, 299],
      rows: 5,
      cols: 5,
    },
  ],
}

export default function MathGridPuzzle() {
  const [gameState, setGameState] = useState<"menu" | "playing" | "results">("menu")
  const [difficulty, setDifficulty] = useState<"Easy" | "Medium" | "Hard">("Easy")
  const [puzzleIndex, setPuzzleIndex] = useState(0)
  const [userAnswers, setUserAnswers] = useState<Record<string, number>>({})
  const [selectedNumber, setSelectedNumber] = useState<{ value: number; index: number } | null>(null)
  const [selectedCell, setSelectedCell] = useState<string | null>(null)
  const [bank, setBank] = useState<number[]>([])
  const [verification, setVerification] = useState<Record<string, boolean>>({})
  const [score, setScore] = useState(0)
  const [timeLeft, setTimeLeft] = useState(180)
  const [completedPuzzles, setCompletedPuzzles] = useState(0)

  const currentPuzzle = PUZZLES[difficulty][puzzleIndex % PUZZLES[difficulty].length]

  useEffect(() => {
    if (gameState === "playing") {
      const puzzle = PUZZLES[difficulty][puzzleIndex % PUZZLES[difficulty].length]
      // Add 2 decoy numbers
      const decoys: number[] = []
      while (decoys.length < 2) {
        const randomNum = Math.floor(Math.random() * 50) + 1
        if (!puzzle.numberBank.includes(randomNum) && !decoys.includes(randomNum)) {
          decoys.push(randomNum)
        }
      }
      setBank([...puzzle.numberBank, ...decoys].sort(() => Math.random() - 0.5))
      setUserAnswers({})
      setVerification({})
      setSelectedNumber(null)
      setSelectedCell(null)
    }
  }, [gameState, difficulty, puzzleIndex])

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
    if (selectedCell) {
      const prevValue = userAnswers[selectedCell]
      setUserAnswers((prev) => ({ ...prev, [selectedCell]: value }))
      setBank((prev) => {
        const newBank = [...prev]
        newBank.splice(index, 1)
        if (prevValue !== undefined) {
          newBank.push(prevValue)
        }
        return newBank
      })
      setSelectedCell(null)
      setSelectedNumber(null)
    } else {
      if (selectedNumber?.index === index) {
        setSelectedNumber(null)
      } else {
        setSelectedNumber({ value, index })
      }
    }
  }

  const handleCellClick = (cellId: string) => {
    const existingValue = userAnswers[cellId]

    if (selectedNumber) {
      const { value, index } = selectedNumber
      setUserAnswers((prev) => ({ ...prev, [cellId]: value }))
      setBank((prev) => {
        const newBank = [...prev]
        newBank.splice(index, 1)
        if (existingValue !== undefined) {
          newBank.push(existingValue)
        }
        return newBank
      })
      setSelectedNumber(null)
      setSelectedCell(null)
    } else if (existingValue !== undefined) {
      setUserAnswers((prev) => {
        const newAnswers = { ...prev }
        delete newAnswers[cellId]
        return newAnswers
      })
      setBank((prev) => [...prev, existingValue])
      setVerification((prev) => {
        const newState = { ...prev }
        delete newState[cellId]
        return newState
      })
    } else {
      setSelectedCell(selectedCell === cellId ? null : cellId)
    }
  }

  const verifySolution = () => {
    const newVerification: Record<string, boolean> = {}
    let correctCount = 0
    let totalBlanks = 0

    currentPuzzle.grid.forEach((row) => {
      row.forEach((cell) => {
        if (cell.isBlank) {
          totalBlanks++
          const userAnswer = userAnswers[cell.id]
          const isCorrect = userAnswer === cell.correctAnswer
          newVerification[cell.id] = isCorrect
          if (isCorrect) correctCount++
        }
      })
    })

    setVerification(newVerification)

    if (correctCount === totalBlanks) {
      setScore((s) => s + 10)
      setCompletedPuzzles((c) => c + 1)
      setTimeout(() => {
        if (puzzleIndex + 1 < PUZZLES[difficulty].length) {
          setPuzzleIndex((i) => i + 1)
        } else {
          setGameState("results")
        }
      }, 2000)
    }
  }

  const startGame = (diff: "Easy" | "Medium" | "Hard") => {
    setDifficulty(diff)
    setGameState("playing")
    setPuzzleIndex(0)
    setScore(0)
    setCompletedPuzzles(0)
    setTimeLeft(diff === "Easy" ? 180 : diff === "Medium" ? 240 : 300)
  }

  return (
    <div className="min-h-screen p-4 flex items-center justify-center bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      <Card className="w-full max-w-6xl border-4 border-gray-800 bg-white shadow-2xl p-8 rounded-3xl">
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
                <h1 className="text-5xl font-black uppercase tracking-tight bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Math Dash 
                </h1>
                <p className="text-xl font-medium max-w-2xl mx-auto text-gray-600">
                  Fill in the blanks to complete all equations! Numbers work both horizontally and vertically.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
                {(["Easy", "Medium", "Hard"] as const).map((level) => (
                  <Button
                    key={level}
                    onClick={() => startGame(level)}
                    className={cn(
                      "h-32 text-3xl font-black border-4 border-gray-800 shadow-lg hover:scale-105 transition-transform",
                      level === "Easy" && "bg-green-400 hover:bg-green-500 text-gray-900",
                      level === "Medium" && "bg-yellow-400 hover:bg-yellow-500 text-gray-900",
                      level === "Hard" && "bg-red-400 hover:bg-red-500 text-gray-900"
                    )}
                  >
                    <div className="flex flex-col gap-2">
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
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-6"
            >
              <div className="flex items-center justify-between border-b-4 border-gray-800 pb-4">
                <div className="flex items-center gap-4">
                  <div className="bg-gray-100 border-2 border-gray-800 p-2 rounded-xl flex items-center gap-2">
                    <Clock className="w-5 h-5 text-blue-600" />
                    <span className={cn("text-xl font-bold", timeLeft < 30 && "text-red-600")}>
                      {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, "0")}
                    </span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm font-bold text-gray-600">Level</span>
                    <span className="text-xl font-black">{difficulty}</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm font-bold text-gray-600">Puzzle</span>
                    <span className="text-xl font-black">
                      {puzzleIndex + 1} / {PUZZLES[difficulty].length}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <div className="text-sm font-bold text-gray-600">Solved</div>
                    <div className="text-3xl font-black text-purple-600">{completedPuzzles}</div>
                  </div>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setGameState("menu")}
                    className="border-2 border-gray-800"
                  >
                    <Home className="w-5 h-5" />
                  </Button>
                </div>
              </div>

              <div className="bg-gradient-to-br from-blue-50 to-purple-50 border-4 border-gray-800 rounded-2xl p-8 overflow-x-auto">
                <div className="inline-block min-w-full">
                  {currentPuzzle.grid.map((row, i) => (
                    <div key={i} className="flex items-center justify-center gap-2 mb-2">
                      {row.map((cell, j) => {
                        if (typeof cell.value === "string" && cell.value !== "") {
                          return (
                            <div key={j} className="w-16 h-16 flex items-center justify-center text-2xl font-black">
                              {cell.value}
                            </div>
                          )
                        }

                        if (cell.value === "") {
                          return <div key={j} className="w-16 h-16" />
                        }

                        if (cell.isBlank) {
                          const isCorrect = verification[cell.id]
                          const hasValue = userAnswers[cell.id] !== undefined
                          return (
                            <button
                              key={j}
                              onClick={() => handleCellClick(cell.id)}
                              className={cn(
                                "w-16 h-16 rounded-full border-4 flex items-center justify-center text-xl font-black transition-all relative",
                                selectedCell === cell.id
                                  ? "bg-yellow-200 border-yellow-500 scale-110 shadow-lg"
                                  : hasValue
                                  ? "bg-blue-100 border-blue-500"
                                  : "bg-white border-gray-400 border-dashed hover:bg-gray-50",
                                isCorrect === true && "border-green-500 bg-green-100",
                                isCorrect === false && "border-red-500 bg-red-100"
                              )}
                            >
                              {userAnswers[cell.id] || "?"}
                              {isCorrect === true && (
                                <CheckCircle2 className="absolute -top-2 -right-2 w-6 h-6 text-green-600 bg-white rounded-full" />
                              )}
                              {isCorrect === false && (
                                <XCircle className="absolute -top-2 -right-2 w-6 h-6 text-red-600 bg-white rounded-full" />
                              )}
                            </button>
                          )
                        }

                        return (
                          <div
                            key={j}
                            className="w-16 h-16 bg-gray-200 border-2 border-gray-800 rounded-lg flex items-center justify-center text-xl font-black"
                          >
                            {cell.value}
                          </div>
                        )
                      })}
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-3">
                <div className="text-center">
                  <span className="inline-block text-sm font-black uppercase bg-blue-600 text-white px-4 py-2 rounded-full">
                    Number Bank
                  </span>
                </div>
                <div className="flex flex-wrap justify-center gap-3 p-4 bg-white border-4 border-gray-800 rounded-2xl min-h-[80px]">
                  {bank.map((num, idx) => (
                    <button
                      key={`${num}-${idx}`}
                      onClick={() => handleNumberClick(num, idx)}
                      className={cn(
                        "w-14 h-14 bg-blue-500 text-white text-xl font-black rounded-lg shadow-md transition-all",
                        selectedNumber?.index === idx
                          ? "ring-4 ring-yellow-400 scale-110"
                          : "hover:scale-105 active:scale-95"
                      )}
                    >
                      {num}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex justify-center">
                <Button
                  size="lg"
                  onClick={verifySolution}
                  className="h-16 px-12 text-2xl font-black bg-purple-600 hover:bg-purple-700 border-4 border-gray-800"
                >
                  Check Solution
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
              <Trophy className="w-32 h-32 mx-auto text-yellow-500" />
              <div className="space-y-4">
                <h2 className="text-5xl font-black text-purple-600">Time's Up!</h2>
                <p className="text-2xl">You completed {completedPuzzles} puzzles!</p>
              </div>
              <div className="flex justify-center gap-4">
                <Button
                  size="lg"
                  onClick={() => setGameState("menu")}
                  className="h-16 px-10 text-xl font-bold border-4 border-gray-800"
                >
                  Main Menu
                </Button>
                <Button
                  size="lg"
                  onClick={() => startGame(difficulty)}
                  className="h-16 px-10 text-xl font-bold bg-purple-600 border-4 border-gray-800"
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