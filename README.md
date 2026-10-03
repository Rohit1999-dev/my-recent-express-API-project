My Recent Express API

A backend REST API built with Node.js and Express.js. This project provides user-related API functionality with database integration, password hashing, JWT authentication, and centralized error handling.

Features

RESTful API using Express.js

User management APIs

Database configuration

Password hashing

JWT-based authentication

Centralized error handling

Environment variable support

Organized project structure

Tech Stack

Node.js

Express.js

JavaScript

MYSQL

JWT

bcrypt

Git & GitHub

Project Structure
backendApi/
│
├── src/
│   ├── config/
│   │   └── db.js
│   │
│   ├── controllers/
│   │   └── user.controller.js
│   │
│   ├── routes/
│   │   └── user.js
│   │
│   └── utils/
│       ├── errorHandler.js
│       ├── hashpassword.js
│       └── jwt.js
│
├── package.json
├── package-lock.json
├── service.yml
└── README.md

Installation

Clone the repository:

git clone https://github.com/Rohit1999-dev/my-recent-express-API-project.git


Go to the project directory:

cd my-recent-express-API-project


Install dependencies:

npm install

Environment Variables

Create a .env file in the root directory of the project.

Example:

host=HOST
PORT=DB_PORT
user=DB_USER
password= DB_PASSWORD
database= DB_NAME
JWT_SECRET=your_jwt_secret


Replace the values with your actual configuration.

Running the Application

Start the application with:

npm start

For development, if you are using nodemon:

npm run dev
