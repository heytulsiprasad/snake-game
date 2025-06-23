import { GameConfig } from '../types/game'

export const GAME_CONFIG: GameConfig = {
  gridSize: 20,
  cellSize: 20,
  initialSpeed: 150,
  speedIncrement: 5,
  scorePerFood: 10,
}

export const SWIPE_THRESHOLD = 50 // minimum distance for swipe detection
export const SWIPE_VELOCITY_THRESHOLD = 0.3 // minimum velocity for swipe

export const DIFFICULTY_LEVELS = {
  easy: { speed: 150, speedIncrement: 3 },
  medium: { speed: 100, speedIncrement: 5 },
  hard: { speed: 75, speedIncrement: 7 },
} as const

export const DIRECTION_KEYS = {
  ArrowUp: 'UP',
  ArrowDown: 'DOWN',
  ArrowLeft: 'LEFT',
  ArrowRight: 'RIGHT',
  w: 'UP',
  W: 'UP',
  s: 'DOWN',
  S: 'DOWN',
  a: 'LEFT',
  A: 'LEFT',
  d: 'RIGHT',
  D: 'RIGHT',
} as const