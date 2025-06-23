import { useState, useEffect, useCallback, useRef } from 'react'
import { GameState, Direction, GameMode } from '../types/game'
import { createInitialSnake, generateRandomFood, moveSnake, isOppositeDirection } from '../utils/gameLogic'
import { DIFFICULTY_LEVELS } from '../utils/constants'

export const useGame = (gameMode: GameMode = 'classic') => {
  const [gameState, setGameState] = useState<GameState>(() => ({
    snake: createInitialSnake(),
    food: generateRandomFood(createInitialSnake()),
    direction: 'RIGHT',
    nextDirection: 'RIGHT',
    score: 0,
    isGameOver: false,
    isPaused: true,
    level: 1,
    speed: DIFFICULTY_LEVELS.medium.speed,
    foodEaten: 0,
    startTime: Date.now(),
    gameMode,
  }))

  const gameLoopRef = useRef<NodeJS.Timer | null>(null)

  const startGame = useCallback(() => {
    const initialSnake = createInitialSnake()
    setGameState({
      snake: initialSnake,
      food: generateRandomFood(initialSnake),
      direction: 'RIGHT',
      nextDirection: 'RIGHT',
      score: 0,
      isGameOver: false,
      isPaused: false,
      level: 1,
      speed: DIFFICULTY_LEVELS.medium.speed,
      foodEaten: 0,
      startTime: Date.now(),
      gameMode,
    })
  }, [gameMode])

  const pauseGame = useCallback(() => {
    setGameState(prev => ({ ...prev, isPaused: !prev.isPaused }))
  }, [])

  const changeDirection = useCallback((newDirection: Direction) => {
    setGameState(prev => {
      if (!isOppositeDirection(prev.direction, newDirection)) {
        return { ...prev, nextDirection: newDirection }
      }
      return prev
    })
  }, [])

  const setDifficulty = useCallback((difficulty: keyof typeof DIFFICULTY_LEVELS) => {
    setGameState(prev => ({
      ...prev,
      speed: DIFFICULTY_LEVELS[difficulty].speed,
    }))
  }, [])

  // Game loop
  useEffect(() => {
    if (gameLoopRef.current) {
      clearInterval(gameLoopRef.current)
    }

    if (!gameState.isPaused && !gameState.isGameOver) {
      gameLoopRef.current = setInterval(() => {
        setGameState(prev => moveSnake(prev))
      }, gameState.speed)
    }

    return () => {
      if (gameLoopRef.current) {
        clearInterval(gameLoopRef.current)
      }
    }
  }, [gameState.isPaused, gameState.isGameOver, gameState.speed])

  return {
    gameState,
    startGame,
    pauseGame,
    changeDirection,
    setDifficulty,
  }
}