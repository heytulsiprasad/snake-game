import React from 'react'
import { motion } from 'framer-motion'
import { ArrowLeft, Trophy } from 'lucide-react'
import { LeaderboardTable } from './Leaderboard/LeaderboardTable'
import { Button } from './UI/Button'
import { useLeaderboard } from '../hooks/useLeaderboard'
import type { User as SupabaseUser } from '@supabase/supabase-js'

interface LeaderboardPageProps {
  user: SupabaseUser | null
  onBack: () => void
}

export const LeaderboardPage: React.FC<LeaderboardPageProps> = ({ user, onBack }) => {
  const { leaderboard } = useLeaderboard()

  return (
    <div className="min-h-screen bg-game-bg p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div
          className="flex items-center gap-4 mb-8"
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
        >
          <Button
            variant="secondary"
            size="sm"
            onClick={onBack}
          >
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <div className="flex items-center gap-3">
            <Trophy className="w-8 h-8 text-yellow-500" />
            <h1 className="text-3xl font-bold">Global Leaderboard</h1>
          </div>
        </motion.div>

        {/* Leaderboard */}
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.1 }}
        >
          <LeaderboardTable
            entries={leaderboard}
            currentUserId={user?.id}
          />
        </motion.div>

        {/* Stats Summary */}
        {leaderboard.length > 0 && (
          <motion.div
            className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <div className="bg-gray-800 rounded-lg p-4 text-center">
              <p className="text-gray-400 text-sm">Total Players</p>
              <p className="text-2xl font-bold text-green-500">{leaderboard.length}</p>
            </div>
            <div className="bg-gray-800 rounded-lg p-4 text-center">
              <p className="text-gray-400 text-sm">Highest Score</p>
              <p className="text-2xl font-bold text-yellow-500">
                {leaderboard[0]?.high_score || 0}
              </p>
            </div>
            <div className="bg-gray-800 rounded-lg p-4 text-center">
              <p className="text-gray-400 text-sm">Total Games</p>
              <p className="text-2xl font-bold text-blue-500">
                {leaderboard.reduce((sum, entry) => sum + entry.games_played, 0)}
              </p>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  )
}