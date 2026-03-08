const express = require('express');
const router = express.Router();
const { dataCategories, dataProducts } = require('../utils/data');
const slugify = require('slugify');
const { genID, getItemById } = require('../utils/idHandler');

const asyncHandler = (fn) => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);

router.get('/', asyncHandler(async (req, res) => {
  const list = dataProducts.filter(p => !p.isDeleted);
  res.json(list);
}));

router.get('/:id', asyncHandler(async (req, res) => {
  const id = req.params.id;
  const product = dataProducts.find(p => p.id == id && !p.isDeleted);
  if (!product) return res.status(404).json({ message: 'ID NOT FOUND' });
  res.json(product);
}));

router.post('/', asyncHandler(async (req, res) => {
  const cateId = req.body.category;
  const category = getItemById(cateId, dataCategories);
  if (!category) return res.status(400).json({ message: 'CATEGORY ID NOT FOUND' });

  const { title, images, price, description } = req.body;
  if (!title) return res.status(400).json({ message: 'Title is required' });

  const newProduct = {
    id: genID(dataProducts),
    title,
    slug: slugify(title, { replacement: '-', lower: true }),
    images: images || [],
    creationAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    price: price || 0,
    description: description || '',
    category
  };

  dataProducts.push(newProduct);
  res.status(201).json(newProduct);
}));

router.put('/:id', asyncHandler(async (req, res) => {
  const id = req.params.id;
  const product = dataProducts.find(p => p.id == id && !p.isDeleted);
  if (!product) return res.status(404).json({ message: 'ID NOT FOUND' });

  for (const key of Object.keys(req.body)) {
    if (key === 'category') {
      const cat = getItemById(req.body.category, dataCategories);
      if (!cat) return res.status(400).json({ message: 'CATEGORY ID NOT FOUND' });
      product.category = cat;
      continue;
    }
    if (Object.prototype.hasOwnProperty.call(product, key) && key !== 'id') {
      product[key] = req.body[key];
    }
    if (key === 'title' && req.body.title) {
      product.slug = slugify(req.body.title, { replacement: '-', lower: true });
    }
  }
  product.updatedAt = new Date().toISOString();
  res.json(product);
}));

router.delete('/:id', asyncHandler(async (req, res) => {
  const id = req.params.id;
  const product = dataProducts.find(p => p.id == id && !p.isDeleted);
  if (!product) return res.status(404).json({ message: 'ID NOT FOUND' });
  product.isDeleted = true;
  product.updatedAt = new Date().toISOString();
  res.json(product);
}));

module.exports = router;

