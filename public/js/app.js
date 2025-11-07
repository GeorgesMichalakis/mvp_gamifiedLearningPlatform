// API Base URL
const API_URL = 'http://localhost:5000/api';

// State Management
const state = {
  user: null,
  token: null,
  currentCourse: null,
  currentLesson: null,
  currentQuiz: null
};

// Utility Functions
function showLoading() {
  document.getElementById('loading').style.display = 'flex';
}

function hideLoading() {
  document.getElementById('loading').style.display = 'none';
}

function showNotification(message, type = 'success') {
  const notification = document.getElementById('notification');
  notification.textContent = message;
  notification.className = `notification ${type} show`;
  
  setTimeout(() => {
    notification.classList.remove('show');
  }, 3000);
}

function showPage(pageId) {
  document.querySelectorAll('.page').forEach(page => page.classList.remove('active'));
  document.getElementById(`${pageId}-page`).classList.add('active');
}

function saveToken(token) {
  localStorage.setItem('token', token);
  state.token = token;
}

function getToken() {
  if (!state.token) {
    state.token = localStorage.getItem('token');
  }
  return state.token;
}

function clearAuth() {
  localStorage.removeItem('token');
  state.token = null;
  state.user = null;
}

async function apiCall(endpoint, options = {}) {
  const token = getToken();
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers
  };
  
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  
  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers
  });
  
  const data = await response.json();
  
  if (!response.ok) {
    throw new Error(data.error || 'Something went wrong');
  }
  
  return data;
}

// Auth Functions
async function handleSignUp(e) {
  e.preventDefault();
  
  const email = document.getElementById('signup-email').value;
  const password = document.getElementById('signup-password').value;
  const errorEl = document.getElementById('signup-error');
  
  try {
    showLoading();
    errorEl.textContent = '';
    
    const data = await apiCall('/auth/signup', {
      method: 'POST',
      body: JSON.stringify({ email, password })
    });
    
    saveToken(data.token);
    state.user = data.user;
    
    showNotification('Account created successfully!');
    initApp();
  } catch (error) {
    errorEl.textContent = error.message;
  } finally {
    hideLoading();
  }
}

async function handleSignIn(e) {
  e.preventDefault();
  
  const email = document.getElementById('signin-email').value;
  const password = document.getElementById('signin-password').value;
  const errorEl = document.getElementById('signin-error');
  
  try {
    showLoading();
    errorEl.textContent = '';
    
    const data = await apiCall('/auth/signin', {
      method: 'POST',
      body: JSON.stringify({ email, password })
    });
    
    saveToken(data.token);
    state.user = data.user;
    
    showNotification('Welcome back!');
    initApp();
  } catch (error) {
    errorEl.textContent = error.message;
  } finally {
    hideLoading();
  }
}

function handleLogout() {
  clearAuth();
  document.getElementById('navbar').style.display = 'none';
  showPage('auth');
  showNotification('Logged out successfully');
}

// Course Functions
async function loadCourses() {
  try {
    showLoading();
    const courses = await apiCall('/courses');
    
    const grid = document.getElementById('courses-grid');
    grid.innerHTML = courses.map(course => `
      <div class="course-card" onclick="viewCourse('${course._id}')">
        <div class="course-thumbnail">${course.thumbnail || '📚'}</div>
        <div class="course-body">
          <h3 class="course-title">${course.title}</h3>
          <p class="course-description">${course.description}</p>
          <div class="course-meta">
            <span class="badge badge-${course.difficulty}">${course.difficulty}</span>
            <span>⏱️ ${course.estimatedTime} min</span>
            <span>🎯 ${course.totalXP} XP</span>
          </div>
        </div>
      </div>
    `).join('');
    
    showPage('courses');
  } catch (error) {
    showNotification(error.message, 'error');
  } finally {
    hideLoading();
  }
}

