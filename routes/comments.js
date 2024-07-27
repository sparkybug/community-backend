const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../middleware/auth');
const { Comment, User } = require('../models');

router.post('/', authenticateToken, async (req, res) => {
    const comment = await Comment.create({ ...req.body, userId: req.user.id, postId: req.params.postId, createdAt: new Date() });

    res.json(comment);
});

router.get('/', async (req, res) => {
    const comments = await Comment.findAll({ where: { postId: req.params.postId }, include: [User] });

    res.json(comments);
});

module.exports = router;
