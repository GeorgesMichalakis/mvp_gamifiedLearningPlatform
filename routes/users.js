const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const User = require('../models/User');
const UserProgress = require('../models/UserProgress');
const Badge = require('../models/Badge');

// @route   GET /api/users/profile
// @desc    Get user profile with gamification stats
// @access  Private
router.get('/profile', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user._id)
      .select('-password')
      .populate('badges')
      .populate({
        path: 'enrolledCourses',
        select: 'title description thumbnail'
      });

    // Get progress for all enrolled courses
    const progressRecords = await UserProgress.find({ userId: user._id })
      .populate('courseId');

    // Calculate stats
    const totalCoursesEnrolled = user.enrolledCourses.length;
    const totalCoursesCompleted = progressRecords.filter(p => p.courseCompleted).length;
    const totalLessonsCompleted = progressRecords.reduce((sum, p) => sum + p.completedLessons.length, 0);
    const totalQuizzesAttempted = progressRecords.reduce((sum, p) => sum + p.quizResults.length, 0);
    const totalQuizzesPassed = progressRecords.reduce(
      (sum, p) => sum + p.quizResults.filter(qr => qr.passed).length, 
      0
    );

    // Calculate XP needed for next level
    const currentLevel = user.level;
    const xpForNextLevel = Math.pow(currentLevel, 2) * 100; // Inverse of level formula
    const xpProgress = user.xp - (Math.pow(currentLevel - 1, 2) * 100);
    const xpRequired = xpForNextLevel - (Math.pow(currentLevel - 1, 2) * 100);

    res.json({
      user: {
        id: user._id,
        email: user.email,
        xp: user.xp,
        level: user.level,
        points: user.points,
        badges: user.badges,
        enrolledCourses: user.enrolledCourses
      },
      stats: {
        totalCoursesEnrolled,
        totalCoursesCompleted,
        totalLessonsCompleted,
        totalQuizzesAttempted,
        totalQuizzesPassed,
        quizPassRate: totalQuizzesAttempted > 0 
          ? Math.round((totalQuizzesPassed / totalQuizzesAttempted) * 100) 
          : 0
      },
      levelProgress: {
        currentLevel,
        nextLevel: currentLevel + 1,
        xpProgress,
        xpRequired,
        progressPercentage: Math.round((xpProgress / xpRequired) * 100)
      },
      recentActivity: progressRecords.map(p => ({
        courseId: p.courseId._id,
        courseTitle: p.courseId.title,
        lastAccessed: p.lastAccessedAt,
        completed: p.courseCompleted,
        lessonsCompleted: p.completedLessons.length,
        totalLessons: p.courseId.lessons.length
      }))
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

// @route   GET /api/users/leaderboard
// @desc    Get leaderboard (top users by XP)
// @access  Public
router.get('/leaderboard', async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 10;
    
    const topUsers = await User.find()
      .select('email xp level points badges')
      .sort({ xp: -1 })
      .limit(limit)
      .populate('badges');

    res.json(topUsers.map((user, index) => ({
      rank: index + 1,
      email: user.email.substring(0, 3) + '***', // Anonymize email
      xp: user.xp,
      level: user.level,
      badgeCount: user.badges.length
    })));
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

// @route   GET /api/users/badges
// @desc    Get all available badges
// @access  Public
router.get('/badges', async (req, res) => {
  try {
    const badges = await Badge.find().sort({ xpThreshold: 1 });
    res.json(badges);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
