import React, { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { GameState } from '../../types/game'
import { GAME_CONFIG } from '../../utils/constants'
import { getSwipeDirection } from '../../utils/gameLogic'

interface GameBoardProps {
  gameState: GameState
  onDirectionChange: (direction: 'UP' | 'DOWN' | 'LEFT' | 'RIGHT') => void
}

export const GameBoard: React.FC<GameBoardProps> = ({ gameState, onDirectionChange }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [touchStart, setTouchStart] = useState<{ x: number; y: number } | null>(null)
  const boardSize = GAME_CONFIG.gridSize * GAME_CONFIG.cellSize

  // Draw game on canvas
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // Clear canvas
    ctx.fillStyle = '#0f1419'
    ctx.fillRect(0, 0, boardSize, boardSize)

    // Draw grid lines
    ctx.strokeStyle = '#1a1f2e'
    ctx.lineWidth = 0.5
    for (let i = 0; i <= GAME_CONFIG.gridSize; i++) {
      const pos = i * GAME_CONFIG.cellSize
      ctx.beginPath()
      ctx.moveTo(pos, 0)
      ctx.lineTo(pos, boardSize)
      ctx.stroke()
      ctx.beginPath()
      ctx.moveTo(0, pos)
      ctx.lineTo(boardSize, pos)
      ctx.stroke()
    }

    // Draw snake
    gameState.snake.forEach((segment, index) => {
      ctx.fillStyle = index === 0 ? '#22c55e' : '#16a34a'
      ctx.fillRect(
        segment.x * GAME_CONFIG.cellSize + 1,
        segment.y * GAME_CONFIG.cellSize + 1,
        GAME_CONFIG.cellSize - 2,
        GAME_CONFIG.cellSize - 2
      )

      // Add gradient effect to head
      if (index === 0) {
        const gradient = ctx.createRadialGradient(
          segment.x * GAME_CONFIG.cellSize + GAME_CONFIG.cellSize / 2,
          segment.y * GAME_CONFIG.cellSize + GAME_CONFIG.cellSize / 2,
          0,
          segment.x * GAME_CONFIG.cellSize + GAME_CONFIG.cellSize / 2,
          segment.y * GAME_CONFIG.cellSize + GAME_CONFIG.cellSize / 2,
          GAME_CONFIG.cellSize / 2
        )
        gradient.addColorStop(0, '#22c55e')
        gradient.addColorStop(1, '#16a34a')
        ctx.fillStyle = gradient
        ctx.fillRect(
          segment.x * GAME_CONFIG.cellSize + 1,
          segment.y * GAME_CONFIG.cellSize + 1,
          GAME_CONFIG.cellSize - 2,
          GAME_CONFIG.cellSize - 2
        )
      }
    })

    // Draw food with pulsing effect
    const time = Date.now() / 1000
    const pulse = Math.sin(time * 4) * 0.1 + 0.9
    ctx.fillStyle = '#ef4444'
    ctx.beginPath()
    ctx.arc(
      gameState.food.x * GAME_CONFIG.cellSize + GAME_CONFIG.cellSize / 2,
      gameState.food.y * GAME_CONFIG.cellSize + GAME_CONFIG.cellSize / 2,
      (GAME_CONFIG.cellSize / 2 - 2) * pulse,
      0,
      Math.PI * 2
    )
    ctx.fill()
  }, [gameState, boardSize])

  // Handle keyboard input
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      const directionMap: Record<string, 'UP' | 'DOWN' | 'LEFT' | 'RIGHT'> = {
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
      }

      const direction = directionMap[e.key]
      if (direction) {
        e.preventDefault()
        onDirectionChange(direction)
      }
    }

    window.addEventListener('keydown', handleKeyPress)
    return () => window.removeEventListener('keydown', handleKeyPress)
  }, [onDirectionChange])

  // Handle touch controls
  const handleTouchStart = (e: React.TouchEvent) => {
    const touch = e.touches[0]
    setTouchStart({ x: touch.clientX, y: touch.clientY })
  }

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (!touchStart) return

    const touch = e.changedTouches[0]
    const direction = getSwipeDirection(
      touchStart.x,
      touchStart.y,
      touch.clientX,
      touch.clientY
    )

    if (direction) {
      onDirectionChange(direction)
    }
    setTouchStart(null)
  }

  return (
    <motion.div
      className="relative inline-block game-board touch-action-none"
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <canvas
        ref={canvasRef}
        width={boardSize}
        height={boardSize}
        className="prevent-select"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      />
      
      {gameState.isGameOver && (
        <motion.div
          className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-75 rounded-lg"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <div className="text-center">
            <h2 className="text-4xl font-bold text-red-500 mb-4">Game Over!</h2>
            <p className="text-2xl mb-2">Score: {gameState.score}</p>
            <p className="text-lg">Press Space or tap to restart</p>
          </div>
        </motion.div>
      )}

      {gameState.isPaused && !gameState.isGameOver && (
        <motion.div
          className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded-lg"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <div className="text-center">
            <h2 className="text-3xl font-bold mb-2">Paused</h2>
            <p className="text-lg">Press Space to continue</p>
          </div>
        </motion.div>
      )}
    </motion.div>
  )
}