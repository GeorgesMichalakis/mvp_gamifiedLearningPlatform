# 🎓 Gamified Learning Platform - Complete Setup Guide

## 🚀 Quick Start (Podman - Recommended)

**Single command to get everything running:**

```bash
./podman-setup.sh
```

Then open: **http://localhost:5000**

That's it! The script handles:
- ✅ Podman installation check
- ✅ Container image building  
- ✅ MongoDB setup
- ✅ Database seeding with sample courses
- ✅ Application startup

---

## 📋 What You Get

### Sample Courses (Pre-loaded)
1. **Introduction to JavaScript** (3 lessons, ~20 min)
   - What is JavaScript?
   - Variables and Data Types
   - Functions

2. **Python Basics** (2 lessons, ~11 min)
   - Getting Started with Python
   - Python Variables and Types

3. **Web Development Fundamentals** (1 lesson, ~6 min)
   - The Web Development Trio (HTML/CSS/JS)

### Gamification Features
- ⭐ **7 Achievement Badges** to unlock
- 📈 **Level System** (XP-based progression)
- 🏆 **Points & Leaderboard**
- 📊 **Progress Tracking**

---

## 🎮 How to Use

### 1. Create Account
- Navigate to http://localhost:5000
- Click "Sign Up"
- Enter email and password (min 6 chars)

### 2. Browse & Enroll
- View available courses
- Click on a course to see details
- Click "Enroll in Course"

### 3. Learn & Progress
- Complete lessons by clicking through
- Take quizzes after each lesson
- Earn XP and unlock badges
- Level up your profile!

### 4. Track Your Progress
- Click "Profile" to see your stats
- View earned badges
- Check your level and XP
- See recent activity

---

## 🛠️ Management Commands

### Daily Operations

```bash
# Start everything
./podman-setup.sh

# View logs
./podman-logs.sh       # All services
./podman-logs.sh app   # App only
./podman-logs.sh db    # MongoDB only

# Restart services
./podman-restart.sh

# Stop everything
./podman-stop.sh
```

### Database Management

```bash
# Re-seed database (fresh sample data)
podman exec gamified-learning-app node scripts/seed.js

# Access MongoDB shell
podman exec -it gamified-learning-mongodb mongosh gamified-learning

# Backup database
podman exec gamified-learning-mongodb mongodump \
  --db=gamified-learning --out=/tmp/backup

# Export backup
podman cp gamified-learning-mongodb:/tmp/backup ./backup
```

### Development

```bash
# View container status
podman-compose ps

# Access app container
podman exec -it gamified-learning-app sh

# View environment variables
podman exec gamified-learning-app env

# Rebuild after code changes
podman-compose up -d --build
```

---

## 📊 MVP Success Metrics

Access analytics: `GET http://localhost:5000/api/analytics/overview`

**Goals:**
- Lesson Completion Rate: ≥55%
- Quiz Attempt Conversion: ≥60%
- User Engagement: ≥3.7/5

The platform automatically tracks all metrics!

---

## 🔧 Troubleshooting

### Container won't start
```bash
# Check status
podman ps -a

# View logs
podman logs gamified-learning-app

# Restart everything
./podman-stop.sh
./podman-setup.sh
```

### Port 5000 already in use
```bash
# Find process using port
lsof -ti:5000

# Kill it
lsof -ti:5000 | xargs kill

# Or edit podman-compose.yml to use different port
```

### MongoDB connection failed
```bash
# Check MongoDB is running
podman ps | grep mongodb

# View MongoDB logs
podman logs gamified-learning-mongodb

# Restart MongoDB
podman restart gamified-learning-mongodb
```

### Complete reset
```bash
# Stop and remove everything
podman-compose down -v

# Fresh start
./podman-setup.sh
```

---

## 📚 API Testing

### Using curl

```bash
# Sign up
curl -X POST http://localhost:5000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'

# Get courses
curl http://localhost:5000/api/courses

# Get analytics (requires auth)
TOKEN="your-jwt-token"
curl http://localhost:5000/api/analytics/overview \
  -H "Authorization: Bearer $TOKEN"
```

### Using Browser

Open: http://localhost:5000

All API endpoints:
- Auth: `/api/auth/*`
- Courses: `/api/courses/*`
- Lessons: `/api/lessons/*`
- Quizzes: `/api/quizzes/*`
- Users: `/api/users/*`
- Analytics: `/api/analytics/*`

---

## 🎯 Testing the MVP Hypothesis

### Sample Test Plan

1. **Create 10-20 test users**
2. **Track metrics over 1-2 weeks:**
   - How many complete first lesson?
   - How many take quizzes?
   - What's the completion rate?
3. **Compare with control group** (if possible)
4. **Analyze results:**
   ```bash
   # Get analytics
   curl http://localhost:5000/api/analytics/overview | jq
   ```

### Key Questions
- Does gamification increase engagement?
- Do users complete more lessons?
- Do badges motivate learning?
- What's the quiz pass rate?

---

## 📖 Documentation

- **README.md** - Full project documentation
- **PODMAN_GUIDE.md** - Complete Podman reference
- **API Documentation** - In README.md

---

## 🎨 Customization

### Add Your Own Course

1. Access MongoDB:
```bash
podman exec -it gamified-learning-mongodb mongosh gamified-learning
```

2. Create course:
```javascript
db.courses.insertOne({
  title: "Your Course",
  description: "Course description",
  difficulty: "beginner",
  estimatedTime: 30,
  lessons: [],
  totalXP: 100,
  isPublished: true
})
```

3. Add lessons and quizzes (see seed.js for examples)

### Adjust Gamification

Edit `models/User.js`:
- Change XP rewards
- Modify level formula
- Adjust badge criteria

---

## 🚢 Production Deployment

### Build for production:
```bash
podman build -t gamified-learning:prod .
```

### Deploy to cloud:
1. Push to container registry
2. Deploy on Kubernetes/Cloud Run/ECS
3. Use MongoDB Atlas for database
4. Add HTTPS reverse proxy
5. Set production environment variables

See README.md for full deployment guide.

---

## 🤝 Next Steps

### MVP Testing
1. Deploy to staging environment
2. Recruit test users
3. Collect engagement data
4. Analyze metrics vs. goals
5. Iterate based on results

### Future Features (Post-MVP)
- Video lessons
- Social features
- AI recommendations  
- Course creation UI
- Mobile app
- Advanced analytics

---

## ✨ Summary

You now have a fully functional gamified learning platform running in containers!

**To get started:**
```bash
./podman-setup.sh
```

**Then visit:** http://localhost:5000

Happy learning! 🎓🚀
