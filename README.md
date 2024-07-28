# Hospyta Backend API

This project is a backend API for a community feature in a cross-platform mobile app. The API allows users to create and manage posts, comments, and interactions such as upvotes and downvotes. The project is built using Node.js and Sequelize as the ORM for PostgreSQL database.

## Features

- User registration and authentication
- Post management (create, edit, delete)
- Comment management (create, retrieve)
- Upvote and downvote posts
- Retrieve posts with sorting and filtering options
- Secure endpoints with JWT authentication
- Auto-generated Swagger documentation

## Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/yourusername/community-backend.git
   cd community-backend
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Set up the environment variables:

   Create a `.env.sample` file in the root directory with the following content:

   ```env
   DATABASE_URL=your_postgresql_database_url
   JWT_SECRET=your_jwt_secret
   ```

   Copy the `.env.sample` file to `.env` and fill in your values:

   ```bash
   cp .env.sample .env
   ```

   You can generate a JWT secret using the following command:

   ```bash
   node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
   ```

   Take the output of this command and set it as the value for `JWT_SECRET` in your `.env` file.

4. Run the database migrations:

   ```bash
   npx sequelize-cli db:migrate
   ```

5. Start the server:

   ```bash
   npm start
   ```

## API Endpoints

### User Routes

- **POST /register**: Register a new user
- **POST /login**: Login and get a JWT token

### Post Routes

- **POST /posts**: Create a new post (requires authentication)
- **PUT /posts/:id**: Edit a post (requires authentication)
- **DELETE /posts/:id**: Delete a post (requires authentication)
- **GET /posts**: Retrieve all posts with sorting and filtering options

### Comment Routes

- **POST /posts/:postId/comments**: Add a comment to a post (requires authentication)
- **GET /posts/:postId/comments**: Retrieve comments for a specific post

## Approach

1. **Project Setup**:
   - Initialized a new Node.js project with Express and Sequelize.
   - Configured Sequelize to use PostgreSQL.

2. **Database Models**:
   - Created `User`, `Post`, and `Comment` models with appropriate fields and associations.
   - Defined one-to-many relationships between `User` and `Post`, and `Post` and `Comment`.

3. **User Authentication**:
   - Implemented user registration and login endpoints.
   - Used bcrypt for password hashing and JWT for authentication.
   - Created middleware to authenticate JWT tokens for protected routes.

4. **Post and Comment Management**:
   - Developed endpoints to create, edit, delete, and retrieve posts.
   - Implemented sorting and filtering options for retrieving posts.
   - Created endpoints for adding and retrieving comments for posts.

5. **Security and Optimization**:
   - Secured endpoints with JWT authentication.
   - Added proper error handling and validation.
   - Optimized database queries for performance.

## Challenges and Solutions

1. **Eager Loading Error**:
   - Faced issues with Sequelize eager loading due to incorrect association definitions.
   - Solved by properly defining associations in the models and ensuring they were correctly initialized in `models/index.js`.

2. **Authentication and Authorization**:
   - Implementing JWT authentication required careful handling of token generation and verification.
   - Ensured that only authenticated users could access protected routes and only the owners could edit or delete their posts.

3. **Database Migrations**:
   - Managing database schema changes and migrations was challenging.
   - Used Sequelize CLI to create and run migrations, ensuring the database schema was always up-to-date.


## License

This project is licensed under the MIT License.
