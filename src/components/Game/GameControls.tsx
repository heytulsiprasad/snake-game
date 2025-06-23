import React, { FC } from 'react'
import { motion } from 'framer-motion'
import { Play, Pause, RotateCcw, ChevronUp, ChevronDown, ChevronLeft, ChevronRight } from 'lucide-react'
import { Direction } from '../../types/game'

interface GameControlsProps {
  isPaused: boolean
  isGameOver: boolean
  onStart: () => void
  onPause: () => void
  onDirectionChange: (direction: Direction) => void
  onDifficultyChange: (difficulty: 'easy' | 'medium' | 'hard') => void
}

export const GameControls: FC<GameControlsProps> = ({
  isPaused,
  isGameOver,
  onStart,
  onPause,
  onDirectionChange,
  onDifficultyChange,
}) => {
  return (
    <div className="space-y-4">
      {/* Game control buttons */}
      <motion.div
        className="flex flex-wrap justify-center gap-4"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        <button
          onClick={isGameOver ? onStart : onPause}
          className="btn-primary flex items-center space-x-2"
        >
          {isGameOver ? (
            <>
              <RotateCcw className="w-5 h-5" />
              <span>New Game</span>
            </>
          ) : isPaused ? (
            <>
              <Play className="w-5 h-5" />
              <span>Resume</span>
            </>
          ) : (
            <>
              <Pause className="w-5 h-5" />
              <span>Pause</span>
            </>
          )}
        </button>
      </motion.div>

      {/* Difficulty selector */}
      {isPaused && (
        <motion.div
          className="flex justify-center gap-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <button
            onClick={() => onDifficultyChange('easy')}
            className="btn-secondary text-sm px-4 py-2"
          >
            Easy
          </button>
          <button
            onClick={() => onDifficultyChange('medium')}
            className="btn-secondary text-sm px-4 py-2"
          >
            Medium
          </button>
          <button
            onClick={() => onDifficultyChange('hard')}
            className="btn-secondary text-sm px-4 py-2"
          >
            Hard
          </button>
        </motion.div>
      )}

      {/* Mobile directional controls */}
      <motion.div
        className="md:hidden grid grid-cols-3 gap-2 max-w-[200px] mx-auto"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.4 }}
      >
        <div />
        <button
          onClick={() => onDirectionChange('UP')}
          className="bg-gray-700 p-4 rounded-lg active:bg-gray-600"
          disabled={isGameOver || isPaused}
        >
          <ChevronUp className="w-6 h-6 mx-auto" />
        </button>
        <div />
        <button
          onClick={() => onDirectionChange('LEFT')}
          className="bg-gray-700 p-4 rounded-lg active:bg-gray-600"
          disabled={isGameOver || isPaused}
        >
          <ChevronLeft className="w-6 h-6 mx-auto" />
        </button>
        <div />
        <button
          onClick={() => onDirectionChange('RIGHT')}
          className="bg-gray-700 p-4 rounded-lg active:bg-gray-600"
          disabled={isGameOver || isPaused}
        >
          <ChevronRight className="w-6 h-6 mx-auto" />
        </button>
        <div />
        <button
          onClick={() => onDirectionChange('DOWN')}
          className="bg-gray-700 p-4 rounded-lg active:bg-gray-600"
          disabled={isGameOver || isPaused}
        >
          <ChevronDown className="w-6 h-6 mx-auto" />
        </button>
        <div />
      </motion.div>
    </div>
  )
}