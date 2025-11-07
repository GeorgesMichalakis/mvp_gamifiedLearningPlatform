const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Lesson = require('../models/Lesson');
const UserProgress = require('../models/UserProgress');
const User = require('../models/User');
const Badge = require('../models/Badge');

// @route   GET /api/lessons/:id
// @desc    Get single lesson
// @access  Private
router.get('/:id', auth, async (req, res) => {
  try {
    const lesson = await Lesson.findById(req.params.id)
      .populate('courseId')
      .populate('quiz');
    
    if (!lesson) {
      return res.status(404).json({ error: 'Lesson not found' });
    }

    // Check if user is enrolled in the course
    const progress = await UserProgress.findOne({
      userId: req.user._id,
      courseId: lesson.courseId._id
    });

    if (!progress) {
      return res.status(403).json({ error: 'Not enrolled in this course' });
    }

    res.json(lesson);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Helper function to check and award badges
const checkAndAwardBadges = async (user) => {
  const badges = await Badge.find();
  const newBadges = [];

  for (const badge of badges) {
    // Skip if user already has this badge
    const hasBadge = user.badges.some(b => b.toString() === badge._id.toString());
    if (hasBadge) {
      continue;
    }

    let shouldAward = false;

    switch (badge.criteria) {
      case 'complete_first_lesson':
        shouldAward = true; // Called after completing a lesson
        break;
      case 'reach_level_5':
        shouldAward = user.level >= 5;
        break;
      case 'reach_level_10':
        shouldAward = user.level >= 10;
        break;
      case 'earn_100_xp':
        shouldAward = user.xp >= 100;
        break;
      case 'earn_500_xp':
        shouldAward = user.xp >= 500;
        break;
      case 'earn_1000_xp':
        shouldAward = user.xp >= 1000;
        break;
      case 'complete_first_course':
        const completedCourses = await UserProgress.countDocuments({
          userId: user._id,
          courseCompleted: true
        });
        shouldAward = completedCourses >= 1;
        break;
      default:
        break;
    }

    if (shouldAward) {
      user.badges.push(badge._id);
      newBadges.push(badge);
    }
  }

  if (newBadges.length > 0) {
    await user.save();
  }

  return newBadges;
};

// @route   POST /api/lessons/:id/complete
// @desc    Mark lesson as completed
// @access  Private
router.post('/:id/complete', auth, async (req, res) => {
  try {
    const lesson = await Lesson.findById(req.params.id).populate('courseId');
    
    if (!lesson) {
      return res.status(404).json({ error: 'Lesson not found' });
    }

    const progress = await UserProgress.findOne({
      userId: req.user._id,
      courseId: lesson.courseId._id
    });

    if (!progress) {
      return res.status(403).json({ error: 'Not enrolled in this course' });
    }

    // Check if already completed
    const alreadyCompleted = progress.completedLessons.some(
      cl => cl.lessonId.toString() === lesson._id.toString()
    );

    if (alreadyCompleted) {
      return res.status(400).json({ error: 'Lesson already completed' });
    }

    // Add to completed lessons
    progress.completedLessons.push({
      lessonId: lesson._id,
      completedAt: new Date()
    });

    // Update last accessed
    progress.lastAccessedAt = new Date();

    await progress.save();

    // Award XP to user
    const user = await User.findById(req.user._id).populate('badges');
    user.addXP(lesson.xpReward);
    await user.save();

    // Check for new badges
    const newBadges = await checkAndAwardBadges(user);

    // Check if course is completed
    const totalLessons = lesson.courseId.lessons.length;
    const completedLessonsCount = progress.completedLessons.length;
    
    if (completedLessonsCount === totalLessons && !progress.courseCompleted) {
      progress.courseCompleted = true;
      progress.completedAt = new Date();
      await progress.save();

      // Check for course completion badges
      const courseCompletionBadges = await checkAndAwardBadges(user);
      newBadges.push(...courseCompletionBadges);
    }

    res.json({
      message: 'Lesson completed',
      xpEarned: lesson.xpReward,
      newLevel: user.level,
      totalXP: user.xp,
      newBadges,
      courseCompleted: progress.courseCompleted
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
