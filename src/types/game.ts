export interface Position {
  x: number
  y: number
}

export interface GameState {
  snake: Position[]
  food: Position
  direction: Direction
  nextDirection: Direction
  score: number
  isGameOver: boolean
  isPaused: boolean
  level: number
  speed: number
  foodEaten: number
  startTime: number
  gameMode: GameMode
}

export type Direction = 'UP' | 'DOWN' | 'LEFT' | 'RIGHT'
export type GameMode = 'classic' | 'time_attack' | 'survival'

export interface GameConfig {
  gridSize: number
  cellSize: number
  initialSpeed: number
  speedIncrement: number
  scorePerFood: number
}

export interface TouchPosition {
  x: number
  y: number
  timestamp: number
}