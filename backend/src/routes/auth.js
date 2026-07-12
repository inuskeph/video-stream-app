const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { protect } = require('../middleware/auth');
const router = express.Router();
const genToken = (id) => jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });

router.post('/register', async (req, res) => {
  try {
    const { username, email, password } = req.body;
    if (await User.findOne({ $or: [{ email }, { username }] })) return res.status(400).json({ message: 'User exists' });
    const user = await User.create({ username, email, password });
    res.status(201).json({ _id: user._id, username: user.username, email: user.email, role: user.role, token: genToken(user._id) });
  } catch (e) { res.status(500).json({ message: e.message }); }
});

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user || !(await user.comparePassword(password))) return res.status(401).json({ message: 'Invalid credentials' });
    res.json({ _id: user._id, username: user.username, email: user.email, role: user.role, token: genToken(user._id) });
  } catch (e) { res.status(500).json({ message: e.message }); }
});

router.get('/profile', protect, async (req, res) => { res.json(await User.findById(req.user._id).select('-password')); });
module.exports = router;
