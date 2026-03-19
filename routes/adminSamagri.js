// Admin Samagri Management Routes
const express = require('express');
const router = express.Router();
const SamagriProduct = require('../models/SamagriProduct');
const SamagriPackage = require('../models/SamagriPackage');
const SamagriOrder = require('../models/SamagriOrder');

// ── Products CRUD ────────────────────────────────────────────────────────────
router.get('/products', async (req, res) => {
  try {
    const products = await SamagriProduct.find().sort({ createdAt: -1 });
    res.json({ success: true, products });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

router.post('/products', async (req, res) => {
  try {
    const product = await SamagriProduct.create(req.body);
    res.status(201).json({ success: true, product });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

router.put('/products/:id', async (req, res) => {
  try {
    const product = await SamagriProduct.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json({ success: true, product });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

router.delete('/products/:id', async (req, res) => {
  try {
    await SamagriProduct.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Product deleted' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// ── Packages CRUD ────────────────────────────────────────────────────────────
router.get('/packages', async (req, res) => {
  try {
    const packages = await SamagriPackage.find()
      .populate('items.product', 'name price image unit')
      .sort({ createdAt: -1 });
    res.json({ success: true, packages });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

router.post('/packages', async (req, res) => {
  try {
    const pkg = await SamagriPackage.create(req.body);
    res.status(201).json({ success: true, package: pkg });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

router.put('/packages/:id', async (req, res) => {
  try {
    const pkg = await SamagriPackage.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json({ success: true, package: pkg });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

router.delete('/packages/:id', async (req, res) => {
  try {
    await SamagriPackage.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Package deleted' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// ── Orders Management ────────────────────────────────────────────────────────
router.get('/orders', async (req, res) => {
  try {
    const { status } = req.query;
    const filter = status ? { status } : {};
    const orders = await SamagriOrder.find(filter)
      .populate('user', 'name contact city')
      .sort({ createdAt: -1 });
    res.json({ success: true, orders });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

router.get('/orders/:id', async (req, res) => {
  try {
    const order = await SamagriOrder.findById(req.params.id)
      .populate('user', 'name contact city');
    if (!order) return res.status(404).json({ success: false, message: 'Order not found' });
    res.json({ success: true, order });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

router.put('/orders/:id/status', async (req, res) => {
  try {
    const { status } = req.body;
    const validStatuses = ['pending', 'confirmed', 'packed', 'shipped', 'delivered', 'cancelled'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid status' });
    }

    const order = await SamagriOrder.findById(req.params.id);
    if (!order) return res.status(404).json({ success: false, message: 'Order not found' });

    order.status = status;
    const now = new Date();
    if (status === 'confirmed') order.trackingInfo.confirmedAt = now;
    else if (status === 'packed') order.trackingInfo.packedAt = now;
    else if (status === 'shipped') order.trackingInfo.shippedAt = now;
    else if (status === 'delivered') order.trackingInfo.deliveredAt = now;
    else if (status === 'cancelled') order.trackingInfo.cancelledAt = now;

    await order.save();
    res.json({ success: true, message: `Order marked as ${status}`, order });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
