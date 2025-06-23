import React, { FC } from 'react'
import { motion } from 'framer-motion'
import { Trophy, Apple, Clock, Zap } from 'lucide-react'
import { GameState } from '../../types/game'

interface GameStatsProps {
  gameState: GameState
}

export const GameStats: FC<GameStatsProps> = ({ gameState }) => {
  const gameDuration = Math.floor((Date.now() - gameState.startTime) / 1000)
  const minutes = Math.floor(gameDuration / 60)
  const seconds = gameDuration % 60

  return (
    <motion.div
      className="grid grid-cols-2 md:grid-cols-4 gap-4"
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 0.2 }}
    >
      <div className="bg-gray-800 rounded-lg p-4 flex items-center space-x-3">
        <Trophy className="text-yellow-500 w-6 h-6" />
        <div>
          <p className="text-xs text-gray-400">Score</p>
          <p className="text-xl font-bold">{gameState.score}</p>
        </div>
      </div>

      <div className="bg-gray-800 rounded-lg p-4 flex items-center space-x-3">
        <Apple className="text-red-500 w-6 h-6" />
        <div>
          <p className="text-xs text-gray-400">Food</p>
          <p className="text-xl font-bold">{gameState.foodEaten}</p>
        </div>
      </div>

      <div className="bg-gray-800 rounded-lg p-4 flex items-center space-x-3">
        <Clock className="text-blue-500 w-6 h-6" />
        <div>
          <p className="text-xs text-gray-400">Time</p>
          <p className="text-xl font-bold">
            {minutes.toString().padStart(2, '0')}:{seconds.toString().padStart(2, '0')}
          </p>
        </div>
      </div>

      <div className="bg-gray-800 rounded-lg p-4 flex items-center space-x-3">
        <Zap className="text-green-500 w-6 h-6" />
        <div>
          <p className="text-xs text-gray-400">Level</p>
          <p className="text-xl font-bold">{gameState.level}</p>
        </div>
      </div>
    </motion.div>
  )
}