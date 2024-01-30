const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
const express = require('express');
const bodyParser = require('body-parser');
const { Sequelize, DataTypes } = require('sequelize');

const app = express();
const port = 3000;

// Set up Sequelize with a MySQL database
const sequelize = new Sequelize('OneID', 'root', 'admin', {
  host: '172.18.0.2',
  port: '3307',
  dialect: 'mysql',
  dialectOptions: {
    connectTimeout: 60000,
  },
});

const User = sequelize.define('User', {
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    given_names: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    last_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    password_hash: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    dob: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    birth_location: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    home_location: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    personal_bank_account: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    education_history: {
      type: DataTypes.TEXT,
    },
    mom_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    dad_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    gender_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  });
  
const Location = sequelize.define('Location', {
location_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
},
name: {
    type: DataTypes.STRING(100),
    allowNull: false,
},
latitude: {
    type: DataTypes.DECIMAL(10, 6),
    allowNull: false,
},
longitude: {
    type: DataTypes.DECIMAL(10, 6),
    allowNull: false,
},
});

module.exports = Location;

const School = sequelize.define('School', {
school_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
},
name: {
    type: DataTypes.STRING(100),
    allowNull: false,
},
location_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
},
rating: {
    type: DataTypes.DECIMAL(3, 2),
},
});

// Define associations
School.belongsTo(Location, { foreignKey: 'location_id' });

module.exports = School;

const Course = sequelize.define('Course', {
course_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
},
name: {
    type: DataTypes.STRING(100),
    allowNull: false,
},
school_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
},
});

// Define associations
Course.belongsTo(School, { foreignKey: 'school_id' });

module.exports = Course;

const Student = sequelize.define('Student', {
student_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
},
user_id: {
    type: DataTypes.INTEGER,
    unique: true,
    allowNull: false,
},
});

// Define associations
Student.belongsTo(User, { foreignKey: 'user_id' });

module.exports = Student;

const Enrollment = sequelize.define('Enrollment', {
student_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
},
course_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
},
});

// Define associations
Enrollment.belongsTo(Student, { foreignKey: 'student_id' });
Enrollment.belongsTo(Course, { foreignKey: 'course_id' });

module.exports = Enrollment;

const Grade = sequelize.define('Grade', {
grade_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
},
student_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
},
course_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
},
comment: {
    type: DataTypes.TEXT,
    allowNull: false,
},
grade: {
    type: DataTypes.DECIMAL(3, 2),
    allowNull: false,
},
grade_timestamp: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
},
});

// Define associations
Grade.belongsTo(Enrollment, { foreignKey: 'student_id', targetKey: 'student_id' });
Grade.belongsTo(Course, { foreignKey: 'course_id' });

module.exports = Grade;

const Absence = sequelize.define('Absence', {
id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
},
student_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
    model: 'Students',
    key: 'student_id', // Corrected reference to the primary key of the Students table
    },
},
date: {
    type: DataTypes.DATE,
    allowNull: false,
},
reason: {
    type: DataTypes.STRING,
    allowNull: true,
},
createdAt: {
    type: DataTypes.DATE,
    allowNull: false,
},
updatedAt: {
    type: DataTypes.DATE,
    allowNull: false,
},
});

module.exports = Absence;

// Sync the database
sequelize.sync()
  .then(() => {
    console.log('Database synced');
  })
  .catch((error) => {
    console.error('Error syncing database:', error);
  });

// Middleware to parse JSON in request body
app.use(bodyParser.json());

// Sign-up endpoint
app.get('/signup', (req, res) => {
  res.render('signup');
});

app.post('/api/signup', async (req, res) => {
    try{
    const { username, given_names, last_name, password_hash, dob, birth_location, home_location, personal_bank_account, education_history, mom_id, dad_id, gender_id } = req.body;

    // Create a new user
    const newUser = await User.create({
      username,
      given_names,
      last_name,
      password_hash,
      dob,
      birth_location,
      home_location,
      personal_bank_account,
      education_history,
      mom_id,
      dad_id,
      gender_id,
    });

    res.status(201).json({
      id: newUser.id,
      username: newUser.username,
      given_names: newUser.given_names,
      last_name: newUser.last_name,
    });
  } catch (error) {
    console.error('Error signing up:', error.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Swagger setup
const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Your API Documentation',
      version: '1.0.0',
    },
  },
  apis: ['swagger.js'], // Add the path to this file
};

const swaggerSpec = swaggerJsdoc(options);

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
/**
 * @swagger
 * /signup:
 *   get:
 *     summary: Render signup page
 *     description: Render the signup page for the user.
 *     responses:
 *       200:
 *         description: Successfully rendered the signup page.
 */

/**
 * @swagger
 * /api/signup:
 *   post:
 *     summary: Create a new user
 *     description: Create a new user based on the provided information.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *               given_names:
 *                 type: string
 *               last_name:
 *                 type: string
 *               password_hash:
 *                 type: string
 *               dob:
 *                 type: string
 *                 format: date
 *               birth_location:
 *                 type: integer
 *               home_location:
 *                 type: integer
 *               personal_bank_account:
 *                 type: string
 *               education_history:
 *                 type: string
 *               mom_id:
 *                 type: integer
 *               dad_id:
 *                 type: integer
 *               gender_id:
 *                 type: integer
 *     responses:
 *       201:
 *         description: User created successfully.
 *         content:
 *           application/json:
 *             example:
 *               id: 1
 *               username: john_doe
 *               given_names: John
 *               last_name: Doe
 */
