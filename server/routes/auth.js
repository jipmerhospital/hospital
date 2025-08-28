import { Router } from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const router = Router();

export const seedAdminIfNeeded = async () => {
  const count = await User.countDocuments({ role: 'admin' });
  if (count === 0) {
    await User.create({ name: 'Admin', email: 'admin@example.com', password: 'Admin@123', role: 'admin' });
    console.log('Seeded default admin: admin@example.com / Admin@123');
  }
};

router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user) return res.status(400).json({ message: 'Invalid credentials' });
  const ok = await user.comparePassword(password);
  if (!ok) return res.status(400).json({ message: 'Invalid credentials' });
  const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '7d' });
  res.json({ token, user: { id: user._id, name: user.name, role: user.role, email: user.email } });
});

// Admin creates a clerk
router.post('/register', async (req, res) => {
  try {
    const requester = req.headers['x-role'];
    // Note: In production, gate by middleware requireRole('admin'); but for simplicity we check header if using seed admin on frontend call.
    // In real use, use auth middleware + requireRole('admin').
    if (!requester || requester !== 'admin') return res.status(403).json({ message: 'Forbidden' });
    const { name, email, password, role } = req.body;
    const user = await User.create({ name, email, password, role: role || 'clerk' });
    res.status(201).json({ id: user._id });
  } catch (e) {
    res.status(400).json({ message: e.message });
  }
});

export default router;
