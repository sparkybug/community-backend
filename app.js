const express = require('express');
const bodyParser = require('body-parser');
const { authenticateToken, login, register } = require('./middleware/auth');
const { User, Post, Comment } = require('./models');

const app = express();
const port = 3000;

app.use(bodyParser.json());

// User routes
app.post('/register', register);
app.post('/login', login);

// Post routes

// create post
app.post('/posts', authenticateToken, async (req, res) => {
    const post = await Post.create({ ...req.body, userId: req.user.id, createdAt: new Date() });

    res.json(post);
});

// update a post by postId
app.put('/posts/:id', authenticateToken, async (req, res) => {
    const post = await Post.findByPk(req.params.id);

    if (post.userId !== req.user.id) return res.sendStatus(403);
    await post.update(req.body);

    res.json(post);
});

// delete a post by using postId
app.delete('/posts/:id', authenticateToken, async (req, res) => {
    const post = await Post.findByPk(req.params.id);

    if (post.userId !== req.user.id) return res.sendStatus(403);
    await post.destroy();

    res.sendStatus(204);
});

// get all posts
app.get('/posts', async (req, res) => {
    const { sortBy, category } = req.query;
    const where = category ? { category } : {};
    const order = sortBy === 'upvotes' ? [['upvotes', 'DESC']] : [['createdAt', 'DESC']];
    const posts = await Post.findAll({ where, order, include: [{ model: User, attributes: ['username', 'email'] }, { model: Comment, attributes: ['content', 'userId', 'postId'] },] });

    res.json(posts);
});

// Upvote a post
app.post('/posts/:id/upvote', authenticateToken, async (req, res) => {
    const post = await Post.findByPk(req.params.id);
    if (!post) return res.status(404).json({ message: 'Post not found' });

    post.upvotes += 1;
    await post.save();

    res.json(post);
});

// Downvote a post
app.post('/posts/:id/downvote', authenticateToken, async (req, res) => {
    const post = await Post.findByPk(req.params.id);
    if (!post) return res.status(404).json({ message: 'Post not found' });

    post.downvotes += 1;
    await post.save();

    res.json(post);
});


// Comment routes
app.post('/posts/:postId/comments', authenticateToken, async (req, res) => {
    const comment = await Comment.create({ ...req.body, userId: req.user.id, postId: req.params.postId, createdAt: new Date() });

    res.json(comment);
});

app.get('/posts/:postId/comments', async (req, res) => {
    const comments = await Comment.findAll({ where: { postId: req.params.postId }, include: [User] });

    res.json(comments);
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
