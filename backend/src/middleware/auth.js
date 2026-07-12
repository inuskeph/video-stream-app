const jwt = require('jsonwebtoken');
const supabase = require('../config/db');

const protect = async (req, res, next) => {
  let token;
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const { data } = await supabase.from('users').select('id, username, email, role, avatar').eq('id', decoded.id).single();
      if (!data) return res.status(401).json({ message: 'User not found' });
      req.user = data;
      next();
    } catch (error) {
      return res.status(401).json({ message: 'Not authorized' });
    }
  }
  if (!token) return res.status(401).json({ message: 'No token' });
};

const adminOnly = (req, res, next) => {
  if (req.user && req.user.role === 'admin') next();
  else res.status(403).json({ message: 'Admin only' });
};

const creatorOrAdmin = (req, res, next) => {
  if (req.user && (req.user.role === 'admin' || req.user.role === 'creator')) next();
  else res.status(403).json({ message: 'Creator only' });
};

module.exports = { protect, adminOnly, creatorOrAdmin };
