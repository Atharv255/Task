const express = require('express');
const router = express.Router();
const Newsletter = require('../models/Newsletter');

// GET all newsletter subscriptions
router.get('/', async (req, res) => {
  try {
    const newsletters = await Newsletter.find().sort({ createdAt: -1 });
    res.json(newsletters);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// POST subscribe to newsletter
router.post('/subscribe', async (req, res) => {
  try {
    const { email } = req.body;

    // Check if email already exists
    const existingSubscription = await Newsletter.findOne({ email });
    if (existingSubscription) {
      return res.status(400).json({ message: 'Email already subscribed' });
    }

    const newsletter = new Newsletter({ email });
    const savedNewsletter = await newsletter.save();
    res.status(201).json(savedNewsletter);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// DELETE unsubscribe from newsletter
router.delete('/:id', async (req, res) => {
  try {
    const newsletter = await Newsletter.findByIdAndDelete(req.params.id);
    if (!newsletter) {
      return res.status(404).json({ message: 'Subscription not found' });
    }
    res.json({ message: 'Unsubscribed successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;

