const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../middleware/auth');
const { Comment, User } = require('../models');

/**
 * @swagger
 * /posts/{postId}/comments:
 *   post:
 *     summary: Add a comment to a post
 *     parameters:
 *       - name: postId
 *         in: path
 *         required: true
 *         description: The ID of the post to comment on
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               content:
 *                 type: string
 *                 example: This is a comment
 *     responses:
 *       201:
 *         description: Comment created
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                   example: 1
 *                 content:
 *                   type: string
 *                   example: This is a comment
 *                 postId:
 *                   type: integer
 *                   example: 1
 *                 userId:
 *                   type: integer
 *                   example: 1
 *                 createdAt:
 *                   type: string
 *                   format: date-time
 *                   example: '2024-07-26T00:00:00.000Z'
 */
router.post('/', authenticateToken, async (req, res) => {
    const comment = await Comment.create({ ...req.body, userId: req.user.id, postId: req.params.postId, createdAt: new Date() });

    res.json(comment);
});

/**
 * @swagger
 * /posts/{postId}/comments:
 *   get:
 *     summary: Retrieve comments for a post
 *     parameters:
 *       - name: postId
 *         in: path
 *         required: true
 *         description: The ID of the post to retrieve comments for
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: A list of comments
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                     example: 1
 *                   content:
 *                     type: string
 *                     example: This is a comment
 *                   postId:
 *                     type: integer
 *                     example: 1
 *                   userId:
 *                     type: integer
 *                     example: 1
 *                   createdAt:
 *                     type: string
 *                     format: date-time
 *                     example: '2024-07-26T00:00:00.000Z'
 */
router.get('/', async (req, res) => {
    const comments = await Comment.findAll({ where: { postId: req.params.postId }, include: [User] });

    res.json(comments);
});

module.exports = router;
