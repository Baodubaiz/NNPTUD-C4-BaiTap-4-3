const express = require('express');
const router = express.Router();
const { dataRole, dataUser } = require('../data2');

const asyncHandler = (fn) => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);

router.get('/', asyncHandler(async (req, res) => {
    res.json(dataRole);
}));

router.get('/:id', asyncHandler(async (req, res) => {
    const id = req.params.id;
    const role = dataRole.find(r => r.id === id);
    if (!role) return res.status(404).json({ message: 'Role NOT FOUND' });
    res.json(role);
}));

router.get('/:id/users', asyncHandler(async (req, res) => {
    const id = req.params.id;
    const role = dataRole.find(r => r.id === id);
    if (!role) return res.status(404).json({ message: 'Role NOT FOUND' });
    const users = dataUser.filter(u => u.role && u.role.id === id);
    res.json(users);
}));

router.post('/', asyncHandler(async (req, res) => {
    const { name, description } = req.body;
    if (!name) return res.status(400).json({ message: 'Name is required' });

    const maxNum = dataRole.reduce((max, r) => {
        const n = parseInt(r.id.slice(1)) || 0;
        return n > max ? n : max;
    }, 0);
    const newId = 'r' + (maxNum + 1);

    const newRole = {
        id: newId,
        name,
        description: description || '',
        creationAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
    };
    dataRole.push(newRole);
    res.status(201).json(newRole);
}));

router.put('/:id', asyncHandler(async (req, res) => {
    const id = req.params.id;
    const role = dataRole.find(r => r.id === id);
    if (!role) return res.status(404).json({ message: 'Role NOT FOUND' });
    if (req.body.name) role.name = req.body.name;
    if (req.body.description) role.description = req.body.description;
    role.updatedAt = new Date().toISOString();
    res.json(role);
}));

router.delete('/:id', asyncHandler(async (req, res) => {
    const id = req.params.id;
    const index = dataRole.findIndex(r => r.id === id);
    if (index === -1) return res.status(404).json({ message: 'Role NOT FOUND' });
    const [deleted] = dataRole.splice(index, 1);
    res.json(deleted);
}));

module.exports = router;
