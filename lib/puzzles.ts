export type Difficulty = "Easy" | "Medium" | "Hard"

export type Puzzle = {
  id: string
  difficulty: Difficulty
  numEquations: number
  equations: string // Equations with blanks (?)
  numberBank: number[]
  solvedEquations: string // Complete solved equations
}

// Parse equations to find blank positions and create interactive slots
export function parseEquations(equations: string): Array<{
  equation: string
  parts: Array<{ value: string; isBlank: boolean; index: number }>
}> {
  const eqArray = equations.split(" | ")
  return eqArray.map((eq, eqIndex) => {
    const parts: Array<{ value: string; isBlank: boolean; index: number }> = []
    const tokens = eq.split(" ")
    let blankCounter = 0

    tokens.forEach((token) => {
      if (token === "?") {
        parts.push({ value: token, isBlank: true, index: blankCounter })
        blankCounter++
      } else {
        parts.push({ value: token, isBlank: false, index: -1 })
      }
    })

    return { equation: eq, parts }
  })
}

// Verify user's answer against the solved equation
export function verifySolution(
  userSlots: Record<string, number>,
  puzzle: Puzzle,
): { isCorrect: boolean; correctAnswers: number[] } {
  const correctAnswers = getCorrectAnswers(puzzle)
  const userAnswers = Object.keys(userSlots)
    .sort()
    .map((key) => userSlots[key])

  const isCorrect = correctAnswers.every((num, idx) => userAnswers[idx] === num)

  return { isCorrect, correctAnswers }
}

// Get correct answers by comparing blank equations with solved ones
export function getCorrectAnswers(puzzle: Puzzle): number[] {
  const blankEqs = puzzle.equations.split(" | ")
  const solvedEqs = puzzle.solvedEquations.split(" | ")
  const correctAnswers: number[] = []

  blankEqs.forEach((blankEq, i) => {
    const solvedEq = solvedEqs[i]
    const blankTokens = blankEq.split(" ")
    const solvedTokens = solvedEq.split(" ")

    blankTokens.forEach((token, j) => {
      if (token === "?") {
        correctAnswers.push(Number(solvedTokens[j]))
      }
    })
  })

  return correctAnswers
}

