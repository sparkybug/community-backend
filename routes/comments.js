const express = require('express');
const router = express.Router({ mergeParams: true }); 
const { authenticateToken } = require('../middleware/auth');
const { Comment, User } = require('../models');

// Route to create a comment on a post
router.post('/', authenticateToken, async (req, res) => {
    const { postId } = req.params;
    const { content } = req.body;
    const comment = await Comment.create({
        content,
        userId: req.user.id,
        postId,
        createdAt: new Date()
    });

    res.json(comment);
});

// Route to get comments for a specific post
router.get('/', async (req, res) => {
    const { postId } = req.params;
    const comments = await Comment.findAll({
        where: { postId },
        include: [User]
    });

    res.json(comments);
});

module.exports = router;
