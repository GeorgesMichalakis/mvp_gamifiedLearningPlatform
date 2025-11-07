require('dotenv').config();
const mongoose = require('mongoose');
const Course = require('../models/Course');
const Lesson = require('../models/Lesson');
const Quiz = require('../models/Quiz');
const Badge = require('../models/Badge');
const UserProgress = require('../models/UserProgress');

const seedData = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/gamified-learning');
    console.log('Connected to MongoDB');

    // Clear existing data
    await Course.deleteMany({});
    await Lesson.deleteMany({});
    await Quiz.deleteMany({});
    await Badge.deleteMany({});
    await UserProgress.deleteMany({});
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
    // First create the course placeholder
    const jsCourse = await Course.create({
      title: 'Introduction to JavaScript',
      description: 'Learn the fundamentals of JavaScript, the language of the web. Perfect for beginners!',
      thumbnail: '💻',
      difficulty: 'beginner',
      estimatedTime: 20,
      lessons: [],
      totalXP: 115,
      isPublished: true
    });

    const jsLessons = [];
    
    const jsLesson1 = await Lesson.create({
      title: 'What is JavaScript?',
      content: `JavaScript is a versatile programming language that powers the interactive web.\n\nOriginally created to make web pages interactive, JavaScript has evolved into a powerful language used for:\n- Front-end web development\n- Back-end server development (Node.js)\n- Mobile app development\n- Desktop applications\n- Game development\n\nJavaScript runs in web browsers and allows you to create dynamic, responsive user experiences. It's one of the three core technologies of the web, alongside HTML and CSS.`,
      courseId: jsCourse._id,
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
      courseId: jsCourse._id,
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
      courseId: jsCourse._id,
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

    // Update course with lessons
    jsCourse.lessons = jsLessons;
    await jsCourse.save();

    console.log('Created JavaScript course');

    // Create Course 2: Python Basics
    const pyCourse = await Course.create({
      title: 'Python Basics',
      description: 'Master the basics of Python programming. Great for data science and general programming!',
      thumbnail: '�',
      difficulty: 'beginner',
      estimatedTime: 11,
      lessons: [],
      totalXP: 70,
      isPublished: true
    });

    const pyLessons = [];

    const pyLesson1 = await Lesson.create({
      title: 'Getting Started with Python',
      content: `Python is a powerful, easy-to-learn programming language.\n\nWhy Python?\n- Clean, readable syntax\n- Versatile: web dev, data science, AI, automation\n- Huge community and libraries\n- Great for beginners and experts alike\n\nPython emphasizes code readability with its use of indentation. Instead of curly braces, Python uses whitespace to define code blocks.\n\nPython is used by companies like Google, Netflix, NASA, and Instagram for everything from web applications to scientific computing.`,
      courseId: pyCourse._id,
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
      courseId: pyCourse._id,
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

    // Update course with lessons
    pyCourse.lessons = pyLessons;
    await pyCourse.save();

    console.log('Created Python course');

    // Create Course 3: Web Development Fundamentals
    const webCourse = await Course.create({
      title: 'Web Development Fundamentals',
      description: 'Understand the core technologies that power the modern web.',
      thumbnail: '🌐',
      difficulty: 'beginner',
      estimatedTime: 6,
      lessons: [],
      totalXP: 32,
      isPublished: true
    });

    const webLessons = [];

    const webLesson1 = await Lesson.create({
      title: 'The Web Development Trio',
      content: `Modern web development relies on three core technologies:\n\n1. HTML (Structure)\n- Defines the content and structure\n- Uses tags like <div>, <p>, <h1>\n- The skeleton of a webpage\n\n2. CSS (Style)\n- Controls appearance and layout\n- Colors, fonts, spacing, animations\n- Makes websites beautiful\n\n3. JavaScript (Behavior)\n- Adds interactivity\n- Responds to user actions\n- Makes websites dynamic\n\nThink of it like building a house:\n- HTML is the frame and walls\n- CSS is the paint and decoration\n- JavaScript is the electricity and plumbing\n\nTogether, these three technologies create the modern web experience!`,
      courseId: webCourse._id,
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

    // Update course with lessons
    webCourse.lessons = webLessons;
    await webCourse.save();

    console.log('Created Web Development course');

    // Create Course 4: React Fundamentals
    const reactCourse = await Course.create({
      title: 'React Fundamentals',
      description: 'Learn React, the most popular JavaScript library for building user interfaces.',
      thumbnail: '⚛️',
      difficulty: 'intermediate',
      estimatedTime: 25,
      lessons: [],
      totalXP: 150,
      isPublished: true
    });

    const reactLessons = [];

    const reactLesson1 = await Lesson.create({
      title: 'What is React?',
      content: `React is a JavaScript library for building user interfaces, created by Facebook.\n\nKey Features:\n- Component-Based: Build encapsulated components that manage their own state\n- Declarative: Design simple views for each state in your application\n- Learn Once, Write Anywhere: Use React for web, mobile (React Native), and more\n\nWhy React?\n- Virtual DOM for fast updates\n- Huge ecosystem and community\n- Used by Facebook, Instagram, Netflix, Airbnb\n- Makes complex UIs easier to build and maintain\n\nReact changed how we think about building web applications by breaking UIs into reusable components.`,
      courseId: reactCourse._id,
      order: 1,
      duration: 6,
      xpReward: 15
    });
    reactLessons.push(reactLesson1._id);

    const reactQuiz1 = await Quiz.create({
      lessonId: reactLesson1._id,
      questions: [
        {
          question: 'What is React?',
          options: ['A programming language', 'A JavaScript library', 'A database', 'A CSS framework'],
          correctAnswer: 1,
          explanation: 'React is a JavaScript library for building user interfaces.'
        },
        {
          question: 'What does React use for fast updates?',
          options: ['Real DOM', 'Virtual DOM', 'Shadow DOM', 'DOM API'],
          correctAnswer: 1,
          explanation: 'React uses a Virtual DOM to efficiently update the actual DOM.'
        },
        {
          question: 'Who created React?',
          options: ['Google', 'Facebook', 'Twitter', 'Amazon'],
          correctAnswer: 1,
          explanation: 'React was created and is maintained by Facebook (Meta).'
        }
      ],
      passingScore: 60,
      xpReward: 25
    });

    reactLesson1.quiz = reactQuiz1._id;
    await reactLesson1.save();

    const reactLesson2 = await Lesson.create({
      title: 'Components and Props',
      content: `Components are the building blocks of React applications.\n\nFunction Component:\nfunction Welcome(props) {\n  return <h1>Hello, {props.name}</h1>;\n}\n\nProps (Properties):\n- Pass data from parent to child components\n- Read-only (immutable)\n- Like function parameters\n\nExample:\n<Welcome name="Alice" />\n<Welcome name="Bob" />\n\nComponents let you split the UI into independent, reusable pieces. Each component can receive props and return React elements describing what should appear on the screen.\n\nThink of components as custom HTML elements you create!`,
      courseId: reactCourse._id,
      order: 2,
      duration: 8,
      xpReward: 20
    });
    reactLessons.push(reactLesson2._id);

    const reactQuiz2 = await Quiz.create({
      lessonId: reactLesson2._id,
      questions: [
        {
          question: 'What are props in React?',
          options: ['CSS properties', 'Data passed to components', 'Component methods', 'HTML attributes'],
          correctAnswer: 1,
          explanation: 'Props are data passed from parent to child components.'
        },
        {
          question: 'Can you modify props inside a component?',
          options: ['Yes, always', 'No, props are read-only', 'Only in class components', 'Only in function components'],
          correctAnswer: 1,
          explanation: 'Props are immutable and cannot be modified by the receiving component.'
        }
      ],
      passingScore: 60,
      xpReward: 25
    });

    reactLesson2.quiz = reactQuiz2._id;
    await reactLesson2.save();

    const reactLesson3 = await Lesson.create({
      title: 'State and Hooks',
      content: `State allows components to create and manage their own data.\n\nThe useState Hook:\nimport { useState } from 'react';\n\nfunction Counter() {\n  const [count, setCount] = useState(0);\n  \n  return (\n    <div>\n      <p>Count: {count}</p>\n      <button onClick={() => setCount(count + 1)}>\n        Increment\n      </button>\n    </div>\n  );\n}\n\nKey Concepts:\n- State is component-specific data\n- When state changes, component re-renders\n- useState returns [value, setter function]\n- State updates are asynchronous\n\nHooks let you use state and other React features without writing class components.`,
      courseId: reactCourse._id,
      order: 3,
      duration: 11,
      xpReward: 25
    });
    reactLessons.push(reactLesson3._id);

    const reactQuiz3 = await Quiz.create({
      lessonId: reactLesson3._id,
      questions: [
        {
          question: 'What does useState return?',
          options: ['Just the state value', 'An array with state and setter', 'An object', 'A function'],
          correctAnswer: 1,
          explanation: 'useState returns an array: [currentState, setStateFunction]'
        },
        {
          question: 'What happens when state changes?',
          options: ['Nothing', 'Component re-renders', 'Page reloads', 'App crashes'],
          correctAnswer: 1,
          explanation: 'When state changes, React re-renders the component to reflect the new state.'
        },
        {
          question: 'What is the initial count in useState(0)?',
          options: ['1', '0', 'undefined', 'null'],
          correctAnswer: 1,
          explanation: 'The argument to useState is the initial state value, so 0 in this case.'
        }
      ],
      passingScore: 60,
      xpReward: 25
    });

    reactLesson3.quiz = reactQuiz3._id;
    await reactLesson3.save();

    reactCourse.lessons = reactLessons;
    await reactCourse.save();
    console.log('Created React course');

    // Create Course 5: Database Basics with SQL
    const sqlCourse = await Course.create({
      title: 'Database Basics with SQL',
      description: 'Learn SQL and database fundamentals. Essential for any backend developer.',
      thumbnail: '🗄️',
      difficulty: 'beginner',
      estimatedTime: 22,
      lessons: [],
      totalXP: 130,
      isPublished: true
    });

    const sqlLessons = [];

    const sqlLesson1 = await Lesson.create({
      title: 'Introduction to Databases',
      content: `A database is an organized collection of structured data.\n\nWhy Databases?\n- Store large amounts of data efficiently\n- Quick data retrieval\n- Data integrity and security\n- Support multiple users simultaneously\n\nTypes of Databases:\n1. Relational (SQL): MySQL, PostgreSQL, SQLite\n   - Data in tables with rows and columns\n   - Relationships between tables\n   \n2. Non-Relational (NoSQL): MongoDB, Redis\n   - Flexible schemas\n   - Document, key-value, graph stores\n\nSQL (Structured Query Language) is the standard language for managing relational databases.\n\nRelational databases organize data like spreadsheets, but much more powerful!`,
      courseId: sqlCourse._id,
      order: 1,
      duration: 7,
      xpReward: 15
    });
    sqlLessons.push(sqlLesson1._id);

    const sqlQuiz1 = await Quiz.create({
      lessonId: sqlLesson1._id,
      questions: [
        {
          question: 'What does SQL stand for?',
          options: ['Structured Query Language', 'Simple Query Language', 'Standard Question Language', 'System Query Logic'],
          correctAnswer: 0,
          explanation: 'SQL stands for Structured Query Language.'
        },
        {
          question: 'Which is a relational database?',
          options: ['MongoDB', 'Redis', 'PostgreSQL', 'Cassandra'],
          correctAnswer: 2,
          explanation: 'PostgreSQL is a relational database. MongoDB and Redis are NoSQL databases.'
        },
        {
          question: 'How does a relational database organize data?',
          options: ['Documents', 'Tables with rows and columns', 'Key-value pairs', 'Graphs'],
          correctAnswer: 1,
          explanation: 'Relational databases organize data in tables with rows and columns.'
        }
      ],
      passingScore: 60,
      xpReward: 25
    });

    sqlLesson1.quiz = sqlQuiz1._id;
    await sqlLesson1.save();

    const sqlLesson2 = await Lesson.create({
      title: 'Basic SQL Queries',
      content: `SQL queries let you interact with databases.\n\nSELECT - Retrieve data:\nSELECT * FROM users;\nSELECT name, email FROM users;\nSELECT * FROM users WHERE age > 21;\n\nINSERT - Add data:\nINSERT INTO users (name, email, age)\nVALUES ('Alice', 'alice@example.com', 25);\n\nUPDATE - Modify data:\nUPDATE users\nSET age = 26\nWHERE name = 'Alice';\n\nDELETE - Remove data:\nDELETE FROM users WHERE id = 5;\n\nThese four operations (CREATE, READ, UPDATE, DELETE) are called CRUD operations and form the foundation of database interactions.`,
      courseId: sqlCourse._id,
      order: 2,
      duration: 9,
      xpReward: 20
    });
    sqlLessons.push(sqlLesson2._id);

    const sqlQuiz2 = await Quiz.create({
      lessonId: sqlLesson2._id,
      questions: [
        {
          question: 'Which SQL command retrieves data?',
          options: ['GET', 'SELECT', 'RETRIEVE', 'FETCH'],
          correctAnswer: 1,
          explanation: 'SELECT is used to retrieve data from a database.'
        },
        {
          question: 'What does CRUD stand for?',
          options: ['Create Read Update Delete', 'Create Retrieve Upload Download', 'Copy Read Update Deploy', 'Connect Read Use Delete'],
          correctAnswer: 0,
          explanation: 'CRUD stands for Create, Read, Update, Delete - the four basic database operations.'
        },
        {
          question: 'How do you filter results in SQL?',
          options: ['FILTER', 'IF', 'WHERE', 'WHEN'],
          correctAnswer: 2,
          explanation: 'The WHERE clause is used to filter results in SQL queries.'
        }
      ],
      passingScore: 60,
      xpReward: 25
    });

    sqlLesson2.quiz = sqlQuiz2._id;
    await sqlLesson2.save();

    const sqlLesson3 = await Lesson.create({
      title: 'Table Relationships',
      content: `Relationships connect data across multiple tables.\n\nTypes of Relationships:\n\n1. One-to-Many (Most Common)\n- One user has many posts\n- One customer has many orders\n\n2. Many-to-Many\n- Students and courses\n- Authors and books\n- Uses junction/join table\n\n3. One-to-One\n- User and profile\n- Person and passport\n\nForeign Keys:\n- Link tables together\n- Reference primary key of another table\n\nExample:\nCREATE TABLE posts (\n  id INT PRIMARY KEY,\n  user_id INT,\n  content TEXT,\n  FOREIGN KEY (user_id) REFERENCES users(id)\n);\n\nRelationships eliminate data duplication and maintain consistency!`,
      courseId: sqlCourse._id,
      order: 3,
      duration: 6,
      xpReward: 20
    });
    sqlLessons.push(sqlLesson3._id);

    const sqlQuiz3 = await Quiz.create({
      lessonId: sqlLesson3._id,
      questions: [
        {
          question: 'What is a foreign key?',
          options: ['A unique identifier', 'A reference to another table', 'An encrypted key', 'A password'],
          correctAnswer: 1,
          explanation: 'A foreign key is a field that references the primary key of another table.'
        },
        {
          question: 'Which relationship type is most common?',
          options: ['One-to-One', 'One-to-Many', 'Many-to-Many', 'All equally common'],
          correctAnswer: 1,
          explanation: 'One-to-Many is the most common relationship type in databases.'
        }
      ],
      passingScore: 60,
      xpReward: 25
    });

    sqlLesson3.quiz = sqlQuiz3._id;
    await sqlLesson3.save();

    sqlCourse.lessons = sqlLessons;
    await sqlCourse.save();
    console.log('Created SQL course');

    // Create Course 6: Git & Version Control
    const gitCourse = await Course.create({
      title: 'Git & Version Control',
      description: 'Master Git, the essential tool for tracking code changes and collaborating with teams.',
      thumbnail: '📝',
      difficulty: 'beginner',
      estimatedTime: 18,
      lessons: [],
      totalXP: 110,
      isPublished: true
    });

    const gitLessons = [];

    const gitLesson1 = await Lesson.create({
      title: 'What is Version Control?',
      content: `Version control systems track changes to files over time.\n\nWhy Version Control?\n- Track every change to your code\n- Collaborate with team members\n- Revert to previous versions\n- Work on features without breaking main code\n- See who changed what and when\n\nGit is the most popular version control system:\n- Created by Linus Torvalds (Linux creator)\n- Distributed system (every developer has full history)\n- Used by millions of developers worldwide\n- Powers GitHub, GitLab, Bitbucket\n\nThink of Git as a time machine for your code - you can travel back to any point in your project's history!`,
      courseId: gitCourse._id,
      order: 1,
      duration: 6,
      xpReward: 15
    });
    gitLessons.push(gitLesson1._id);

    const gitQuiz1 = await Quiz.create({
      lessonId: gitLesson1._id,
      questions: [
        {
          question: 'Who created Git?',
          options: ['Bill Gates', 'Linus Torvalds', 'Mark Zuckerberg', 'Steve Jobs'],
          correctAnswer: 1,
          explanation: 'Git was created by Linus Torvalds, who also created Linux.'
        },
        {
          question: 'What is the main purpose of version control?',
          options: ['Speed up code', 'Track changes over time', 'Compile programs', 'Design interfaces'],
          correctAnswer: 1,
          explanation: 'Version control systems track and manage changes to files over time.'
        },
        {
          question: 'Which is NOT a benefit of version control?',
          options: ['Collaboration', 'Tracking changes', 'Faster computers', 'Reverting mistakes'],
          correctAnswer: 2,
          explanation: 'Version control helps with collaboration and tracking, but doesn\'t make computers faster.'
        }
      ],
      passingScore: 60,
      xpReward: 25
    });

    gitLesson1.quiz = gitQuiz1._id;
    await gitLesson1.save();

    const gitLesson2 = await Lesson.create({
      title: 'Basic Git Commands',
      content: `Essential Git commands every developer should know:\n\nInitialize a Repository:\ngit init\n\nStage Changes:\ngit add <file>        # Stage specific file\ngit add .             # Stage all changes\n\nCommit Changes:\ngit commit -m "Your message here"\n\nCheck Status:\ngit status            # See what's changed\n\nView History:\ngit log               # See commit history\n\nCreate Branch:\ngit branch feature-name\ngit checkout feature-name\n# Or combined:\ngit checkout -b feature-name\n\nMerge Branch:\ngit checkout main\ngit merge feature-name\n\nThe workflow: make changes → stage → commit → repeat!`,
      courseId: gitCourse._id,
      order: 2,
      duration: 8,
      xpReward: 20
    });
    gitLessons.push(gitLesson2._id);

    const gitQuiz2 = await Quiz.create({
      lessonId: gitLesson2._id,
      questions: [
        {
          question: 'What command saves your changes permanently?',
          options: ['git save', 'git commit', 'git push', 'git store'],
          correctAnswer: 1,
          explanation: 'git commit saves your staged changes to the repository history.'
        },
        {
          question: 'What does "git add ." do?',
          options: ['Delete all files', 'Stage all changes', 'Commit everything', 'Create new file'],
          correctAnswer: 1,
          explanation: 'git add . stages all changes in the current directory for commit.'
        },
        {
          question: 'Which command shows your commit history?',
          options: ['git history', 'git log', 'git commits', 'git show'],
          correctAnswer: 1,
          explanation: 'git log displays the commit history.'
        }
      ],
      passingScore: 60,
      xpReward: 25
    });

    gitLesson2.quiz = gitQuiz2._id;
    await gitLesson2.save();

    const gitLesson3 = await Lesson.create({
      title: 'Working with GitHub',
      content: `GitHub is a platform for hosting Git repositories online.\n\nKey GitHub Concepts:\n\nClone a Repository:\ngit clone https://github.com/user/repo.git\n\nPush Changes:\ngit push origin main      # Send commits to GitHub\n\nPull Changes:\ngit pull origin main      # Get latest from GitHub\n\nRemote Repositories:\ngit remote -v             # View remotes\ngit remote add origin <url>\n\nCollaboration Features:\n- Pull Requests: Propose changes\n- Issues: Track bugs and features\n- Forks: Copy someone's project\n- Stars: Bookmark projects\n\nGitHub makes it easy to share code, collaborate with others, and contribute to open source!`,
      courseId: gitCourse._id,
      order: 3,
      duration: 4,
      xpReward: 15
    });
    gitLessons.push(gitLesson3._id);

    const gitQuiz3 = await Quiz.create({
      lessonId: gitLesson3._id,
      questions: [
        {
          question: 'What command downloads a repository from GitHub?',
          options: ['git download', 'git clone', 'git copy', 'git get'],
          correctAnswer: 1,
          explanation: 'git clone downloads a copy of a repository from GitHub.'
        },
        {
          question: 'What is a Pull Request?',
          options: ['Downloading code', 'Proposing changes', 'Deleting a branch', 'Creating an issue'],
          correctAnswer: 1,
          explanation: 'A Pull Request is a way to propose changes to a repository.'
        },
        {
          question: 'What does "git push" do?',
          options: ['Download changes', 'Upload commits to remote', 'Delete repository', 'Create branch'],
          correctAnswer: 1,
          explanation: 'git push uploads your local commits to the remote repository (like GitHub).'
        }
      ],
      passingScore: 60,
      xpReward: 25
    });

    gitLesson3.quiz = gitQuiz3._id;
    await gitLesson3.save();

    gitCourse.lessons = gitLessons;
    await gitCourse.save();
    console.log('Created Git course');

    // Create Course 7: API Development with REST
    const apiCourse = await Course.create({
      title: 'API Development with REST',
      description: 'Learn how to build RESTful APIs, the backbone of modern web applications.',
      thumbnail: '🔌',
      difficulty: 'intermediate',
      estimatedTime: 20,
      lessons: [],
      totalXP: 125,
      isPublished: true
    });

    const apiLessons = [];

    const apiLesson1 = await Lesson.create({
      title: 'What is an API?',
      content: `API stands for Application Programming Interface.\n\nThink of APIs as Restaurant Menus:\n- Menu: List of available options (endpoints)\n- Order: Your request\n- Kitchen: Server processing\n- Food: Response with data\n\nAPIs let different applications talk to each other:\n- Mobile app ↔ Server\n- Website ↔ Database\n- Your app ↔ Third-party service (Google Maps, Stripe, etc.)\n\nWhy APIs?\n- Separate frontend and backend\n- Enable mobile apps\n- Allow third-party integrations\n- Reuse business logic\n\nREST (Representational State Transfer) is the most popular API architecture style, using standard HTTP methods.`,
      courseId: apiCourse._id,
      order: 1,
      duration: 7,
      xpReward: 15
    });
    apiLessons.push(apiLesson1._id);

    const apiQuiz1 = await Quiz.create({
      lessonId: apiLesson1._id,
      questions: [
        {
          question: 'What does API stand for?',
          options: ['Application Programming Interface', 'Advanced Program Integration', 'Automated Process Interface', 'Application Process Integration'],
          correctAnswer: 0,
          explanation: 'API stands for Application Programming Interface.'
        },
        {
          question: 'What is REST?',
          options: ['A programming language', 'An API architecture style', 'A database', 'A framework'],
          correctAnswer: 1,
          explanation: 'REST (Representational State Transfer) is an architectural style for designing APIs.'
        },
        {
          question: 'Why use APIs?',
          options: ['Only for mobile apps', 'Only for databases', 'To enable communication between applications', 'To replace websites'],
          correctAnswer: 2,
          explanation: 'APIs enable different applications and services to communicate with each other.'
        }
      ],
      passingScore: 60,
      xpReward: 25
    });

    apiLesson1.quiz = apiQuiz1._id;
    await apiLesson1.save();

    const apiLesson2 = await Lesson.create({
      title: 'HTTP Methods and Status Codes',
      content: `RESTful APIs use HTTP methods to perform operations:\n\nCRUD Operations:\nGET    - Read data (retrieve)\nPOST   - Create data (new resource)\nPUT    - Update data (replace entire resource)\nPATCH  - Update data (partial update)\nDELETE - Delete data\n\nExamples:\nGET /api/users           # Get all users\nGET /api/users/123       # Get user 123\nPOST /api/users          # Create new user\nPUT /api/users/123       # Update user 123\nDELETE /api/users/123    # Delete user 123\n\nHTTP Status Codes:\n200 OK - Success\n201 Created - Resource created\n400 Bad Request - Invalid data\n401 Unauthorized - Not authenticated\n404 Not Found - Resource doesn't exist\n500 Internal Server Error - Server problem\n\nStatus codes tell the client what happened with their request.`,
      courseId: apiCourse._id,
      order: 2,
      duration: 8,
      xpReward: 20
    });
    apiLessons.push(apiLesson2._id);

    const apiQuiz2 = await Quiz.create({
      lessonId: apiLesson2._id,
      questions: [
        {
          question: 'Which HTTP method is used to create new data?',
          options: ['GET', 'POST', 'PUT', 'DELETE'],
          correctAnswer: 1,
          explanation: 'POST is used to create new resources in RESTful APIs.'
        },
        {
          question: 'What does a 404 status code mean?',
          options: ['Success', 'Created', 'Not Found', 'Server Error'],
          correctAnswer: 2,
          explanation: '404 means the requested resource was not found.'
        },
        {
          question: 'Which method retrieves data?',
          options: ['POST', 'GET', 'DELETE', 'PUT'],
          correctAnswer: 1,
          explanation: 'GET is used to retrieve/read data from the API.'
        }
      ],
      passingScore: 60,
      xpReward: 25
    });

    apiLesson2.quiz = apiQuiz2._id;
    await apiLesson2.save();

    const apiLesson3 = await Lesson.create({
      title: 'API Authentication & Security',
      content: `Protecting your API is crucial for security.\n\nAuthentication Methods:\n\n1. API Keys\n- Simple string token\n- Sent in headers or query params\n- Good for: Public APIs with rate limiting\n\n2. JWT (JSON Web Tokens)\n- Encoded token with claims\n- Stateless authentication\n- Good for: Modern web/mobile apps\n\n3. OAuth 2.0\n- Industry standard\n- Delegated authorization\n- Good for: Third-party integrations\n\nSecurity Best Practices:\n✓ Always use HTTPS\n✓ Validate all input data\n✓ Implement rate limiting\n✓ Use proper authentication\n✓ Don't expose sensitive data\n✓ Handle errors gracefully\n✓ Log security events\n\nExample JWT Header:\nAuthorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`,
      courseId: apiCourse._id,
      order: 3,
      duration: 5,
      xpReward: 20
    });
    apiLessons.push(apiLesson3._id);

    const apiQuiz3 = await Quiz.create({
      lessonId: apiLesson3._id,
      questions: [
        {
          question: 'What does JWT stand for?',
          options: ['Just Web Token', 'JSON Web Token', 'Java Web Tool', 'JavaScript Web Type'],
          correctAnswer: 1,
          explanation: 'JWT stands for JSON Web Token, a compact way to securely transmit information.'
        },
        {
          question: 'Why should APIs use HTTPS?',
          options: ['Faster performance', 'Better SEO', 'Encrypt data in transit', 'Prettier URLs'],
          correctAnswer: 2,
          explanation: 'HTTPS encrypts data during transmission, protecting sensitive information.'
        },
        {
          question: 'What is rate limiting?',
          options: ['Speed up requests', 'Limit number of requests', 'Compress responses', 'Cache data'],
          correctAnswer: 1,
          explanation: 'Rate limiting restricts how many requests a client can make in a time period.'
        }
      ],
      passingScore: 60,
      xpReward: 25
    });

    apiLesson3.quiz = apiQuiz3._id;
    await apiLesson3.save();

    apiCourse.lessons = apiLessons;
    await apiCourse.save();
    console.log('Created API Development course');

    console.log('\n✅ Seed data created successfully!');
    console.log(`Created ${badges.length} badges`);
    console.log('Created 7 courses with multiple lessons and quizzes');
    console.log('\nCourse Summary:');
    console.log('1. Introduction to JavaScript (3 lessons) - Beginner');
    console.log('2. Python Basics (2 lessons) - Beginner');
    console.log('3. Web Development Fundamentals (1 lesson) - Beginner');
    console.log('4. React Fundamentals (3 lessons) - Intermediate');
    console.log('5. Database Basics with SQL (3 lessons) - Beginner');
    console.log('6. Git & Version Control (3 lessons) - Beginner');
    console.log('7. API Development with REST (3 lessons) - Intermediate');
    
    process.exit(0);
  } catch (error) {
    console.error('Error seeding data:', error);
    process.exit(1);
  }
};

seedData();
