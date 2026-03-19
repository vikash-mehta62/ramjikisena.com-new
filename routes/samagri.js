// Poojan Samagri Routes (Public + User)
const express = require('express');
const router = express.Router();
const SamagriProduct = require('../models/SamagriProduct');
const SamagriPackage = require('../models/SamagriPackage');
const SamagriOrder = require('../models/SamagriOrder');
const jwt = require('jsonwebtoken');
require('dotenv').config();

// ── Auth Middleware ──────────────────────────────────────────────────────────
function isLoggedInAPI(req, res, next) {
  let token = req.cookies.token;
  if (!token) {
    const auth = req.headers.authorization || req.headers.Authorization;
    if (auth && auth.startsWith('Bearer ')) token = auth.substring(7);
  }
  if (!token) return res.status(401).json({ success: false, message: 'Not authenticated' });

  jwt.verify(token, process.env.JWT_SECRET_KEY, (err, user) => {
    if (err) return res.status(403).json({ success: false, message: 'Invalid token' });
    req.user = user;
    next();
  });
}

// ── PUBLIC: Get all active packages ─────────────────────────────────────────
router.get('/packages', async (req, res) => {
  try {
    const { city, tier, poojaType } = req.query;
    const filter = { isActive: true };
    if (tier) filter.tier = tier;
    if (poojaType) filter.poojaType = new RegExp(poojaType, 'i');
    if (city) filter.$or = [{ availableCities: { $size: 0 } }, { availableCities: city }];

    const packages = await SamagriPackage.find(filter)
      .populate('items.product', 'name image unit')
      .sort({ tier: 1 });

    res.json({ success: true, packages });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// ── PUBLIC: Get single package ───────────────────────────────────────────────
router.get('/packages/:id', async (req, res) => {
  try {
    const pkg = await SamagriPackage.findById(req.params.id)
      .populate('items.product');
    if (!pkg) return res.status(404).json({ success: false, message: 'Package not found' });
    res.json({ success: true, package: pkg });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// ── PUBLIC: Get all active products ─────────────────────────────────────────
router.get('/products', async (req, res) => {
  try {
    const { category } = req.query;
    const filter = { isActive: true, inStock: true };
    if (category) filter.category = category;

    const products = await SamagriProduct.find(filter).sort({ name: 1 });
    res.json({ success: true, products });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// ── USER: Place order ────────────────────────────────────────────────────────
router.post('/orders', isLoggedInAPI, async (req, res) => {
  try {
    const {
      orderType, packageId, items,
      deliveryAddress, poojaDate, poojaType,
      specialInstructions, paymentMethod
    } = req.body;

    if (!deliveryAddress?.name || !deliveryAddress?.phone || !deliveryAddress?.address ||
        !deliveryAddress?.city || !deliveryAddress?.state || !deliveryAddress?.pincode) {
      return res.status(400).json({ success: false, message: 'Complete delivery address is required' });
    }

    let subtotal = 0;
    let orderItems = [];
    let packageRef = null;

    if (orderType === 'package' && packageId) {
      const pkg = await SamagriPackage.findById(packageId).populate('items.product');
      if (!pkg) return res.status(404).json({ success: false, message: 'Package not found' });

      subtotal = pkg.discountedPrice;
      packageRef = pkg._id;
      orderItems = pkg.items.map(i => ({
        product: i.product._id,
        name: i.product.name,
        price: i.product.price,
        quantity: i.quantity,
        image: i.product.image
      }));
    } else {
      // Custom cart
      if (!items || items.length === 0) {
        return res.status(400).json({ success: false, message: 'Cart is empty' });
      }
      for (const item of items) {
        const product = await SamagriProduct.findById(item.productId);
        if (!product || !product.inStock) {
          return res.status(400).json({ success: false, message: `${item.name || 'Product'} is out of stock` });
        }
        subtotal += product.price * item.quantity;
        orderItems.push({
          product: product._id,
          name: product.name,
          price: product.price,
          quantity: item.quantity,
          image: product.image
        });
      }
    }

    const deliveryCharge = subtotal >= 500 ? 0 : 50;
    const totalAmount = subtotal + deliveryCharge;

    const order = await SamagriOrder.create({
      user: req.user._id,
      orderType: orderType || 'custom',
      package: packageRef,
      items: orderItems,
      subtotal,
      deliveryCharge,
      totalAmount,
      deliveryAddress,
      poojaDate: poojaDate ? new Date(poojaDate) : undefined,
      poojaType: poojaType || '',
      specialInstructions: specialInstructions || '',
      payment: { method: paymentMethod || 'cod', status: 'pending' }
    });

    res.status(201).json({ success: true, message: 'Order placed successfully!', order });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// ── USER: My orders ──────────────────────────────────────────────────────────
router.get('/orders/my', isLoggedInAPI, async (req, res) => {
  try {
    const orders = await SamagriOrder.find({ user: req.user._id })
      .sort({ createdAt: -1 });
    res.json({ success: true, orders });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// ── USER: Single order detail ────────────────────────────────────────────────
router.get('/orders/:id', isLoggedInAPI, async (req, res) => {
  try {
    const order = await SamagriOrder.findOne({ _id: req.params.id, user: req.user._id });
    if (!order) return res.status(404).json({ success: false, message: 'Order not found' });
    res.json({ success: true, order });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// ── USER: Cancel order ───────────────────────────────────────────────────────
router.post('/orders/:id/cancel', isLoggedInAPI, async (req, res) => {
  try {
    const order = await SamagriOrder.findOne({ _id: req.params.id, user: req.user._id });
    if (!order) return res.status(404).json({ success: false, message: 'Order not found' });
    if (!['pending', 'confirmed'].includes(order.status)) {
      return res.status(400).json({ success: false, message: 'Order cannot be cancelled at this stage' });
    }

    order.status = 'cancelled';
    order.cancellationReason = req.body.reason || 'Cancelled by user';
    order.trackingInfo.cancelledAt = new Date();
    await order.save();

    res.json({ success: true, message: 'Order cancelled successfully' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
