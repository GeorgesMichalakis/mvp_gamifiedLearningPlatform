const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Quiz = require('../models/Quiz');
const Lesson = require('../models/Lesson');
const UserProgress = require('../models/UserProgress');
const User = require('../models/User');

// @route   GET /api/quizzes/lesson/:lessonId
// @desc    Get quiz for a lesson
// @access  Private
router.get('/lesson/:lessonId', auth, async (req, res) => {
  try {
    const lesson = await Lesson.findById(req.params.lessonId);
    
    if (!lesson) {
      return res.status(404).json({ error: 'Lesson not found' });
    }

    const quiz = await Quiz.findOne({ lessonId: lesson._id });
    
    if (!quiz) {
      return res.status(404).json({ error: 'Quiz not found for this lesson' });
    }

    // Remove correct answers from response
    const quizData = {
      _id: quiz._id,
      lessonId: quiz.lessonId,
      passingScore: quiz.passingScore,
      xpReward: quiz.xpReward,
      questions: quiz.questions.map(q => ({
        question: q.question,
        options: q.options
      }))
    };

    res.json(quizData);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

// @route   POST /api/quizzes/:id/submit
// @desc    Submit quiz answers
// @access  Private
router.post('/:id/submit', auth, async (req, res) => {
  try {
    const { answers } = req.body; // Array of selected answer indices
    
    if (!answers || !Array.isArray(answers)) {
      return res.status(400).json({ error: 'Invalid answers format' });
    }

    const quiz = await Quiz.findById(req.params.id).populate('lessonId');
    
    if (!quiz) {
      return res.status(404).json({ error: 'Quiz not found' });
    }

    // Check enrollment
    const lesson = await Lesson.findById(quiz.lessonId).populate('courseId');
    const progress = await UserProgress.findOne({
      userId: req.user._id,
      courseId: lesson.courseId._id
    });

    if (!progress) {
      return res.status(403).json({ error: 'Not enrolled in this course' });
    }

    // Grade the quiz
    let correctCount = 0;
    const gradedAnswers = [];

    quiz.questions.forEach((question, index) => {
      const userAnswer = answers[index];
      const isCorrect = userAnswer === question.correctAnswer;
      
      if (isCorrect) {
        correctCount++;
      }

      gradedAnswers.push({
        questionIndex: index,
        selectedAnswer: userAnswer,
        isCorrect,
        correctAnswer: question.correctAnswer,
        explanation: question.explanation
      });
    });

    const score = Math.round((correctCount / quiz.questions.length) * 100);
    const passed = score >= quiz.passingScore;

    // Save quiz result
    progress.quizResults.push({
      quizId: quiz._id,
      score,
      answers: gradedAnswers.map(a => ({
        questionIndex: a.questionIndex,
        selectedAnswer: a.selectedAnswer,
        isCorrect: a.isCorrect
      })),
      passed,
      attemptedAt: new Date()
    });

    await progress.save();

    // Award XP if passed (only on first pass)
    let xpEarned = 0;
    let newLevel = req.user.level;
    
    if (passed) {
      // Check if this is the first time passing this quiz
      const previousPasses = progress.quizResults.filter(
        qr => qr.quizId.toString() === quiz._id.toString() && 
              qr.passed && 
              qr.attemptedAt < progress.quizResults[progress.quizResults.length - 1].attemptedAt
      );

      if (previousPasses.length === 0) {
        const user = await User.findById(req.user._id);
        user.addXP(quiz.xpReward);
        await user.save();
        xpEarned = quiz.xpReward;
        newLevel = user.level;
      }
    }

    res.json({
      score,
      passed,
      correctCount,
      totalQuestions: quiz.questions.length,
      xpEarned,
      newLevel,
      answers: gradedAnswers
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
