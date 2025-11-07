# 🎓 Gamified Learning Platform MVP

A lightweight web-based micro-learning platform that combines structured lessons with gamified assessment to boost engagement and knowledge retention.

## 🎯 MVP Hypothesis

**Gamified progression and reward mechanics measurably increase user learning engagement compared to traditional non-gamified micro-learning.**

## ✨ Features

### Core Learning Features
- 📚 **Course Enrollment** - Browse and enroll in micro-courses
- 📖 **Micro-Lessons** - Short, focused learning content
- 🎯 **Multiple Choice Quizzes** - Knowledge assessment after each lesson
- 📊 **Progress Tracking** - Monitor course completion and quiz results

### Gamification Features
- ⭐ **XP System** - Earn experience points for completing lessons and quizzes
- 📈 **Level Progression** - Level up as you earn XP (Level = √(XP/100) + 1)
- 🏆 **Badges** - Unlock achievements for milestones
- 🎖️ **Points System** - Accumulate points for learning activities
- 📋 **Leaderboard** - See top learners by XP

### Analytics & Metrics
The platform tracks key MVP success metrics:
- Lesson completion rate (Goal: ≥55%)
- Quiz attempt conversion per lesson (Goal: ≥60%)
- User engagement patterns
- Course completion rates
- Quiz pass rates

## 🏗️ Tech Stack

**Backend:**
- Node.js & Express
- MongoDB with Mongoose
- JWT authentication
- bcrypt for password hashing

**Frontend:**
- Vanilla JavaScript (no framework dependencies)
- Modern CSS with CSS Grid & Flexbox
- Responsive design

## 📦 Installation

### Option 1: Using Podman (Recommended - Containerized)

