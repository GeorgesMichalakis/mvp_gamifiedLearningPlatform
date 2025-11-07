require('dotenv').config();
const mongoose = require('mongoose');
const Course = require('../models/Course');
const Lesson = require('../models/Lesson');
const Quiz = require('../models/Quiz');
const Badge = require('../models/Badge');

const seedData = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/gamified-learning');
    console.log('Connected to MongoDB');

    // Clear existing data
    await Course.deleteMany({});
    await Lesson.deleteMany({});
    await Quiz.deleteMany({});
    await Badge.deleteMany({});
    console.log('Cleared existing data');

    // Create Badges
    const badges = await Badge.create([
      {
        name: 'First Steps',
        description: 'Complete your first lesson',
        icon: '🌟',
        criteria: 'complete_first_lesson',
        rarity: 'common'
      },
      {
        name: 'Rising Star',
        description: 'Reach Level 5',
        icon: '⭐',
        criteria: 'reach_level_5',
        levelThreshold: 5,
        rarity: 'rare'
      },
      {
        name: 'Champion',
        description: 'Reach Level 10',
        icon: '🏆',
        criteria: 'reach_level_10',
        levelThreshold: 10,
        rarity: 'epic'
      },
      {
        name: 'Quick Learner',
        description: 'Earn 100 XP',
        icon: '🚀',
        criteria: 'earn_100_xp',
        xpThreshold: 100,
        rarity: 'common'
      },
      {
        name: 'Knowledge Seeker',
        description: 'Earn 500 XP',
        icon: '📚',
        criteria: 'earn_500_xp',
        xpThreshold: 500,
        rarity: 'rare'
      },
      {
        name: 'Master Scholar',
        description: 'Earn 1000 XP',
        icon: '🎓',
        criteria: 'earn_1000_xp',
        xpThreshold: 1000,
        rarity: 'epic'
      },
      {
        name: 'Course Completer',
        description: 'Complete your first course',
        icon: '✅',
        criteria: 'complete_first_course',
        rarity: 'rare'
      }
    ]);
    console.log('Created badges');

    // Create Course 1: Introduction to JavaScript
    const jsLessons = [];
    
    const jsLesson1 = await Lesson.create({
      title: 'What is JavaScript?',
      content: `JavaScript is a versatile programming language that powers the interactive web.\n\nOriginally created to make web pages interactive, JavaScript has evolved into a powerful language used for:\n- Front-end web development\n- Back-end server development (Node.js)\n- Mobile app development\n- Desktop applications\n- Game development\n\nJavaScript runs in web browsers and allows you to create dynamic, responsive user experiences. It's one of the three core technologies of the web, alongside HTML and CSS.`,
      courseId: null, // Will update later
      order: 1,
      duration: 5,
      xpReward: 10
    });
    jsLessons.push(jsLesson1._id);

    const jsQuiz1 = await Quiz.create({
      lessonId: jsLesson1._id,
      questions: [
        {
          question: 'What is JavaScript primarily used for?',
          options: [
            'Styling web pages',
            'Making web pages interactive',
            'Structuring web content',
            'Database management'
          ],
          correctAnswer: 1,
          explanation: 'JavaScript is primarily used to add interactivity and dynamic behavior to web pages.'
        },
        {
          question: 'Which of these is NOT a use case for JavaScript?',
          options: [
            'Front-end development',
            'Server-side development',
            'Image editing',
            'Mobile apps'
          ],
          correctAnswer: 2,
          explanation: 'While JavaScript is very versatile, it\'s not typically used for direct image editing - that\'s more for tools like Photoshop.'
        },
        {
          question: 'JavaScript runs in:',
          options: [
            'Only web browsers',
            'Only servers',
            'Both browsers and servers',
            'Only mobile devices'
          ],
          correctAnswer: 2,
          explanation: 'JavaScript can run in web browsers (client-side) and on servers using Node.js (server-side).'
        }
      ],
      passingScore: 60,
      xpReward: 20
    });

    jsLesson1.quiz = jsQuiz1._id;
    await jsLesson1.save();

    const jsLesson2 = await Lesson.create({
      title: 'Variables and Data Types',
      content: `In JavaScript, variables are containers for storing data values.\n\nYou can declare variables using:\n- let: for variables that can change\n- const: for variables that won't change\n- var: the old way (avoid in modern code)\n\nJavaScript has several data types:\n- String: text data ("hello")\n- Number: numeric data (42, 3.14)\n- Boolean: true or false\n- Array: lists of values ([1, 2, 3])\n- Object: collections of key-value pairs ({name: "John"})\n- Undefined: variable declared but not assigned\n- Null: intentionally empty value\n\nExample:\nlet name = "Alice";\nconst age = 25;\nlet isStudent = true;`,
      courseId: null,
      order: 2,
      duration: 7,
      xpReward: 15
    });
    jsLessons.push(jsLesson2._id);

    const jsQuiz2 = await Quiz.create({
      lessonId: jsLesson2._id,
      questions: [
        {
          question: 'Which keyword should you use for a value that won\'t change?',
          options: ['var', 'let', 'const', 'static'],
          correctAnswer: 2,
          explanation: 'Use const for values that won\'t be reassigned.'
        },
        {
          question: 'What data type is "Hello World"?',
          options: ['Number', 'String', 'Boolean', 'Object'],
          correctAnswer: 1,
          explanation: 'Text enclosed in quotes is a String data type.'
        },
        {
          question: 'What is the result of: typeof 42',
          options: ['"string"', '"number"', '"integer"', '"float"'],
          correctAnswer: 1,
          explanation: 'In JavaScript, all numbers are of type "number", whether integer or decimal.'
        }
      ],
      passingScore: 60,
      xpReward: 25
    });

    jsLesson2.quiz = jsQuiz2._id;
    await jsLesson2.save();

    const jsLesson3 = await Lesson.create({
      title: 'Functions in JavaScript',
      content: `Functions are reusable blocks of code that perform specific tasks.\n\nThere are several ways to create functions:\n\n1. Function Declaration:\nfunction greet(name) {\n  return "Hello " + name;\n}\n\n2. Arrow Function (modern):\nconst greet = (name) => {\n  return "Hello " + name;\n};\n\n3. Function Expression:\nconst greet = function(name) {\n  return "Hello " + name;\n};\n\nFunctions can:\n- Take parameters (inputs)\n- Return values (outputs)\n- Be called multiple times\n- Make your code more organized and reusable\n\nExample:\nfunction add(a, b) {\n  return a + b;\n}\nconsole.log(add(5, 3)); // Output: 8`,
      courseId: null,
      order: 3,
      duration: 8,
      xpReward: 20
    });
    jsLessons.push(jsLesson3._id);

    const jsQuiz3 = await Quiz.create({
      lessonId: jsLesson3._id,
      questions: [
        {
          question: 'What keyword is used to send a value back from a function?',
          options: ['send', 'return', 'output', 'give'],
          correctAnswer: 1,
          explanation: 'The return keyword is used to return a value from a function.'
        },
        {
          question: 'Which is a valid arrow function?',
          options: [
            'function => (x) { return x * 2; }',
            'const double = (x) => { return x * 2; }',
            'const double => (x) { return x * 2; }',
            'arrow function double(x) { return x * 2; }'
          ],
          correctAnswer: 1,
          explanation: 'Arrow functions use the syntax: const name = (params) => { body }'
        }
      ],
      passingScore: 60,
      xpReward: 25
    });

    jsLesson3.quiz = jsQuiz3._id;
    await jsLesson3.save();

    const jsCourse = await Course.create({
      title: 'Introduction to JavaScript',
      description: 'Learn the fundamentals of JavaScript, the language of the web. Perfect for beginners!',
      thumbnail: '💻',
      difficulty: 'beginner',
      estimatedTime: 20,
      lessons: jsLessons,
      totalXP: 45 + 70, // lesson XP + quiz XP
      isPublished: true
    });

    // Update lessons with course ID
    await Lesson.updateMany(
      { _id: { $in: jsLessons } },
      { courseId: jsCourse._id }
    );

    console.log('Created JavaScript course');

    // Create Course 2: Python Basics
    const pyLessons = [];

    const pyLesson1 = await Lesson.create({
      title: 'Getting Started with Python',
      content: `Python is a powerful, easy-to-learn programming language.\n\nWhy Python?\n- Clean, readable syntax\n- Versatile: web dev, data science, AI, automation\n- Huge community and libraries\n- Great for beginners and experts alike\n\nPython emphasizes code readability with its use of indentation. Instead of curly braces, Python uses whitespace to define code blocks.\n\nPython is used by companies like Google, Netflix, NASA, and Instagram for everything from web applications to scientific computing.`,
      courseId: null,
      order: 1,
      duration: 5,
      xpReward: 10
    });
    pyLessons.push(pyLesson1._id);

    const pyQuiz1 = await Quiz.create({
      lessonId: pyLesson1._id,
      questions: [
        {
          question: 'What does Python use to define code blocks?',
          options: ['Curly braces {}', 'Indentation', 'Parentheses ()', 'Square brackets []'],
          correctAnswer: 1,
          explanation: 'Python uses indentation (whitespace) to define code blocks, making code very readable.'
        },
        {
          question: 'Which company does NOT use Python?',
          options: ['Google', 'Netflix', 'NASA', 'None - they all use Python'],
          correctAnswer: 3,
          explanation: 'All these major companies use Python for various applications.'
        }
      ],
      passingScore: 60,
      xpReward: 20
    });

    pyLesson1.quiz = pyQuiz1._id;
    await pyLesson1.save();

    const pyLesson2 = await Lesson.create({
      title: 'Python Variables and Types',
      content: `Python variables are created when you assign a value to them.\n\nNo need to declare the type - Python figures it out:\nname = "Bob"        # String\nage = 30            # Integer\nheight = 5.9        # Float\nis_student = True   # Boolean\n\nPython has several built-in data types:\n- int: whole numbers (42)\n- float: decimal numbers (3.14)\n- str: text ("hello")\n- bool: True or False\n- list: ordered collection [1, 2, 3]\n- dict: key-value pairs {"name": "Bob"}\n- tuple: immutable list (1, 2, 3)\n- set: unique values {1, 2, 3}\n\nYou can check a variable's type using type():\nprint(type(age))  # <class 'int'>`,
      courseId: null,
      order: 2,
      duration: 6,
      xpReward: 15
    });
    pyLessons.push(pyLesson2._id);

    const pyQuiz2 = await Quiz.create({
      lessonId: pyLesson2._id,
      questions: [
        {
          question: 'What type is the value 3.14?',
          options: ['int', 'float', 'decimal', 'number'],
          correctAnswer: 1,
          explanation: 'Decimal numbers in Python are of type float.'
        },
        {
          question: 'Which data structure uses curly braces for key-value pairs?',
          options: ['list', 'tuple', 'dict', 'set'],
          correctAnswer: 2,
          explanation: 'Dictionaries (dict) use curly braces with key-value pairs: {"key": "value"}'
        },
        {
          question: 'Do you need to declare variable types in Python?',
          options: ['Yes, always', 'No, Python infers types', 'Only for numbers', 'Only for strings'],
          correctAnswer: 1,
          explanation: 'Python automatically determines the variable type based on the value assigned.'
        }
      ],
      passingScore: 60,
      xpReward: 25
    });

    pyLesson2.quiz = pyQuiz2._id;
    await pyLesson2.save();

    const pyCourse = await Course.create({
      title: 'Python Basics',
      description: 'Master the basics of Python programming. Great for data science and general programming!',
      thumbnail: '🐍',
      difficulty: 'beginner',
      estimatedTime: 11,
      lessons: pyLessons,
      totalXP: 25 + 45,
      isPublished: true
    });

    await Lesson.updateMany(
      { _id: { $in: pyLessons } },
      { courseId: pyCourse._id }
    );

    console.log('Created Python course');

    // Create Course 3: Web Development Fundamentals
    const webLessons = [];

    const webLesson1 = await Lesson.create({
      title: 'The Web Development Trio',
      content: `Modern web development relies on three core technologies:\n\n1. HTML (Structure)\n- Defines the content and structure\n- Uses tags like <div>, <p>, <h1>\n- The skeleton of a webpage\n\n2. CSS (Style)\n- Controls appearance and layout\n- Colors, fonts, spacing, animations\n- Makes websites beautiful\n\n3. JavaScript (Behavior)\n- Adds interactivity\n- Responds to user actions\n- Makes websites dynamic\n\nThink of it like building a house:\n- HTML is the frame and walls\n- CSS is the paint and decoration\n- JavaScript is the electricity and plumbing\n\nTogether, these three technologies create the modern web experience!`,
      courseId: null,
      order: 1,
      duration: 6,
      xpReward: 12
    });
    webLessons.push(webLesson1._id);

    const webQuiz1 = await Quiz.create({
      lessonId: webLesson1._id,
      questions: [
        {
          question: 'Which technology controls the appearance of a webpage?',
          options: ['HTML', 'CSS', 'JavaScript', 'Python'],
          correctAnswer: 1,
          explanation: 'CSS (Cascading Style Sheets) controls the visual appearance and layout of web pages.'
        },
        {
          question: 'What does HTML define?',
          options: ['Style', 'Behavior', 'Structure', 'Database'],
          correctAnswer: 2,
          explanation: 'HTML defines the structure and content of web pages.'
        },
        {
          question: 'Which adds interactivity to websites?',
          options: ['HTML', 'CSS', 'JavaScript', 'All of them'],
          correctAnswer: 2,
          explanation: 'JavaScript adds interactive behavior and dynamic functionality to websites.'
        }
      ],
      passingScore: 60,
      xpReward: 20
    });

    webLesson1.quiz = webQuiz1._id;
    await webLesson1.save();

    const webCourse = await Course.create({
      title: 'Web Development Fundamentals',
      description: 'Understand the core technologies that power the modern web.',
      thumbnail: '🌐',
      difficulty: 'beginner',
      estimatedTime: 6,
      lessons: webLessons,
      totalXP: 12 + 20,
      isPublished: true
    });

    await Lesson.updateMany(
      { _id: { $in: webLessons } },
      { courseId: webCourse._id }
    );

    console.log('Created Web Development course');

    console.log('\n✅ Seed data created successfully!');
    console.log(`Created ${badges.length} badges`);
    console.log('Created 3 courses with lessons and quizzes');
    
    process.exit(0);
  } catch (error) {
    console.error('Error seeding data:', error);
    process.exit(1);
  }
};

seedData();
