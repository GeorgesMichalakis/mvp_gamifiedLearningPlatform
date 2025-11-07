# 🎓 Gamified Learning Platform

A micro-learning platform with gamification mechanics (XP, levels, badges) to boost engagement and knowledge retention.

## Features

- 📚 Course enrollment & progress tracking
- 📖 Micro-lessons with quizzes
- ⭐ XP system & level progression
- 🏆 Achievement badges
- � Analytics & metrics tracking
- 🔐 JWT authentication

## Tech Stack

- **Backend:** Node.js, Express, MongoDB
- **Frontend:** Vanilla JavaScript, CSS
- **Containers:** Podman

## Quick Start

### Start with Podman

```bash
# Build and start containers
podman-compose up -d --build

# Wait for MongoDB to be ready
sleep 5

# Seed the database
podman exec gamified-learning-app node scripts/seed.js
```

**Open:** http://localhost:5000

### Stop

```bash
podman-compose down
```

## 🎮 Usage

1. **Sign Up** - Create account with email/password
2. **Browse Courses** - 3 sample courses included
3. **Enroll & Learn** - Complete lessons to earn XP
4. **Take Quizzes** - Pass quizzes for bonus XP
5. **Unlock Badges** - 7 achievements available
6. **View Profile** - Track your progress & stats

## Gamification

### XP & Leveling
- Lesson completion: 10-20 XP
- Quiz pass: 20-25 XP (first time only)
- Level formula: `Level = floor(sqrt(XP / 100)) + 1`

### Badges
- 🌟 First Steps - Complete first lesson
- 🚀 Quick Learner - Earn 100 XP
- 📚 Knowledge Seeker - Earn 500 XP
- 🎓 Master Scholar - Earn 1000 XP
- ⭐ Rising Star - Reach Level 5
- 🏆 Champion - Reach Level 10
- ✅ Course Completer - Complete first course

## Development

```bash
# View logs
podman-compose logs -f

# Access app container
podman exec -it gamified-learning-app sh

# Access MongoDB
podman exec -it gamified-learning-mongodb mongosh gamified-learning

# Restart
podman-compose restart

# Complete reset (removes data)
podman-compose down -v
```

## 📝 License

MIT License - feel free to use this project for learning and development.