**Prerequisites:**
- Podman installed ([Installation Guide](https://podman.io/getting-started/installation))
- podman-compose installed (`pip3 install podman-compose`)

**Quick Start:**
```bash
# Automated setup - builds, starts, and seeds everything
./podman-setup.sh
```

This script will:
- ✅ Check Podman installation
- ✅ Initialize Podman machine (macOS)
- ✅ Build container images
- ✅ Start MongoDB and App containers
- ✅ Seed the database with sample data
- ✅ Open http://localhost:5000

**Podman Commands:**
```bash
# View logs
./podman-logs.sh          # All services
./podman-logs.sh app      # Just the app
./podman-logs.sh db       # Just MongoDB

# Restart containers
./podman-restart.sh

# Stop everything
./podman-stop.sh

# Or use podman-compose directly
podman-compose ps         # View container status
podman-compose logs -f    # Follow logs
podman-compose down       # Stop and remove containers
podman-compose down -v    # Stop and remove volumes (deletes data)
```

**Access MongoDB:**
```bash
podman exec -it gamified-learning-mongodb mongosh gamified-learning
```

**Access App Container:**
```bash
podman exec -it gamified-learning-app sh
```

---

### Option 2: Local Development (Without Containers)

**Prerequisites:**
- Node.js (v14 or higher)
- MongoDB (running locally or MongoDB Atlas)

**Setup Steps:**

1. **Clone and navigate to the project**
```bash
cd /path/to/project
```

2. **Install dependencies**
```bash
npm install
```

3. **Configure environment variables**
```bash
cp .env.example .env
```

Edit `.env` and configure:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/gamified-learning
JWT_SECRET=your-secret-key-change-in-production
JWT_EXPIRE=7d
NODE_ENV=development
```

4. **Start MongoDB**
```bash
# If using local MongoDB
mongod

# Or use MongoDB Atlas connection string in .env
```

5. **Seed the database with sample data**
```bash
npm run seed
```

This creates:
- 3 sample courses (JavaScript, Python, Web Development)
- Multiple lessons with content
- Quizzes for each lesson
- 7 achievement badges

6. **Start the server**
```bash
npm start

# Or for development with auto-reload:
npm run dev
```

7. **Open the application**
Navigate to `http://localhost:5000` in your browser

## 🎮 Usage

### Getting Started
1. **Sign Up** - Create an account with email and password
2. **Browse Courses** - View available courses on the main page
3. **Enroll** - Click on a course and enroll
4. **Learn** - Complete lessons in order
5. **Take Quizzes** - Test your knowledge after each lesson
6. **Level Up** - Earn XP, unlock badges, and climb the leaderboard!

### User Flow
```
Sign Up/Sign In → Browse Courses → Enroll in Course → 
Complete Lesson → Take Quiz → Earn XP & Badges → 
Next Lesson → Complete Course → View Profile Stats
```

## 📡 API Documentation

### Authentication
- `POST /api/auth/signup` - Register new user
- `POST /api/auth/signin` - Login user
- `GET /api/auth/me` - Get current user (requires auth)

### Courses
- `GET /api/courses` - Get all published courses
- `GET /api/courses/:id` - Get single course with lessons
- `POST /api/courses/:id/enroll` - Enroll in course (requires auth)
- `GET /api/courses/:id/progress` - Get user progress (requires auth)

### Lessons
- `GET /api/lessons/:id` - Get lesson content (requires auth)
- `POST /api/lessons/:id/complete` - Mark lesson as completed (requires auth)

### Quizzes
- `GET /api/quizzes/lesson/:lessonId` - Get quiz for lesson (requires auth)
- `POST /api/quizzes/:id/submit` - Submit quiz answers (requires auth)

### User & Gamification
- `GET /api/users/profile` - Get user profile with stats (requires auth)
- `GET /api/users/leaderboard` - Get top users by XP
- `GET /api/users/badges` - Get all available badges

### Analytics
- `GET /api/analytics/overview` - Platform-wide metrics
- `GET /api/analytics/engagement` - User engagement data

## 📊 Gamification Mechanics

### XP & Leveling
- **Lesson Completion**: 10-20 XP per lesson
- **Quiz Success**: 20-25 XP per quiz (only on first pass)
- **Level Formula**: `Level = floor(sqrt(XP / 100)) + 1`
  - Level 1: 0-99 XP
  - Level 2: 100-399 XP
  - Level 3: 400-899 XP
  - Level 5: 1600-2499 XP
  - Level 10: 8100-9999 XP

### Badges
- 🌟 **First Steps** - Complete your first lesson
- 🚀 **Quick Learner** - Earn 100 XP
- 📚 **Knowledge Seeker** - Earn 500 XP
- 🎓 **Master Scholar** - Earn 1000 XP
- ⭐ **Rising Star** - Reach Level 5
- 🏆 **Champion** - Reach Level 10
- ✅ **Course Completer** - Complete your first course

## 📈 MVP Success Metrics

Access analytics at: `GET /api/analytics/overview`

**Target Metrics:**
- Lesson completion rate: ≥55%
- Quiz attempt conversion: ≥60%
- User engagement feedback: ≥3.7/5 (to be implemented via surveys)

**Tracked Data:**
- Total users and enrollments
- Lesson completion counts
- Quiz attempt and pass rates
- Course completion rates
- Daily active users
- User progression over time

## 🎨 Customization

### Adding New Courses

You can add courses programmatically or via the seed script:

```javascript
const course = await Course.create({
  title: 'Your Course Title',
  description: 'Course description',
  thumbnail: '📚',
  difficulty: 'beginner', // beginner, intermediate, advanced
  estimatedTime: 30,
  lessons: [], // Will add lesson IDs
  totalXP: 100,
  isPublished: true
});
```

### Adjusting Gamification

Edit `models/User.js` to change:
- XP reward amounts
- Level calculation formula
- Badge criteria

## 🚀 Production Deployment

### Podman/Docker Deployment

The application is fully containerized and ready for deployment:

**Build Production Image:**
```bash
podman build -t gamified-learning-platform:latest .
```

**Run with Podman Compose:**
```bash
# Production mode
podman-compose -f podman-compose.yml up -d

# Scale if needed
podman-compose up -d --scale app=3
```

**Push to Registry:**
```bash
# Tag for your registry
podman tag gamified-learning-platform:latest registry.example.com/gamified-learning:latest

# Push
podman push registry.example.com/gamified-learning:latest
```

### Security Checklist
- [ ] Change `JWT_SECRET` to a strong random value (in .env.podman)
- [ ] Use MongoDB Atlas or secure MongoDB instance
- [ ] Enable CORS only for your domain
- [ ] Set `NODE_ENV=production`
- [ ] Use HTTPS (reverse proxy like Nginx/Traefik)
- [ ] Add rate limiting
- [ ] Sanitize user inputs
- [ ] Add password strength requirements
- [ ] Enable MongoDB authentication
- [ ] Use secrets management (not .env files)

### Environment Variables (Production)
```env
NODE_ENV=production
PORT=5000
MONGODB_URI=mongodb://mongodb:27017/gamified-learning
JWT_SECRET=use-strong-random-secret-here
JWT_EXPIRE=7d
```

### Deployment Platforms
- **Containers**: Podman, Docker, Kubernetes
- **Cloud**: AWS ECS, Google Cloud Run, Azure Container Instances
- **PaaS**: Railway, Render, Fly.io
- **Database**: MongoDB Atlas (recommended for production)
- **Reverse Proxy**: Nginx, Traefik, Caddy (for HTTPS)

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
