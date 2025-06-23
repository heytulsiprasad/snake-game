import React from 'react'
import { motion } from 'framer-motion'
import { Play, Trophy, LogIn, BarChart3 } from 'lucide-react'
import { Button } from './UI/Button'

interface HomePageProps {
  onPlayAsGuest: () => void
  onSignIn: () => void
  onViewLeaderboard: () => void
}

export const HomePage: React.FC<HomePageProps> = ({ onPlayAsGuest, onSignIn, onViewLeaderboard }) => {
  return (
    <div className="min-h-screen bg-game-bg flex items-center justify-center p-4">
      <motion.div
        className="max-w-md w-full text-center"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        {/* Logo and Title */}
        <motion.div
          className="mb-12"
          initial={{ y: -20 }}
          animate={{ y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <h1 className="text-6xl mb-4">🐍</h1>
          <h2 className="text-4xl font-bold text-green-500 mb-2">Snake Game</h2>
          <p className="text-gray-400">Classic snake game with modern features</p>
        </motion.div>

        {/* Game Options */}
        <motion.div
          className="space-y-4"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          {/* Sign In Option */}
          <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
            <Trophy className="w-12 h-12 text-yellow-500 mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">Track Your Progress</h3>
            <p className="text-gray-400 text-sm mb-4">
              Sign in to save your scores, compete on the leaderboard, and track your game history
            </p>
            <Button
              variant="primary"
              fullWidth
              onClick={onSignIn}
            >
              <LogIn className="w-4 h-4 mr-2" />
              Sign In to Play
            </Button>
          </div>

          {/* Guest Option */}
          <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
            <Play className="w-12 h-12 text-green-500 mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">Quick Play</h3>
            <p className="text-gray-400 text-sm mb-4">
              Jump right into the game without signing in. Your scores won't be saved.
            </p>
            <Button
              variant="secondary"
              fullWidth
              onClick={onPlayAsGuest}
            >
              <Play className="w-4 h-4 mr-2" />
              Play as Guest
            </Button>
          </div>

          {/* View Leaderboard */}
          <button
            onClick={onViewLeaderboard}
            className="bg-gray-800 rounded-lg p-4 border border-gray-700 hover:border-gray-600 transition-all text-left group"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <BarChart3 className="w-8 h-8 text-purple-500" />
                <div>
                  <h3 className="font-semibold">View Leaderboard</h3>
                  <p className="text-gray-400 text-sm">See top players</p>
                </div>
              </div>
              <span className="text-gray-500 group-hover:text-gray-400 transition-colors">→</span>
            </div>
          </button>
        </motion.div>

        {/* Features */}
        <motion.div
          className="mt-12 grid grid-cols-2 gap-4 text-sm text-gray-400"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          <div>
            <p>🎮 Classic Gameplay</p>
            <p>📱 Mobile Friendly</p>
          </div>
          <div>
            <p>🏆 Global Leaderboard</p>
            <p>📊 Track Progress</p>
          </div>
        </motion.div>
      </motion.div>
    </div>
  )
}