const express = require('express');
const bodyParser = require('body-parser');
const { authenticateToken, login, register } = require('./middleware/auth');
const swagger = require('./swagger');
const postRoutes = require('./routes/posts');
const commentRoutes = require('./routes/comments');
const userRoutes = require('./routes/auth');

const app = express();
const port = 3000;

app.use(bodyParser.json());

// Swagger setup
swagger(app);

// User routes
app.use('/auth', userRoutes); 

// Post routes
app.use('/posts', postRoutes); 

// Comment routes
app.use('/posts/:postId/comments', commentRoutes);

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
