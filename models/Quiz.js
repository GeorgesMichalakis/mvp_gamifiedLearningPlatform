const mongoose = require('mongoose');

const quizSchema = new mongoose.Schema({
  lessonId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Lesson',
    required: true
  },
  questions: [{
    question: {
      type: String,
      required: true
    },
    options: [{
      type: String,
      required: true
    }],
    correctAnswer: {
      type: Number, // Index of correct option (0-3)
      required: true
    },
    explanation: {
      type: String,
      default: ''
    }
  }],
  passingScore: {
    type: Number,
    default: 60 // Percentage
  },
  xpReward: {
    type: Number,
    default: 20 // XP for passing the quiz
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Quiz', quizSchema);
