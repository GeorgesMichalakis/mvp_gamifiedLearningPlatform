# 🎓 Gamified Learning Platform - Visual Architecture

## 🏗️ System Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         USER'S BROWSER                          │
│                                                                 │
│  ┌───────────────────────────────────────────────────────────┐ │
│  │                    Frontend (SPA)                         │ │
│  │  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐ │ │
│  │  │  Auth    │  │ Courses  │  │ Lessons  │  │ Profile  │ │ │
│  │  │  Page    │  │ Catalog  │  │ & Quizzes│  │ & Stats  │ │ │
│  │  └──────────┘  └──────────┘  └──────────┘  └──────────┘ │ │
│  │              index.html + app.js + styles.css            │ │
│  └───────────────────────────────────────────────────────────┘ │
└───────────────────────────┬─────────────────────────────────────┘
                            │ HTTP/HTTPS
                            │ REST API Calls
                            ↓
┌─────────────────────────────────────────────────────────────────┐
│                      PODMAN HOST                                │
│                                                                 │
│  ┌───────────────────────────────────────────────────────────┐ │
│  │           gamified-learning-network (bridge)              │ │
│  │                                                           │ │
│  │  ┌─────────────────────────────────────────────────────┐ │ │
│  │  │  App Container (gamified-learning-app)              │ │ │
│  │  │  ┌───────────────────────────────────────────────┐  │ │ │
│  │  │  │         Express.js Server                     │  │ │ │
│  │  │  │                                               │  │ │ │
│  │  │  │  ┌──────────────────────────────────────┐    │  │ │ │
│  │  │  │  │          API Routes                  │    │  │ │ │
│  │  │  │  │  /api/auth    - Auth endpoints       │    │  │ │ │
│  │  │  │  │  /api/courses - Course management    │    │  │ │ │
│  │  │  │  │  /api/lessons - Lesson tracking      │    │  │ │ │
│  │  │  │  │  /api/quizzes - Quiz system          │    │  │ │ │
│  │  │  │  │  /api/users   - Gamification         │    │  │ │ │
│  │  │  │  │  /api/analytics - Metrics            │    │  │ │ │
│  │  │  │  └──────────────────────────────────────┘    │  │ │ │
│  │  │  │                                               │  │ │ │
│  │  │  │  ┌──────────────────────────────────────┐    │  │ │ │
│  │  │  │  │        Business Logic                │    │  │ │ │
│  │  │  │  │  - JWT Authentication                │    │  │ │ │
│  │  │  │  │  - XP Calculation                    │    │  │ │ │
│  │  │  │  │  - Badge Awarding                    │    │  │ │ │
│  │  │  │  │  - Progress Tracking                 │    │  │ │ │
│  │  │  │  └──────────────────────────────────────┘    │  │ │ │
│  │  │  │                                               │  │ │ │
│  │  │  │  ┌──────────────────────────────────────┐    │  │ │ │
│  │  │  │  │     Mongoose ODM                     │    │  │ │ │
│  │  │  │  └──────────────────────────────────────┘    │  │ │ │
│  │  │  └───────────────────────────────────────────────┘  │ │ │
│  │  │                                                     │ │ │
│  │  │  Port: 5000                                        │ │ │
│  │  │  Health Check: /api/courses                        │ │ │
│  │  └─────────────────────────────────────────────────────┘ │ │
│  │                            ↕                             │ │
│  │                   mongodb://mongodb:27017                │ │
│  │                            ↕                             │ │
│  │  ┌─────────────────────────────────────────────────────┐ │ │
│  │  │  MongoDB Container (gamified-learning-mongodb)      │ │ │
│  │  │                                                     │ │ │
│  │  │  ┌───────────────────────────────────────────────┐ │ │ │
│  │  │  │         MongoDB 7.0                          │ │ │ │
│  │  │  │                                               │ │ │ │
│  │  │  │  Database: gamified-learning                 │ │ │ │
│  │  │  │                                               │ │ │ │
│  │  │  │  Collections:                                │ │ │ │
│  │  │  │  - users        (auth + gamification)        │ │ │ │
│  │  │  │  - courses      (course catalog)             │ │ │ │
│  │  │  │  - lessons      (learning content)           │ │ │ │
│  │  │  │  - quizzes      (assessments)                │ │ │ │
│  │  │  │  - userprogresses (tracking)                 │ │ │ │
│  │  │  │  - badges       (achievements)               │ │ │ │
│  │  │  └───────────────────────────────────────────────┘ │ │ │
│  │  │                                                     │ │ │
│  │  │  Port: 27017                                        │ │ │
│  │  │  Volumes: mongodb_data, mongodb_config             │ │ │
│  │  │  Health Check: mongosh ping                        │ │ │
│  │  └─────────────────────────────────────────────────────┘ │ │
│  └───────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────┘
```

## 📊 Data Flow

### User Authentication Flow
```
User Browser
    │
    ├─ POST /api/auth/signup {email, password}
    │       │
    │       ↓
    │   Express Server
    │       │
    │       ├─ Hash password (bcrypt)
    │       ├─ Create user in MongoDB
    │       ├─ Generate JWT token
    │       │
    │       ↓
    │   MongoDB (users collection)
    │       │
    │       ↓
    ├─ Response {token, user}
    │
    └─ Store token in localStorage