async function viewCourse(courseId) {
  try {
    showLoading();
    const course = await apiCall(`/courses/${courseId}`);
    state.currentCourse = course;
    
    // Check if enrolled
    let isEnrolled = false;
    let progress = null;
    
    try {
      progress = await apiCall(`/courses/${courseId}/progress`);
      isEnrolled = true;
    } catch (e) {
      // Not enrolled
    }
    
    const detailEl = document.getElementById('course-detail');
    detailEl.innerHTML = `
      <div class="lesson-container">
        <div class="lesson-header">
          <h1>${course.title}</h1>
          <p style="color: var(--text-light); margin-top: 0.5rem;">${course.description}</p>
          <div style="margin-top: 1rem;">
            <span class="badge badge-${course.difficulty}">${course.difficulty}</span>
            <span style="margin-left: 1rem;">⏱️ ${course.estimatedTime} min</span>
            <span style="margin-left: 1rem;">🎯 ${course.totalXP} XP</span>
          </div>
        </div>
        
        ${!isEnrolled ? `
          <button class="btn btn-primary" onclick="enrollCourse('${course._id}')">
            📝 Enroll in Course
          </button>
        ` : `
          <div style="margin-bottom: 2rem;">
            <h3>Your Progress</h3>
            <p>${progress.completedLessons.length} / ${course.lessons.length} lessons completed</p>
          </div>
        `}
        
        <h2 style="margin-top: 2rem; margin-bottom: 1rem;">Lessons</h2>
        <div style="display: flex; flex-direction: column; gap: 1rem;">
          ${course.lessons.map((lesson, index) => {
            const isCompleted = isEnrolled && progress.completedLessons.some(
              cl => cl.lessonId === lesson._id
            );
            return `
              <div style="background: var(--light-bg); padding: 1.5rem; border-radius: 8px; ${isEnrolled ? 'cursor: pointer;' : 'opacity: 0.6;'}" 
                   ${isEnrolled ? `onclick="viewLesson('${lesson._id}')"` : ''}>
                <div style="display: flex; justify-content: space-between; align-items: center;">
                  <div>
                    <h3>${index + 1}. ${lesson.title}</h3>
                    <p style="color: var(--text-light); font-size: 0.9rem; margin-top: 0.25rem;">
                      ⏱️ ${lesson.duration} min · 🎯 ${lesson.xpReward} XP
                    </p>
                  </div>
                  ${isCompleted ? '<span style="font-size: 1.5rem;">✅</span>' : ''}
                </div>
              </div>
            `;
          }).join('')}
        </div>
      </div>
    `;
    
    showPage('course-detail');
  } catch (error) {
    showNotification(error.message, 'error');
  } finally {
    hideLoading();
  }
}

async function enrollCourse(courseId) {
  try {
    showLoading();
    await apiCall(`/courses/${courseId}/enroll`, { method: 'POST' });
    showNotification('Successfully enrolled!');
    viewCourse(courseId);
  } catch (error) {
    showNotification(error.message, 'error');
  } finally {
    hideLoading();
  }
}

async function viewLesson(lessonId) {
  try {
    showLoading();
    const lesson = await apiCall(`/lessons/${lessonId}`);
    state.currentLesson = lesson;
    
    const contentEl = document.getElementById('lesson-content');
    contentEl.innerHTML = `
      <div class="lesson-container">
        <div class="lesson-header">
          <h1>${lesson.title}</h1>
          <p style="color: var(--text-light);">⏱️ ${lesson.duration} min · 🎯 ${lesson.xpReward} XP</p>
        </div>
        
        <div class="lesson-content-body">
          ${lesson.content.split('\n').map(p => `<p style="margin-bottom: 1rem;">${p}</p>`).join('')}
        </div>
        
        <div class="lesson-actions">
          <button class="btn btn-success" onclick="completeLesson('${lesson._id}')">
            ✅ Complete Lesson
          </button>
          ${lesson.quiz ? `
            <button class="btn btn-primary" onclick="startQuiz('${lesson._id}')">
              🎯 Take Quiz
            </button>
          ` : ''}
          <button class="btn btn-secondary" onclick="viewCourse('${lesson.courseId._id}')">
            ← Back to Course
          </button>
        </div>
      </div>
    `;
    
    showPage('lesson');
  } catch (error) {
    showNotification(error.message, 'error');
  } finally {
    hideLoading();
  }
}

