const express = require('express');
const router = express.Router();
const { dataUser, dataRole } = require('../data2');

const asyncHandler = (fn) => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);

router.get('/', asyncHandler(async (req, res) => {
  res.json(dataUser);
}));

router.get('/:username', asyncHandler(async (req, res) => {
  const username = req.params.username;
  const user = dataUser.find(u => u.username === username);
  if (!user) return res.status(404).json({ message: 'User NOT FOUND' });
  res.json(user);
}));

router.post('/', asyncHandler(async (req, res) => {
  const { username, password, email, fullName, avatarUrl, status, roleId } = req.body;
  if (!username || !password) return res.status(400).json({ message: 'username and password are required' });
  if (dataUser.find(u => u.username === username)) return res.status(400).json({ message: 'Username already exists' });

  let role = null;
  if (roleId) role = dataRole.find(r => r.id === roleId) || null;

  const newUser = {
    username,
    password,
    email: email || '',
    fullName: fullName || '',
    avatarUrl: avatarUrl || 'https://i.sstatic.net/l60Hf.png',
    status: status !== undefined ? status : true,
    loginCount: 0,
    role: role || { id: 'r3', name: 'Người dùng', description: 'Tài khoản người dùng thông thường' },
    creationAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  dataUser.push(newUser);
  res.status(201).json(newUser);
}));

router.put('/:username', asyncHandler(async (req, res) => {
  const username = req.params.username;
  const user = dataUser.find(u => u.username === username);
  if (!user) return res.status(404).json({ message: 'User NOT FOUND' });

  const { password, email, fullName, avatarUrl, status, roleId } = req.body;
  if (password) user.password = password;
  if (email) user.email = email;
  if (fullName) user.fullName = fullName;
  if (avatarUrl) user.avatarUrl = avatarUrl;
  if (status !== undefined) user.status = status;

  if (roleId) {
    const role = dataRole.find(r => r.id === roleId);
    if (role) user.role = role;
  }

  user.updatedAt = new Date().toISOString();
  res.json(user);
}));

router.delete('/:username', asyncHandler(async (req, res) => {
  const username = req.params.username;
  const index = dataUser.findIndex(u => u.username === username);
  if (index === -1) return res.status(404).json({ message: 'User NOT FOUND' });
  const [deleted] = dataUser.splice(index, 1);
  res.json(deleted);
}));

module.exports = router;

