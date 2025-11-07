const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const UserProgress = require('../models/UserProgress');
const Course = require('../models/Course');
const Lesson = require('../models/Lesson');
const User = require('../models/User');

// @route   GET /api/analytics/overview
// @desc    Get platform-wide analytics (for MVP success metrics)
// @access  Private (admin in production)
router.get('/overview', async (req, res) => {
  try {
    // Total users
    const totalUsers = await User.countDocuments();
    
    // Total courses and lessons
    const totalCourses = await Course.countDocuments();
    const totalLessons = await Lesson.countDocuments();
    
    // Get all progress records
    const allProgress = await UserProgress.find();
    
    // Calculate lesson completion rate
    const totalLessonStarts = allProgress.reduce((sum, p) => {
      return sum + p.completedLessons.length;
    }, 0);
    
    const totalPossibleLessons = allProgress.length * totalLessons; // Simplified
    const lessonCompletionRate = totalPossibleLessons > 0 
      ? ((totalLessonStarts / totalPossibleLessons) * 100).toFixed(2)
      : 0;
    
    // Calculate quiz attempt conversion
    const totalCompletedLessons = allProgress.reduce((sum, p) => p.completedLessons.length, 0);
    const totalQuizAttempts = allProgress.reduce((sum, p) => p.quizResults.length, 0);
    const quizAttemptConversion = totalCompletedLessons > 0
      ? ((totalQuizAttempts / totalCompletedLessons) * 100).toFixed(2)
      : 0;
    
    // Course completion stats
    const completedCourses = allProgress.filter(p => p.courseCompleted).length;
    const courseCompletionRate = allProgress.length > 0
      ? ((completedCourses / allProgress.length) * 100).toFixed(2)
      : 0;
    
    // Quiz pass rate
    const totalQuizzesPassed = allProgress.reduce(
      (sum, p) => sum + p.quizResults.filter(qr => qr.passed).length,
      0
    );
    const quizPassRate = totalQuizAttempts > 0
      ? ((totalQuizzesPassed / totalQuizAttempts) * 100).toFixed(2)
      : 0;
    
    res.json({
      mvpMetrics: {
        lessonCompletionRate: `${lessonCompletionRate}%`,
        quizAttemptConversion: `${quizAttemptConversion}%`,
        mvpGoals: {
          lessonCompletionGoal: '≥55%',
          quizAttemptGoal: '≥60%'
        }
      },
      platformStats: {
        totalUsers,
        totalCourses,
        totalLessons,
        totalEnrollments: allProgress.length,
        completedCourses,
        courseCompletionRate: `${courseCompletionRate}%`,
        totalLessonsCompleted: totalLessonStarts,
        totalQuizAttempts,
        totalQuizzesPassed,
        quizPassRate: `${quizPassRate}%`
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

// @route   GET /api/analytics/engagement
// @desc    Get user engagement analytics
// @access  Private (admin in production)
router.get('/engagement', async (req, res) => {
  try {
    const allProgress = await UserProgress.find().populate('userId');
    
    // Group by date for daily active users
    const last7Days = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      date.setHours(0, 0, 0, 0);
      last7Days.push(date);
    }
    
    const dailyActivity = last7Days.map(date => {
      const nextDate = new Date(date);
      nextDate.setDate(nextDate.getDate() + 1);
      
      const activeUsers = allProgress.filter(p => {
        const lastAccessed = new Date(p.lastAccessedAt);
        return lastAccessed >= date && lastAccessed < nextDate;
      }).length;
      
      return {
        date: date.toISOString().split('T')[0],
        activeUsers
      };
    });
    
    res.json({
      dailyActivity,
      summary: {
        avgDailyActiveUsers: (dailyActivity.reduce((sum, d) => sum + d.activeUsers, 0) / 7).toFixed(1)
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