async function completeLesson(lessonId) {
  try {
    showLoading();
    const result = await apiCall(`/lessons/${lessonId}/complete`, { method: 'POST' });
    
    let message = `Lesson completed! +${result.xpEarned} XP`;
    
    if (result.newBadges && result.newBadges.length > 0) {
      message += ` | New badges earned: ${result.newBadges.map(b => b.icon).join(' ')}`;
    }
    
    if (result.courseCompleted) {
      message += ' | 🎉 Course completed!';
    }
    
    showNotification(message);
    updateNavStats();
    
    // Refresh lesson to show updated state
    viewCourse(state.currentLesson.courseId._id);
  } catch (error) {
    showNotification(error.message, 'error');
  } finally {
    hideLoading();
  }
}

async function startQuiz(lessonId) {
  try {
    showLoading();
    const quiz = await apiCall(`/quizzes/lesson/${lessonId}`);
    state.currentQuiz = quiz;
    state.quizAnswers = new Array(quiz.questions.length).fill(null);
    
    const contentEl = document.getElementById('quiz-content');
    contentEl.innerHTML = `
      <div class="quiz-container">
        <h1>Quiz Time! 🎯</h1>
        <p style="color: var(--text-light); margin-bottom: 2rem;">
          Passing score: ${quiz.passingScore}% · Reward: ${quiz.xpReward} XP
        </p>
        
        <div id="quiz-questions">
          ${quiz.questions.map((q, qIndex) => `
            <div class="question">
              <h3>Question ${qIndex + 1}</h3>
              <p style="margin-bottom: 1rem; font-size: 1.1rem;">${q.question}</p>
              <div class="options">
                ${q.options.map((option, oIndex) => `
                  <div class="option" onclick="selectAnswer(${qIndex}, ${oIndex})">
                    ${option}
                  </div>
                `).join('')}
              </div>
            </div>
          `).join('')}
        </div>
        
        <div style="margin-top: 2rem; display: flex; gap: 1rem;">
          <button class="btn btn-primary" onclick="submitQuiz()">
            Submit Quiz
          </button>
          <button class="btn btn-secondary" onclick="viewLesson('${lessonId}')">
            Cancel
          </button>
        </div>
      </div>
    `;
    
    showPage('quiz');
  } catch (error) {
    showNotification(error.message, 'error');
  } finally {
    hideLoading();
  }
}

function selectAnswer(questionIndex, optionIndex) {
  state.quizAnswers[questionIndex] = optionIndex;
  
  // Update UI
  const questionEl = document.querySelectorAll('.question')[questionIndex];
  const options = questionEl.querySelectorAll('.option');
  
  options.forEach((opt, idx) => {
    opt.classList.toggle('selected', idx === optionIndex);
  });
}

