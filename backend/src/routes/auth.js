const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const supabase = require('../config/db');
const { protect } = require('../middleware/auth');
const router = express.Router();

const genToken = (id) => jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });

router.post('/register', async (req, res) => {
  try {
    const { username, email, password } = req.body;
    if (!username || !email || !password) return res.status(400).json({ message: 'All fields required' });

    // Check if user exists
    const { data: existing } = await supabase.from('users').select('id').or(`email.eq.${email},username.eq.${username}`).limit(1);
    if (existing && existing.length > 0) return res.status(400).json({ message: 'User already exists' });

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const { data: user, error } = await supabase.from('users').insert({ username, email, password: hashedPassword, role: 'user' }).select('id, username, email, role, avatar').single();
    if (error) return res.status(500).json({ message: 'Database error: ' + error.message });

    res.status(201).json({ _id: user.id, username: user.username, email: user.email, role: user.role, avatar: user.avatar || '', token: genToken(user.id) });
  } catch (e) { res.status(500).json({ message: 'Server error: ' + e.message }); }
});

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ message: 'All fields required' });

    const { data: user, error } = await supabase.from('users').select('*').eq('email', email).single();
    if (error || !user) return res.status(401).json({ message: 'Invalid credentials - user not found' });
    if (!user.password) return res.status(401).json({ message: 'Invalid credentials - no password set' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ message: 'Invalid credentials - wrong password' });

    res.json({ _id: user.id, username: user.username, email: user.email, role: user.role, avatar: user.avatar || '', token: genToken(user.id) });
  } catch (e) { res.status(500).json({ message: 'Server error: ' + e.message }); }
});

router.get('/profile', protect, async (req, res) => {
  res.json(req.user);
});

module.exports = router;
