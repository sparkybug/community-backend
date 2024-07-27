const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const bcrypt = require('bcrypt');
const { User } = require('../models');

dotenv.config();

const secret = process.env.JWT_SECRET;

const generateToken = (user) => {
    return jwt.sign({ id: user.id, username: user.username, email: user.email }, secret, {
        expiresIn: '1h',
    });
};

const authenticateToken = (req, res, next) => {
    const token = req.header('Authorization') && req.header('Authorization').split(' ')[1];

    if (!token) return res.sendStatus(401);

    try {
        const decoded = jwt.verify(token, secret);
        req.user = decoded;
        next();
    } catch (ex) {
        res.status(400).json({ message: 'Invalid token' });
    }
};

const login = async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ where: { email } });

    if (!user || !bcrypt.compareSync(password, user.password)) {
        return res.sendStatus(401);
    }

    const token = generateToken(user);

    res.json({ token });
};

const register = async (req, res) => {
    const { username, email, password } = req.body;
    const hashedPassword = bcrypt.hashSync(password, 10);
    const user = await User.create({ username, email, password: hashedPassword });

    res.json(user);
};

module.exports = { generateToken, authenticateToken, login, register };