async function submitQuiz() {
  // Check if all questions are answered
  if (state.quizAnswers.some(a => a === null)) {
    showNotification('Please answer all questions', 'error');
    return;
  }
  
  try {
    showLoading();
    const result = await apiCall(`/quizzes/${state.currentQuiz._id}/submit`, {
      method: 'POST',
      body: JSON.stringify({ answers: state.quizAnswers })
    });
    
    // Show results
    const contentEl = document.getElementById('quiz-content');
    contentEl.innerHTML = `
      <div class="quiz-container">
        <h1>${result.passed ? '🎉 Congratulations!' : '😔 Try Again'}</h1>
        <div style="text-align: center; margin: 2rem 0;">
          <div style="font-size: 3rem; font-weight: bold; color: ${result.passed ? 'var(--success-color)' : 'var(--danger-color)'};">
            ${result.score}%
          </div>
          <p style="color: var(--text-light); margin-top: 0.5rem;">
            ${result.correctCount} / ${result.totalQuestions} correct
          </p>
          ${result.passed ? `
            <p style="color: var(--success-color); font-weight: 600; margin-top: 1rem;">
              +${result.xpEarned} XP earned!
            </p>
          ` : `
            <p style="color: var(--text-light); margin-top: 1rem;">
              You need ${state.currentQuiz.passingScore}% to pass
            </p>
          `}
        </div>
        
        <h2>Review Answers</h2>
        ${result.answers.map((answer, index) => `
          <div style="background: var(--light-bg); padding: 1.5rem; border-radius: 8px; margin-bottom: 1rem;">
            <h3>Question ${index + 1}</h3>
            <p style="margin: 0.5rem 0;">${state.currentQuiz.questions[index].question}</p>
            <div style="margin-top: 1rem;">
              ${state.currentQuiz.questions[index].options.map((opt, oIndex) => {
                let className = '';
                if (oIndex === answer.correctAnswer) className = 'correct';
                else if (oIndex === answer.selectedAnswer && !answer.isCorrect) className = 'incorrect';
                
                return `
                  <div class="option ${className}" style="margin-bottom: 0.5rem;">
                    ${opt}
                    ${oIndex === answer.correctAnswer ? ' ✓' : ''}
                    ${oIndex === answer.selectedAnswer && !answer.isCorrect ? ' ✗' : ''}
                  </div>
                `;
              }).join('')}
            </div>
            ${answer.explanation ? `
              <p style="margin-top: 1rem; color: var(--text-light); font-style: italic;">
                💡 ${answer.explanation}
              </p>
            ` : ''}
          </div>
        `).join('')}
        
        <div style="margin-top: 2rem; display: flex; gap: 1rem;">
          ${!result.passed ? `
            <button class="btn btn-primary" onclick="startQuiz('${state.currentLesson._id}')">
              Try Again
            </button>
          ` : ''}
          <button class="btn btn-secondary" onclick="viewCourse('${state.currentLesson.courseId._id}')">
            Back to Course
          </button>
        </div>
      </div>
    `;
    
    updateNavStats();
  } catch (error) {
    showNotification(error.message, 'error');
  } finally {
    hideLoading();
  }
}

// Profile Functions
async function loadProfile() {
  try {
    showLoading();
    const profile = await apiCall('/users/profile');
    
    const contentEl = document.getElementById('profile-content');
    contentEl.innerHTML = `
      <div class="profile-grid">
        <div>
          <div class="profile-card">
            <div class="profile-header">
              <div class="level-badge">⭐</div>
              <h2>Level ${profile.user.level}</h2>
              <p style="color: var(--text-light);">${profile.user.email}</p>
            </div>
            
            <div>
              <p style="font-weight: 600; margin-bottom: 0.5rem;">
                ${profile.user.xp} / ${profile.levelProgress.xpRequired + profile.levelProgress.xpProgress} XP
              </p>
              <div class="xp-bar">
                <div class="xp-progress" style="width: ${profile.levelProgress.progressPercentage}%">
                  ${profile.levelProgress.progressPercentage}%
                </div>
              </div>
              <p style="text-align: center; color: var(--text-light); font-size: 0.875rem; margin-top: 0.5rem;">
                ${profile.levelProgress.xpRequired - profile.levelProgress.xpProgress} XP to Level ${profile.levelProgress.nextLevel}
              </p>
            </div>
          </div>
          
          <div class="profile-card" style="margin-top: 1rem;">
            <h3 style="margin-bottom: 1rem;">🏆 Badges (${profile.user.badges.length})</h3>
            ${profile.user.badges.length > 0 ? `
              <div class="badges-grid">
                ${profile.user.badges.map(badge => `
                  <div class="badge-item" title="${badge.description}">
                    <div class="badge-icon">${badge.icon}</div>
                    <div style="font-size: 0.75rem;">${badge.name}</div>
                  </div>
                `).join('')}
              </div>
            ` : '<p style="color: var(--text-light);">No badges yet. Complete lessons to earn badges!</p>'}
          </div>
        </div>
        
        <div>
          <div class="profile-card">
            <h2 style="margin-bottom: 1.5rem;">📊 Statistics</h2>
            <div class="stats-grid">
              <div class="stat-item">
                <div class="stat-value">${profile.stats.totalCoursesEnrolled}</div>
                <div class="stat-label">Courses Enrolled</div>
              </div>
              <div class="stat-item">
                <div class="stat-value">${profile.stats.totalCoursesCompleted}</div>
                <div class="stat-label">Courses Completed</div>
              </div>
              <div class="stat-item">
                <div class="stat-value">${profile.stats.totalLessonsCompleted}</div>
                <div class="stat-label">Lessons Completed</div>
              </div>
              <div class="stat-item">
                <div class="stat-value">${profile.stats.quizPassRate}%</div>
                <div class="stat-label">Quiz Pass Rate</div>
              </div>
            </div>
            
            <h3 style="margin-top: 2rem; margin-bottom: 1rem;">Recent Activity</h3>
            ${profile.recentActivity.length > 0 ? `
              <div style="display: flex; flex-direction: column; gap: 1rem;">
                ${profile.recentActivity.map(activity => `
                  <div style="background: var(--light-bg); padding: 1rem; border-radius: 8px; cursor: pointer;"
                       onclick="viewCourse('${activity.courseId}')">
                    <h4>${activity.courseTitle}</h4>
                    <p style="color: var(--text-light); font-size: 0.875rem; margin-top: 0.25rem;">
                      ${activity.lessonsCompleted} / ${activity.totalLessons} lessons
                      ${activity.completed ? ' · ✅ Completed' : ''}
                    </p>
                    <p style="color: var(--text-light); font-size: 0.75rem; margin-top: 0.25rem;">
                      Last accessed: ${new Date(activity.lastAccessed).toLocaleDateString()}
                    </p>
                  </div>
                `).join('')}
              </div>
            ` : '<p style="color: var(--text-light);">No activity yet. Start learning!</p>'}
          </div>
        </div>
      </div>
    `;
    
    showPage('profile');
  } catch (error) {
    showNotification(error.message, 'error');
  } finally {
    hideLoading();
  }
}

