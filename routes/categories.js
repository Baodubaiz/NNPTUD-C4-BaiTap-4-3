const express = require('express');
const router = express.Router();
const { dataCategories, dataProducts } = require('../utils/data');
const slugify = require('slugify');
const { genID } = require('../utils/idHandler');

const asyncHandler = (fn) => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);

router.get('/', asyncHandler(async (req, res) => {
  const list = dataCategories.filter(c => !c.isDeleted);
  res.json(list);
}));

router.get('/:id', asyncHandler(async (req, res) => {
  const id = req.params.id;
  const category = dataCategories.find(c => c.id == id && !c.isDeleted);
  if (!category) return res.status(404).json({ message: 'ID NOT FOUND' });
  res.json(category);
}));

router.get('/:id/products', asyncHandler(async (req, res) => {
  const id = req.params.id;
  const category = dataCategories.find(c => c.id == id && !c.isDeleted);
  if (!category) return res.status(404).json({ message: 'ID NOT FOUND' });
  const products = dataProducts.filter(p => p.category && p.category.id == id && !p.isDeleted);
  res.json(products);
}));

router.post('/', asyncHandler(async (req, res) => {
  const { name, image } = req.body;
  if (!name) return res.status(400).json({ message: 'Name is required' });

  const newCate = {
    id: genID(dataCategories),
    name,
    slug: slugify(name, { replacement: '-', lower: true }),
    image: image || null,
    creationAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    isDeleted: false
  };

  dataCategories.push(newCate);
  res.status(201).json(newCate);
}));

router.put('/:id', asyncHandler(async (req, res) => {
  const id = req.params.id;
  const category = dataCategories.find(c => c.id == id && !c.isDeleted);
  if (!category) return res.status(404).json({ message: 'ID NOT FOUND' });

  const updatableKeys = Object.keys(req.body);
  updatableKeys.forEach((key) => {
    if (key === 'id') return;
    if (Object.prototype.hasOwnProperty.call(category, key)) {
      category[key] = req.body[key];
    }
  });
  if (req.body.name) {
    category.slug = slugify(req.body.name, { replacement: '-', lower: true });
  }
  category.updatedAt = new Date().toISOString();
  res.json(category);
}));

router.delete('/:id', asyncHandler(async (req, res) => {
  const id = req.params.id;
  const category = dataCategories.find(c => c.id == id && !c.isDeleted);
  if (!category) return res.status(404).json({ message: 'ID NOT FOUND' });
  category.isDeleted = true;
  category.updatedAt = new Date().toISOString();
  res.json(category);
}));

module.exports = router;

