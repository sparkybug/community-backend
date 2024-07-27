const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../middleware/auth');
const { Post, User, Comment } = require('../models');

router.get('/', async (req, res) => {
    const { sortBy, category } = req.query;
    const where = category ? { category } : {};
    const order = sortBy === 'upvotes' ? [['upvotes', 'DESC']] : [['createdAt', 'DESC']];
    const posts = await Post.findAll({ where, order, include: [{ model: User, attributes: ['username', 'email'] }, { model: Comment, attributes: ['content', 'userId', 'postId'] }] });

    res.json(posts);
});

router.post('/', authenticateToken, async (req, res) => {
    const post = await Post.create({ ...req.body, userId: req.user.id, createdAt: new Date() });

    res.json(post);
});

router.put('/:id', authenticateToken, async (req, res) => {
    const post = await Post.findByPk(req.params.id);

    if (post.userId !== req.user.id) return res.sendStatus(403);
    await post.update(req.body);

    res.json(post);
});

router.delete('/:id', authenticateToken, async (req, res) => {
    const post = await Post.findByPk(req.params.id);

    if (post.userId !== req.user.id) return res.sendStatus(403);
    await post.destroy();

    res.sendStatus(204);
});

router.post('/:id/upvote', authenticateToken, async (req, res) => {
    const post = await Post.findByPk(req.params.id);
    if (!post) return res.status(404).json({ message: 'Post not found' });

    post.upvotes += 1;
    await post.save();

    res.json(post);
});

router.post('/:id/downvote', authenticateToken, async (req, res) => {
    const post = await Post.findByPk(req.params.id);
    if (!post) return res.status(404).json({ message: 'Post not found' });

    post.downvotes += 1;
    await post.save();

    res.json(post);
});

module.exports = router;