async function updateNavStats() {
  try {
    const user = await apiCall('/auth/me');
    state.user = user;
    
    const statsEl = document.getElementById('nav-stats');
    statsEl.innerHTML = `
      <span class="stat-badge">⭐ Level ${user.level}</span>
      <span class="stat-badge">🎯 ${user.xp} XP</span>
      <span class="stat-badge">🏆 ${user.badges.length}</span>
    `;
  } catch (error) {
    console.error('Failed to update stats:', error);
  }
}

// Initialize App
async function initApp() {
  const token = getToken();
  
  if (!token) {
    document.getElementById('navbar').style.display = 'none';
    showPage('auth');
    return;
  }
  
  try {
    showLoading();
    const user = await apiCall('/auth/me');
    state.user = user;
    
    document.getElementById('navbar').style.display = 'block';
    await updateNavStats();
    await loadCourses();
  } catch (error) {
    clearAuth();
    document.getElementById('navbar').style.display = 'none';
    showPage('auth');
  } finally {
    hideLoading();
  }
}

// Event Listeners
document.addEventListener('DOMContentLoaded', () => {
  // Auth tabs
  document.querySelectorAll('.auth-tab').forEach(tab => {
    tab.addEventListener('click', () => {
      const tabName = tab.dataset.tab;
      
      document.querySelectorAll('.auth-tab').forEach(t => t.classList.remove('active'));
      document.querySelectorAll('.auth-form').forEach(f => f.classList.remove('active'));
      
      tab.classList.add('active');
      document.getElementById(`${tabName}-form`).classList.add('active');
    });
  });
  
  // Auth forms
  document.getElementById('signin-form').addEventListener('submit', handleSignIn);
  document.getElementById('signup-form').addEventListener('submit', handleSignUp);
  
  // Navigation
  document.querySelectorAll('[data-page]').forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const page = link.dataset.page;
      
      if (page === 'courses') {
        loadCourses();
      } else if (page === 'profile') {
        loadProfile();
      }
    });
  });
  
  document.getElementById('logout-btn').addEventListener('click', handleLogout);
  
  // Initialize
  initApp();
});

// Make functions global for onclick handlers
window.viewCourse = viewCourse;
window.enrollCourse = enrollCourse;
window.viewLesson = viewLesson;
window.completeLesson = completeLesson;
window.startQuiz = startQuiz;
window.selectAnswer = selectAnswer;
window.submitQuiz = submitQuiz;