export const PUZZLES: Record<Difficulty, Puzzle[]> = {
  Easy: [
    {
      id: "E001",
      difficulty: "Easy",
      numEquations: 3,
      equations: "9 + ? = 17 | ? + 14 = 33 | ? + 20 = 37",
      numberBank: [8, 19, 17],
      solvedEquations: "9 + 8 = 17 | 19 + 14 = 33 | 17 + 20 = 37",
    },
    {
      id: "E002",
      difficulty: "Easy",
      numEquations: 3,
      equations: "? - 9 = 10 | ? + 11 = 25 | ? + 3 = 7",
      numberBank: [19, 4, 14],
      solvedEquations: "19 - 9 = 10 | 14 + 11 = 25 | 4 + 3 = 7",
    },
    {
      id: "E003",
      difficulty: "Easy",
      numEquations: 3,
      equations: "? - 4 = 14 | 20 - ? = 8 | 10 - ? = 2",
      numberBank: [8, 12, 18],
      solvedEquations: "18 - 4 = 14 | 20 - 12 = 8 | 10 - 8 = 2",
    },
    {
      id: "E004",
      difficulty: "Easy",
      numEquations: 4,
      equations: "? + 6 = 18 | 20 - ? = 17 | 6 + ? = 21 | ? + 2 = 13",
      numberBank: [12, 11, 3, 15],
      solvedEquations: "12 + 6 = 18 | 20 - 3 = 17 | 6 + 15 = 21 | 11 + 2 = 13",
    },
    {
      id: "E005",
      difficulty: "Easy",
      numEquations: 3,
      equations: "? + 11 = 30 | 5 + ? = 14 | ? - 14 = 5",
      numberBank: [9, 19, 19],
      solvedEquations: "19 + 11 = 30 | 5 + 9 = 14 | 19 - 14 = 5",
    },
    {
      id: "E006",
      difficulty: "Easy",
      numEquations: 4,
      equations: "? + 4 = 6 | 20 + ? = 23 | 17 - ? = 8 | 18 - ? = 14",
      numberBank: [4, 3, 2, 9],
      solvedEquations: "2 + 4 = 6 | 20 + 3 = 23 | 17 - 9 = 8 | 18 - 4 = 14",
    },
    {
      id: "E007",
      difficulty: "Easy",
      numEquations: 4,
      equations: "15 - ? = 14 | ? - 6 = 11 | ? + 20 = 37 | 18 - ? = 1",
      numberBank: [17, 17, 1, 17],
      solvedEquations: "15 - 1 = 14 | 17 - 6 = 11 | 17 + 20 = 37 | 18 - 17 = 1",
    },
    {
      id: "E008",
      difficulty: "Easy",
      numEquations: 4,
      equations: "8 + ? = 10 | 16 - ? = 13 | ? - 5 = 11 | 18 - ? = 11",
      numberBank: [2, 7, 3, 16],
      solvedEquations: "8 + 2 = 10 | 16 - 3 = 13 | 16 - 5 = 11 | 18 - 7 = 11",
    },
    {
      id: "E009",
      difficulty: "Easy",
      numEquations: 4,
      equations: "? + 8 = 12 | 19 + ? = 27 | 8 - ? = 5 | ? + 8 = 25",
      numberBank: [4, 17, 3, 8],
      solvedEquations: "4 + 8 = 12 | 19 + 8 = 27 | 8 - 3 = 5 | 17 + 8 = 25",
    },
    {
      id: "E010",
      difficulty: "Easy",
      numEquations: 3,
      equations: "14 + ? = 21 | 14 + ? = 28 | 13 - ? = 11",
      numberBank: [14, 2, 7],
      solvedEquations: "14 + 7 = 21 | 14 + 14 = 28 | 13 - 2 = 11",
    },
    {
      id: "E011",
      difficulty: "Easy",
      numEquations: 3,
      equations: "? + 15 = 33 | 8 + ? = 11 | 18 - ? = 16",
      numberBank: [3, 2, 18],
      solvedEquations: "18 + 15 = 33 | 8 + 3 = 11 | 18 - 2 = 16",
    },
    {
      id: "E012",
      difficulty: "Easy",
      numEquations: 4,
      equations: "16 - ? = 9 | ? - 1 = 12 | 14 - ? = 4 | 5 + ? = 12",
      numberBank: [7, 13, 10, 7],
      solvedEquations: "16 - 7 = 9 | 13 - 1 = 12 | 14 - 10 = 4 | 5 + 7 = 12",
    },
    {
      id: "E013",
      difficulty: "Easy",
      numEquations: 3,
      equations: "19 - ? = 3 | ? + 17 = 19 | 8 + ? = 21",
      numberBank: [2, 13, 16],
      solvedEquations: "19 - 16 = 3 | 2 + 17 = 19 | 8 + 13 = 21",
    },
  ],
  Medium: [
    {
      id: "M001",
      difficulty: "Medium",
      numEquations: 4,
      equations: "? + 20 = 54 | ? - 2 = 21 | ? + 33 = 49 | 25 - ? = 23",
      numberBank: [16, 2, 34, 23],
      solvedEquations: "34 + 20 = 54 | 23 - 2 = 21 | 16 + 33 = 49 | 25 - 2 = 23",
    },
    {
      id: "M002",
      difficulty: "Medium",
      numEquations: 5,
      equations: "9 × ? = 54 | 44 × ? = 1760 | ? × 27 = 405 | ? - 20 = 8 | 9 × ? = 126",
      numberBank: [15, 28, 6, 40, 14],
      solvedEquations: "9 × 6 = 54 | 44 × 40 = 1760 | 15 × 27 = 405 | 28 - 20 = 8 | 9 × 14 = 126",
    },
    {
      id: "M003",
      difficulty: "Medium",
      numEquations: 4,
      equations: "50 - ? = 40 | 21 - ? = 16 | ? - 12 = 9 | ? - 21 = 28",
      numberBank: [10, 21, 5, 49],
      solvedEquations: "50 - 10 = 40 | 21 - 5 = 16 | 21 - 12 = 9 | 49 - 21 = 28",
    },
    {
      id: "M004",
      difficulty: "Medium",
      numEquations: 5,
      equations: "? + 13 = 63 | 40 × ? = 720 | ? × 39 = 585 | ? × 23 = 46 | ? - 9 = 24",
      numberBank: [50, 33, 2, 18, 15],
      solvedEquations: "50 + 13 = 63 | 40 × 18 = 720 | 15 × 39 = 585 | 2 × 23 = 46 | 33 - 9 = 24",
    },
    {
      id: "M005",
      difficulty: "Medium",
      numEquations: 5,
      equations: "? + 13 = 24 | 18 + ? = 45 | 49 + ? = 63 | 40 - ? = 8 | 28 - ? = 2",
      numberBank: [26, 11, 27, 14, 32],
      solvedEquations: "11 + 13 = 24 | 18 + 27 = 45 | 49 + 14 = 63 | 40 - 32 = 8 | 28 - 26 = 2",
    },
    {
      id: "M006",
      difficulty: "Medium",
      numEquations: 4,
      equations: "? - 3 = 27 | ? × 48 = 1248 | ? - 34 = 15 | 29 - ? = 3",
      numberBank: [26, 30, 26, 49],
      solvedEquations: "30 - 3 = 27 | 26 × 48 = 1248 | 49 - 34 = 15 | 29 - 26 = 3",
    },
    {
      id: "M007",
      difficulty: "Medium",
      numEquations: 5,
      equations: "40 - ? = 36 | 42 + ? = 71 | 50 - ? = 12 | ? + 27 = 53 | 46 - ? = 8",
      numberBank: [26, 38, 29, 38, 4],
      solvedEquations: "40 - 4 = 36 | 42 + 29 = 71 | 50 - 38 = 12 | 26 + 27 = 53 | 46 - 38 = 8",
    },
    {
      id: "M008",
      difficulty: "Medium",
      numEquations: 4,
      equations: "? + 46 = 54 | 46 × ? = 1150 | ? × 11 = 440 | ? + 50 = 53",
      numberBank: [3, 40, 8, 25],
      solvedEquations: "8 + 46 = 54 | 46 × 25 = 1150 | 40 × 11 = 440 | 3 + 50 = 53",
    },
    {
      id: "M009",
      difficulty: "Medium",
      numEquations: 4,
      equations: "? × 27 = 108 | ? × 29 = 1450 | ? - 8 = 1 | ? + 30 = 31",
      numberBank: [1, 50, 9, 4],
      solvedEquations: "4 × 27 = 108 | 50 × 29 = 1450 | 9 - 8 = 1 | 1 + 30 = 31",
    },
    {
      id: "M010",
      difficulty: "Medium",
      numEquations: 4,
      equations: "? + 43 = 81 | 39 + ? = 78 | 41 - ? = 1 | ? + 10 = 22",
      numberBank: [40, 12, 38, 39],
      solvedEquations: "38 + 43 = 81 | 39 + 39 = 78 | 41 - 40 = 1 | 12 + 10 = 22",
    },
    {
      id: "M011",
      difficulty: "Medium",
      numEquations: 5,
      equations: "? + ? = 11 | 19 × ? = 760 | 39 × ? = 1443 | 48 - ? = 18 | 50 + ? = 70",
      numberBank: [40, 20, 37, 3, 8],
      solvedEquations: "3 + 8 = 11 | 19 × 40 = 760 | 39 × 37 = 1443 | 48 - 30 = 18 | 50 + 20 = 70",
    },
    {
      id: "M012",
      difficulty: "Medium",
      numEquations: 5,
      equations: "? - 8 = 1 | ? × 34 = 918 | 40 + ? = 44 | ? × 6 = 204 | ? × 46 = 1794",
      numberBank: [9, 34, 27, 4, 39],
      solvedEquations: "9 - 8 = 1 | 27 × 34 = 918 | 40 + 4 = 44 | 34 × 6 = 204 | 39 × 46 = 1794",
    },
    {
      id: "M013",
      difficulty: "Medium",
      numEquations: 4,
      equations: "37 × ? = 1184 | 32 × ? = 1024 | ? × 46 = 690 | 1 + ? = 9",
      numberBank: [32, 8, 15, 32],
      solvedEquations: "37 × 32 = 1184 | 32 × 32 = 1024 | 15 × 46 = 690 | 1 + 8 = 9",
    },
  ],
  Hard: [
    {
      id: "H001",
      difficulty: "Hard",
      numEquations: 5,
      equations: "? × 11 = 440 | ? ÷ 19 = 2 | 25 ÷ ? = 5 | 65 × ? = 5720 | ? ÷ 13 = 4",
      numberBank: [38, 5, 40, 52, 88],
      solvedEquations: "40 × 11 = 440 | 38 ÷ 19 = 2 | 25 ÷ 5 = 5 | 65 × 88 = 5720 | 52 ÷ 13 = 4",
    },
    {
      id: "H002",
      difficulty: "Hard",
      numEquations: 6,
      equations: "? - 18 = 79 | 75 + ? = 141 | 7 × ? = 679 | 52 + ? = 138 | ? ÷ 3 = 6 | ? + 77 = 120",
      numberBank: [66, 18, 43, 97, 97, 86],
      solvedEquations: "97 - 18 = 79 | 75 + 66 = 141 | 7 × 97 = 679 | 52 + 86 = 138 | 18 ÷ 3 = 6 | 43 + 77 = 120",
    },
    {
      id: "H003",
      difficulty: "Hard",
      numEquations: 5,
      equations: "? - 72 = 23 | 39 + ? = 120 | ? - 63 = 17 | 78 - ? = 58 | 27 + ? = 41",
      numberBank: [81, 80, 95, 14, 20],
      solvedEquations: "95 - 72 = 23 | 39 + 81 = 120 | 80 - 63 = 17 | 78 - 20 = 58 | 27 + 14 = 41",
    },
    {
      id: "H004",
      difficulty: "Hard",
      numEquations: 6,
      equations: "34 ÷ ? = 2 | ? × 88 = 6952 | ? - 19 = 37 | 66 - ? = 44 | ? ÷ 17 = 3 | ? + 64 = 140",
      numberBank: [51, 56, 79, 76, 17, 22],
      solvedEquations: "34 ÷ 17 = 2 | 79 × 88 = 6952 | 56 - 19 = 37 | 66 - 22 = 44 | 51 ÷ 17 = 3 | 76 + 64 = 140",
    },
    {
      id: "H005",
      difficulty: "Hard",
      numEquations: 5,
      equations: "? + 59 = 96 | 5 × ? = 415 | 69 ÷ ? = 23 | ? ÷ 16 = 3 | 65 - ? = 19",
      numberBank: [83, 37, 46, 48, 3],
      solvedEquations: "37 + 59 = 96 | 5 × 83 = 415 | 69 ÷ 3 = 23 | 48 ÷ 16 = 3 | 65 - 46 = 19",
    },
    {
      id: "H006",
      difficulty: "Hard",
      numEquations: 5,
      equations: "? - 46 = 38 | 98 - ? = 62 | ? + 62 = 145 | 91 - ? = 17 | ? × 90 = 1530",
      numberBank: [84, 36, 74, 83, 17],
      solvedEquations: "84 - 46 = 38 | 98 - 36 = 62 | 83 + 62 = 145 | 91 - 74 = 17 | 17 × 90 = 1530",
    },
    {
      id: "H007",
      difficulty: "Hard",
      numEquations: 5,
      equations: "? + 94 = 98 | 64 + ? = 151 | ? - 14 = 9 | 8 ÷ ? = 2 | 5 + ? = 101",
      numberBank: [23, 87, 4, 4, 96],
      solvedEquations: "4 + 94 = 98 | 64 + 87 = 151 | 23 - 14 = 9 | 8 ÷ 4 = 2 | 5 + 96 = 101",
    },
    {
      id: "H008",
      difficulty: "Hard",
      numEquations: 5,
      equations: "28 ÷ ? = 2 | 26 + ? = 59 | 26 + ? = 121 | 12 + ? = 87 | 27 - ? = 22",
      numberBank: [33, 14, 5, 75, 95],
      solvedEquations: "28 ÷ 14 = 2 | 26 + 33 = 59 | 26 + 95 = 121 | 12 + 75 = 87 | 27 - 5 = 22",
    },
    {
      id: "H009",
      difficulty: "Hard",
      numEquations: 6,
      equations: "94 - ? = 6 | 32 ÷ ? = 4 | ? ÷ 18 = 3 | ? + 57 = 66 | 73 + ? = 84 | 16 + ? = 80",
      numberBank: [11, 64, 9, 8, 88, 54],
      solvedEquations: "94 - 88 = 6 | 32 ÷ 8 = 4 | 54 ÷ 18 = 3 | 9 + 57 = 66 | 73 + 11 = 84 | 16 + 64 = 80",
    },
    {
      id: "H010",
      difficulty: "Hard",
      numEquations: 6,
      equations: "9 × ? = 189 | 69 + ? = 143 | ? × 80 = 4160 | 75 - ? = 14 | ? + 44 = 49 | 27 - ? = 9",
      numberBank: [52, 5, 61, 74, 21, 18],
      solvedEquations: "9 × 21 = 189 | 69 + 74 = 143 | 52 × 80 = 4160 | 75 - 61 = 14 | 5 + 44 = 49 | 27 - 18 = 9",
    },
    {
      id: "H011",
      difficulty: "Hard",
      numEquations: 5,
      equations: "10 × ? = 540 | ? - 62 = 9 | ? + 5 = 19 | ? × 62 = 3472 | 3 + ? = 11",
      numberBank: [8, 54, 14, 56, 71],
      solvedEquations: "10 × 54 = 540 | 71 - 62 = 9 | 14 + 5 = 19 | 56 × 62 = 3472 | 3 + 8 = 11",
    },
    {
      id: "H012",
      difficulty: "Hard",
      numEquations: 6,
      equations: "? + 99 = 149 | ? ÷ 19 = 2 | ? + 48 = 127 | ? + 30 = 61 | ? ÷ 19 = 5 | ? - 32 = 61",
      numberBank: [79, 50, 95, 93, 31, 38],
      solvedEquations: "50 + 99 = 149 | 38 ÷ 19 = 2 | 79 + 48 = 127 | 31 + 30 = 61 | 95 ÷ 19 = 5 | 93 - 32 = 61",
    },
    {
      id: "H013",
      difficulty: "Hard",
      numEquations: 6,
      equations: "78 × ? = 6552 | ? × 78 = 1326 | 85 + ? = 95 | ? - 64 = 27 | ? + 92 = 149 | 84 × ? = 2688",
      numberBank: [57, 17, 91, 84, 32, 10],
      solvedEquations: "78 × 84 = 6552 | 17 × 78 = 1326 | 85 + 10 = 95 | 91 - 64 = 27 | 57 + 92 = 149 | 84 × 32 = 2688",
    },
  ],
}