```

### Learning Flow
```
1. Browse Courses
   GET /api/courses → MongoDB → Return course list

2. Enroll in Course
   POST /api/courses/:id/enroll
       ↓
   Create UserProgress record
       ↓
   Add to user.enrolledCourses
       ↓
   Increment course.enrolledCount

3. View Lesson
   GET /api/lessons/:id
       ↓
   Check enrollment
       ↓
   Return lesson content

4. Complete Lesson
   POST /api/lessons/:id/complete
       ↓
   Add to progress.completedLessons
       ↓
   Award XP to user
       ↓
   Calculate new level
       ↓
   Check and award badges
       ↓
   Return {xpEarned, newLevel, newBadges}

5. Take Quiz
   GET /api/quizzes/lesson/:lessonId
       ↓
   Return questions (without answers)

6. Submit Quiz
   POST /api/quizzes/:id/submit {answers}
       ↓
   Grade answers
       ↓
   Calculate score
       ↓
   Save to progress.quizResults
       ↓
   Award XP if passed (first time)
       ↓
   Return {score, passed, xpEarned, answers}
```

### Gamification Flow
```
Action (Complete Lesson/Quiz)
    │
    ↓
Award XP
    │
    ├─ user.xp += amount
    ├─ user.points += amount
    │
    ↓
Calculate Level
    │
    ├─ level = floor(sqrt(xp / 100)) + 1
    │
    ↓
Check Badge Criteria
    │
    ├─ For each badge:
    │   ├─ Check XP threshold
    │   ├─ Check level threshold
    │   ├─ Check course completion
    │   └─ Award if criteria met
    │
    ↓
Save to Database
    │
    └─ Return rewards to frontend
```

## 🔄 Request/Response Examples

### Sign Up
```http
POST /api/auth/signup
Content-Type: application/json

{
  "email": "learner@example.com",
  "password": "secure123"
}

Response 201:
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "email": "learner@example.com",
    "xp": 0,
    "level": 1,
    "points": 0,
    "badges": []
  }
}
```

### Get Courses
```http
GET /api/courses

Response 200:
[
  {
    "_id": "507f191e810c19729de860ea",
    "title": "Introduction to JavaScript",
    "description": "Learn JavaScript basics...",
    "difficulty": "beginner",
    "estimatedTime": 20,
    "totalXP": 115,
    "lessons": [...],
    "enrolledCount": 42
  }
]
```

### Complete Lesson
```http
POST /api/lessons/507f191e810c19729de860ea/complete
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

Response 200:
{
  "message": "Lesson completed",
  "xpEarned": 10,
  "newLevel": 2,
  "totalXP": 150,
  "newBadges": [
    {
      "name": "First Steps",
      "icon": "🌟",
      "description": "Complete your first lesson"
    }
  ],
  "courseCompleted": false
}
```

### Submit Quiz
```http
POST /api/quizzes/507f191e810c19729de860ea/submit
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
Content-Type: application/json

{
  "answers": [1, 2, 0]  // Selected option indices
}

