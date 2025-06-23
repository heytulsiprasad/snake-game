import type { Position, Direction, GameState } from '../types/game'
import { GAME_CONFIG } from './constants'

export const createInitialSnake = (): Position[] => {
  const center = Math.floor(GAME_CONFIG.gridSize / 2)
  return [
    { x: center, y: center },
    { x: center - 1, y: center },
    { x: center - 2, y: center },
  ]
}

export const generateRandomFood = (snake: Position[]): Position => {
  let food: Position
  do {
    food = {
      x: Math.floor(Math.random() * GAME_CONFIG.gridSize),
      y: Math.floor(Math.random() * GAME_CONFIG.gridSize),
    }
  } while (snake.some(segment => segment.x === food.x && segment.y === food.y))
  return food
}

export const moveSnake = (state: GameState): GameState => {
  if (state.isGameOver || state.isPaused) return state

  const newSnake = [...state.snake]
  const head = { ...newSnake[0] }

  // Move head based on direction
  switch (state.direction) {
    case 'UP':
      head.y = (head.y - 1 + GAME_CONFIG.gridSize) % GAME_CONFIG.gridSize
      break
    case 'DOWN':
      head.y = (head.y + 1) % GAME_CONFIG.gridSize
      break
    case 'LEFT':
      head.x = (head.x - 1 + GAME_CONFIG.gridSize) % GAME_CONFIG.gridSize
      break
    case 'RIGHT':
      head.x = (head.x + 1) % GAME_CONFIG.gridSize
      break
  }

  // Check self collision
  if (newSnake.some(segment => segment.x === head.x && segment.y === head.y)) {
    return { ...state, isGameOver: true }
  }

  newSnake.unshift(head)

  // Check food collision
  let newFood = state.food
  let newScore = state.score
  let newFoodEaten = state.foodEaten
  let newSpeed = state.speed

  if (head.x === state.food.x && head.y === state.food.y) {
    newFood = generateRandomFood(newSnake)
    newScore += GAME_CONFIG.scorePerFood * state.level
    newFoodEaten += 1
    
    // Increase speed every 5 foods
    if (newFoodEaten % 5 === 0) {
      newSpeed = Math.max(50, state.speed - GAME_CONFIG.speedIncrement)
    }
  } else {
    newSnake.pop()
  }

  return {
    ...state,
    snake: newSnake,
    food: newFood,
    score: newScore,
    foodEaten: newFoodEaten,
    speed: newSpeed,
    direction: state.nextDirection,
  }
}

export const isOppositeDirection = (dir1: Direction, dir2: Direction): boolean => {
  return (
    (dir1 === 'UP' && dir2 === 'DOWN') ||
    (dir1 === 'DOWN' && dir2 === 'UP') ||
    (dir1 === 'LEFT' && dir2 === 'RIGHT') ||
    (dir1 === 'RIGHT' && dir2 === 'LEFT')
  )
}

export const getSwipeDirection = (
  startX: number,
  startY: number,
  endX: number,
  endY: number
): Direction | null => {
  const dx = endX - startX
  const dy = endY - startY
  const absDx = Math.abs(dx)
  const absDy = Math.abs(dy)

  if (Math.max(absDx, absDy) < 30) return null

  if (absDx > absDy) {
    return dx > 0 ? 'RIGHT' : 'LEFT'
  } else {
    return dy > 0 ? 'DOWN' : 'UP'
  }
}