# 🐍 Snake Game with MCP Integration

A modern Snake game built with React, TypeScript, and Supabase, showcasing comprehensive MCP (Model Context Protocol) integration for authentication, data persistence, and leaderboards.

## 🎮 Features

- **Classic Snake Gameplay**: Navigate the snake to collect food and grow longer
- **Authentication**: User registration and login via Supabase Auth
- **Game History**: Track your games and scores in the cloud
- **Leaderboard**: Compete with other players globally
- **Difficulty Levels**: Multiple difficulty settings for varied challenge
- **Responsive Design**: Works on desktop and mobile devices

## 🛠️ Technology Stack

- **Frontend**: React + TypeScript + Vite
- **Styling**: Tailwind CSS
- **Backend**: Supabase (Authentication, Database, Real-time)
- **MCP Tools**: 
  - Supabase MCP for backend operations
  - Context7 for documentation
  - GitHub MCP for version control
  - Memory MCP for persistence

## 📋 Prerequisites

- Node.js (v18 or higher)
- pnpm (recommended) or npm
- Supabase account

## 🚀 Setup Instructions

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/snake-game.git
   cd snake-game
   ```

2. **Install dependencies**
   ```bash
   pnpm install
   # or npm install
   ```

3. **Environment Configuration**
   - Copy `.env.example` to `.env`
   - Add your Supabase credentials:
     ```
     VITE_SUPABASE_URL=your_supabase_url
     VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
     ```

4. **Run the development server**
   ```bash
   pnpm dev
   # or npm run dev
   ```

5. **Build for production**
   ```bash
   pnpm build
   # or npm run build
   ```

## 🗄️ Database Schema

### Users Table
- `id`: UUID (Primary Key)
- `email`: String
- `username`: String
- `created_at`: Timestamp

### Game History Table
- `id`: UUID (Primary Key)
- `user_id`: UUID (Foreign Key)
- `score`: Integer
- `level`: Integer
- `duration`: Integer (seconds)
- `created_at`: Timestamp

### Leaderboard View
- Aggregated view of top scores by user

## 🎯 Game Controls

- **Arrow Keys**: Move the snake (Up, Down, Left, Right)
- **WASD**: Alternative movement controls
- **Space**: Pause/Resume game
- **R**: Restart game

## 🏗️ Project Structure

```
snake-game/
├── src/
│   ├── components/
│   │   ├── Game/
│   │   ├── Auth/
│   │   └── UI/
│   ├── hooks/
│   ├── lib/
│   │   └── supabase.ts
│   ├── types/
│   └── utils/
├── public/
├── tests/
└── package.json
```

## 🧪 Testing

```bash
# Run unit tests
pnpm test
# or npm run test

# Run e2e tests
pnpm test:e2e
# or npm run test:e2e
```

## 📝 License

MIT License - see LICENSE file for details

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 🐛 Bug Reports

Please report bugs via GitHub Issues with:
- Steps to reproduce
- Expected behavior
- Actual behavior
- Browser/OS information