Response 200:
{
  "score": 67,
  "passed": true,
  "correctCount": 2,
  "totalQuestions": 3,
  "xpEarned": 20,
  "newLevel": 2,
  "answers": [
    {
      "questionIndex": 0,
      "selectedAnswer": 1,
      "isCorrect": true,
      "correctAnswer": 1,
      "explanation": "JavaScript is primarily used..."
    }
  ]
}
```

## 🗄️ Database Schema

### Users Collection
```javascript
{
  _id: ObjectId,
  email: String,
  password: String (hashed),
  xp: Number,
  level: Number,
  points: Number,
  badges: [ObjectId],
  enrolledCourses: [ObjectId],
  createdAt: Date,
  updatedAt: Date
}
```

### Courses Collection
```javascript
{
  _id: ObjectId,
  title: String,
  description: String,
  difficulty: "beginner" | "intermediate" | "advanced",
  estimatedTime: Number,
  lessons: [ObjectId],
  totalXP: Number,
  enrolledCount: Number,
  isPublished: Boolean,
  createdAt: Date
}
```

### UserProgress Collection
```javascript
{
  _id: ObjectId,
  userId: ObjectId,
  courseId: ObjectId,
  completedLessons: [
    {
      lessonId: ObjectId,
      completedAt: Date
    }
  ],
  quizResults: [
    {
      quizId: ObjectId,
      score: Number,
      passed: Boolean,
      attemptedAt: Date
    }
  ],
  enrolledAt: Date,
  lastAccessedAt: Date,
  courseCompleted: Boolean
}
```

## 🎮 Gamification Formulas

### Level Calculation
```javascript
// Current formula
level = Math.floor(Math.sqrt(xp / 100)) + 1

// XP Requirements
Level 1:  0-99 XP
Level 2:  100-399 XP
Level 3:  400-899 XP
Level 4:  900-1599 XP
Level 5:  1600-2499 XP
Level 10: 8100-9999 XP
```

### XP Awards
```javascript
Lesson Completion: 10-20 XP (varies by difficulty)
Quiz Pass:         20-25 XP (first pass only)
Course Completion: Sum of all lessons + quizzes
```

### Badge Awards (Automatic)
```javascript
On lesson complete → Check badge criteria
On XP change      → Check XP thresholds
On level up       → Check level thresholds
On course done    → Check completion badges
```

## 🔐 Security Layers

```
┌─────────────────────────────────────┐
│  Request from Browser               │
└─────────────────┬───────────────────┘
                  │
                  ↓
┌─────────────────────────────────────┐
│  CORS Check                         │
│  (Allow configured origins)         │
└─────────────────┬───────────────────┘
                  │
                  ↓
┌─────────────────────────────────────┐
│  JWT Token Validation               │
│  (For protected routes)             │
└─────────────────┬───────────────────┘
                  │
                  ↓
┌─────────────────────────────────────┐
│  Input Validation                   │
│  (express-validator)                │
└─────────────────┬───────────────────┘
                  │
                  ↓
┌─────────────────────────────────────┐
│  Business Logic                     │
│  (Authorization checks)             │
└─────────────────┬───────────────────┘
                  │
                  ↓
┌─────────────────────────────────────┐
│  MongoDB                            │
│  (Mongoose schema validation)       │
└─────────────────────────────────────┘
```

## 📦 Container Startup Sequence

```
1. podman-compose up
       │
       ↓
2. Pull/Build Images
   ├─ mongo:7.0 (pull from Docker Hub)
   └─ gamified-learning-app (build from Dockerfile)
       │
       ↓
3. Create Network
   └─ gamified-learning-network
       │
       ↓
4. Start MongoDB Container
   ├─ Mount volumes (mongodb_data, mongodb_config)
   ├─ Expose port 27017
   └─ Run health check (mongosh ping)
       │
       ↓
5. Wait for MongoDB healthy
       │
       ↓
6. Start App Container
   ├─ Set environment variables
   ├─ Connect to MongoDB
   ├─ Expose port 5000
   └─ Run: node server.js
       │
       ↓
7. System Ready
   └─ Access at http://localhost:5000
```

---

This visual guide shows exactly how all the pieces fit together! 🎓🚀
