# 🎓 Gamified Learning Platform

A micro-learning platform with gamification mechanics (XP, levels, badges) to boost engagement and knowledge retention.

## ✨ Features

- 📚 Course enrollment & progress tracking
- 📖 Micro-lessons with quizzes
- ⭐ XP system & level progression
- 🏆 Achievement badges
- � Analytics & metrics tracking
- 🔐 JWT authentication

## 🏗️ Tech Stack

- **Backend:** Node.js, Express, MongoDB
- **Frontend:** Vanilla JavaScript, CSS
- **Containers:** Podman

## � Quick Start

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

## 📡 API Endpoints

### Authentication
- `POST /api/auth/signup` - Register
- `POST /api/auth/signin` - Login
- `GET /api/auth/me` - Get current user

### Courses
- `GET /api/courses` - List all courses
- `GET /api/courses/:id` - Get course details
- `POST /api/courses/:id/enroll` - Enroll in course
- `GET /api/courses/:id/progress` - Get progress

### Lessons & Quizzes
- `GET /api/lessons/:id` - Get lesson
- `POST /api/lessons/:id/complete` - Mark complete
- `GET /api/quizzes/lesson/:lessonId` - Get quiz
- `POST /api/quizzes/:id/submit` - Submit answers

### Users & Gamification
- `GET /api/users/profile` - User profile & stats
- `GET /api/users/leaderboard` - Top users
- `GET /api/users/badges` - All badges

### Analytics
- `GET /api/analytics/overview` - Platform metrics
- `GET /api/analytics/engagement` - Engagement data

## 📊 Gamification

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

## �️ Development

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

## 📁 Project Structure

```
├── models/              # Mongoose schemas
│   ├── User.js         # User model with gamification
│   ├── Course.js       # Course model
│   ├── Lesson.js       # Lesson model
│   ├── Quiz.js         # Quiz model
│   ├── UserProgress.js # Progress tracking
│   └── Badge.js        # Achievement badges
├── routes/             # Express routes
│   ├── auth.js         # Authentication endpoints
│   ├── courses.js      # Course endpoints
│   ├── lessons.js      # Lesson endpoints
│   ├── quizzes.js      # Quiz endpoints
│   ├── users.js        # User & gamification endpoints
│   └── analytics.js    # Analytics endpoints
├── middleware/         # Express middleware
│   └── auth.js         # JWT authentication
├── public/             # Frontend files
│   ├── index.html      # SPA entry point
│   ├── css/
│   │   └── styles.css  # Application styles
│   └── js/
│       └── app.js      # Frontend JavaScript
├── scripts/            # Utility scripts
│   └── seed.js         # Database seeding
├── server.js           # Express app & server
├── package.json        # Dependencies
├── Dockerfile          # Container image definition
├── podman-compose.yml  # Multi-container setup
├── podman-setup.sh     # Automated Podman setup
├── podman-stop.sh      # Stop containers
├── podman-restart.sh   # Restart containers
├── podman-logs.sh      # View container logs
├── .env.example        # Environment template
└── .env.podman         # Podman environment vars
```

## 🤝 Contributing

This is an MVP. Future enhancements could include:
- Social learning features
- Course creation UI
- AI-powered recommendations
- Video content support
- Peer-to-peer learning
- Advanced analytics dashboard
- Mobile app
- Spaced repetition system

## 📝 License

MIT License - feel free to use this project for learning and development.

## 🐛 Troubleshooting

**MongoDB Connection Error**
- Ensure MongoDB is running: `mongod`
- Check connection string in `.env`

**Port Already in Use**
- Change PORT in `.env`
- Or kill process: `lsof -ti:5000 | xargs kill`

**Seed Script Fails**
- Ensure MongoDB is running
- Check database connection string
- Clear database: `mongo gamified-learning --eval "db.dropDatabase()"`

**Login Issues**
- Clear browser localStorage
- Check JWT_SECRET is set in .env
- Verify MongoDB is running

## 📧 Support

For issues and questions, please create an issue in the repository.

---

**Built with ❤️ to prove gamification improves learning engagement**
