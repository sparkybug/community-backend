const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../middleware/auth');
const { Post, User, Comment } = require('../models');

/**
 * @swagger
 * components:
 *   schemas:
 *     Post:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           example: 1
 *         title:
 *           type: string
 *           example: My first post
 *         content:
 *           type: string
 *           example: This is the content of the post
 *         userId:
 *           type: integer
 *           example: 1
 *         createdAt:
 *           type: string
 *           format: date-time
 *           example: '2024-07-26T00:00:00.000Z'
 */

/**
 * @swagger
 * /posts:
 *   get:
 *     summary: Retrieve all posts
 *     responses:
 *       200:
 *         description: A list of posts
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Post'
 */
router.get('/', async (req, res) => {
    const { sortBy, category } = req.query;
    const where = category ? { category } : {};
    const order = sortBy === 'upvotes' ? [['upvotes', 'DESC']] : [['createdAt', 'DESC']];
    const posts = await Post.findAll({ where, order, include: [{ model: User, attributes: ['username', 'email'] }, { model: Comment, attributes: ['content', 'userId', 'postId'] }] });

    res.json(posts);
});

/**
 * @swagger
 * /posts:
 *   post:
 *     summary: Create a new post
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 example: My first post
 *               content:
 *                 type: string
 *                 example: This is the content of the post
 *     responses:
 *       201:
 *         description: Post created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Post'
 */
router.post('/', authenticateToken, async (req, res) => {
    const post = await Post.create({ ...req.body, userId: req.user.id, createdAt: new Date() });

    res.json(post);
});

/**
 * @swagger
 * /posts/{id}:
 *   put:
 *     summary: Update a post by ID
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: The ID of the post to update
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 example: Updated post title
 *               content:
 *                 type: string
 *                 example: Updated post content
 *     responses:
 *       200:
 *         description: Post updated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Post'
 */
router.put('/:id', authenticateToken, async (req, res) => {
    const post = await Post.findByPk(req.params.id);

    if (post.userId !== req.user.id) return res.sendStatus(403);
    await post.update(req.body);

    res.json(post);
});

/**
 * @swagger
 * /posts/{id}:
 *   delete:
 *     summary: Delete a post by ID
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: The ID of the post to delete
 *         schema:
 *           type: integer
 *     responses:
 *       204:
 *         description: Post deleted
 */
router.delete('/:id', authenticateToken, async (req, res) => {
    const post = await Post.findByPk(req.params.id);

    if (post.userId !== req.user.id) return res.sendStatus(403);
    await post.destroy();

    res.sendStatus(204);
});

/**
 * @swagger
 * /posts/{id}/upvote:
 *   post:
 *     summary: Upvote a post
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: The ID of the post to upvote
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Post upvoted
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Post'
 */
router.post('/:id/upvote', authenticateToken, async (req, res) => {
    const post = await Post.findByPk(req.params.id);
    if (!post) return res.status(404).json({ message: 'Post not found' });

    post.upvotes += 1;
    await post.save();

    res.json(post);
});

/**
 * @swagger
 * /posts/{id}/downvote:
 *   post:
 *     summary: Downvote a post
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: The ID of the post to downvote
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Post downvoted
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Post'
 */
router.post('/:id/downvote', authenticateToken, async (req, res) => {
    const post = await Post.findByPk(req.params.id);
    if (!post) return res.status(404).json({ message: 'Post not found' });

    post.downvotes += 1;
    await post.save();

    res.json(post);
});

module.exports = router;
