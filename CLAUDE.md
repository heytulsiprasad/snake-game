# Snake Game - Development Context

## Project Overview
Building a modern Snake game with React, TypeScript, and Supabase integration. The game features user authentication, game history tracking, and a global leaderboard.

## Key Requirements
- Classic snake game mechanics (snake moves continuously, grows when eating food)
- Responsive design for both mobile and desktop
- User authentication with Supabase
- Store game history and high scores
- Global leaderboard
- Smooth gameplay with proper collision detection

## Supabase Project Details
- Project ID: usazedyvkkzfvdtcaooe
- Project Name: snake-game
- Region: us-east-2
- Status: ACTIVE_HEALTHY
- Database Host: db.usazedyvkkzfvdtcaooe.supabase.co

## Technical Architecture

### Frontend Stack
- React 18+ with TypeScript
- Vite for build tooling
- Tailwind CSS for styling
- Canvas API for game rendering

### Game Mechanics
- Grid-based movement (20x20 grid)
- Snake speed increases with score
- Wrap-around borders (snake appears on opposite side)
- Food spawns randomly on empty cells
- Game over on self-collision

### Controls
- Desktop: Arrow keys or WASD
- Mobile: Touch swipe gestures
- Space bar to pause/resume

### Database Schema Design
```sql
-- Users extend Supabase auth.users
CREATE TABLE profiles (
  id UUID REFERENCES auth.users PRIMARY KEY,
  username TEXT UNIQUE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Game history
CREATE TABLE games (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL,
  score INTEGER NOT NULL,
  level INTEGER NOT NULL DEFAULT 1,
  duration INTEGER NOT NULL, -- in seconds
  food_eaten INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Leaderboard view
CREATE VIEW leaderboard AS
SELECT 
  p.username,
  MAX(g.score) as high_score,
  COUNT(g.id) as games_played,
  SUM(g.food_eaten) as total_food_eaten
FROM games g
JOIN profiles p ON g.user_id = p.id
GROUP BY p.username
ORDER BY high_score DESC;
```

## Component Structure
```
src/
├── components/
│   ├── Game/
│   │   ├── GameBoard.tsx      // Main game canvas
│   │   ├── GameControls.tsx   // Control buttons
│   │   ├── GameStats.tsx      // Score, level display
│   │   └── TouchControls.tsx  // Mobile swipe handler
│   ├── Auth/
│   │   ├── LoginForm.tsx
│   │   ├── SignupForm.tsx
│   │   └── AuthProvider.tsx
│   ├── Leaderboard/
│   │   └── LeaderboardTable.tsx
│   └── UI/
│       ├── Button.tsx
│       ├── Card.tsx
│       └── Modal.tsx
├── hooks/
│   ├── useGame.ts         // Game logic hook
│   ├── useAuth.ts         // Auth state hook
│   └── useSupabase.ts     // Supabase client hook
├── lib/
│   └── supabase.ts        // Supabase client setup
├── types/
│   └── game.ts            // TypeScript interfaces
└── utils/
    ├── gameLogic.ts       // Core game functions
    └── constants.ts       // Game constants
```

## Development Progress
- [x] Create README.md
- [x] Create CLAUDE.md
- [ ] Set up project structure
- [ ] Configure Supabase connection
- [ ] Create database schema
- [ ] Implement authentication
- [ ] Build game mechanics
- [ ] Add responsive controls
- [ ] Create leaderboard
- [ ] Add game history tracking

## Important Notes
- Use Supabase Row Level Security (RLS) for data protection
- Implement proper error handling for network issues
- Optimize canvas rendering for smooth gameplay
- Test on various screen sizes for responsiveness
- Consider adding sound effects and animations later

## MCP Tools Used
1. **Supabase MCP**: Database operations, auth, real-time updates
2. **Context7**: Documentation lookup for React/TypeScript best practices
3. **GitHub MCP**: Version control and collaboration
4. **Memory MCP**: Persist development context and decisions

## Next Steps
1. Complete project setup with all dependencies
2. Create Supabase tables and RLS policies
3. Implement core game loop
4. Add authentication flow
5. Connect game to database
6. Build leaderboard component
7. Add mobile touch controls
8. Comprehensive testing