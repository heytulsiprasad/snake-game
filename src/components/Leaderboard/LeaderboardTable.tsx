import type { FC } from 'react'
import { motion } from 'framer-motion'
import { Trophy, Medal, Award } from 'lucide-react'
import type { LeaderboardEntry } from '../../lib/supabase'

interface LeaderboardTableProps {
  entries: LeaderboardEntry[]
  currentUserId?: string
}

export const LeaderboardTable: FC<LeaderboardTableProps> = ({ entries, currentUserId }) => {
  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Trophy className="w-6 h-6 text-yellow-500" />
      case 2:
        return <Medal className="w-6 h-6 text-gray-400" />
      case 3:
        return <Award className="w-6 h-6 text-orange-600" />
      default:
        return <span className="text-gray-500 font-bold">{rank}</span>
    }
  }

  return (
    <div className="bg-gray-800 rounded-lg p-6">
      <h2 className="text-2xl font-bold mb-6 flex items-center">
        <Trophy className="w-8 h-8 mr-2 text-yellow-500" />
        Global Leaderboard
      </h2>

      <div className="space-y-2">
        {entries.map((entry, index) => (
          <motion.div
            key={entry.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className={`flex items-center justify-between p-4 rounded-lg ${
              entry.user_id === currentUserId
                ? 'bg-green-600 bg-opacity-20 border border-green-600'
                : 'bg-gray-700'
            }`}
          >
            <div className="flex items-center space-x-4">
              <div className="w-8 flex justify-center">
                {getRankIcon(index + 1)}
              </div>
              <div>
                <p className="font-semibold">{entry.username}</p>
                <p className="text-sm text-gray-400">
                  {new Date(entry.achieved_at).toLocaleDateString()}
                </p>
              </div>
            </div>
            <div className="text-2xl font-bold">{entry.score}</div>
          </motion.div>
        ))}

        {entries.length === 0 && (
          <p className="text-center text-gray-500 py-8">
            No scores yet. Be the first to play!
          </p>
        )}
      </div>
    </div>
  )
}