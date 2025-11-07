const mongoose = require('mongoose');

const badgeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true
  },
  description: {
    type: String,
    required: true
  },
  icon: {
    type: String,
    default: '🏆'
  },
  criteria: {
    type: String,
    required: true // e.g., "complete_first_lesson", "reach_level_5", "earn_100_xp"
  },
  xpThreshold: {
    type: Number,
    default: 0
  },
  levelThreshold: {
    type: Number,
    default: 0
  },
  courseCompletionCount: {
    type: Number,
    default: 0
  },
  rarity: {
    type: String,
    enum: ['common', 'rare', 'epic', 'legendary'],
    default: 'common'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Badge', badgeSchema);
