const express = require('express');
const { chat } = require('../controllers/aiController');
const protect = require('../middleware/auth');
const aiRateLimit = require('../middleware/aiRateLimit');

const router = express.Router();

router.post('/chat', protect, aiRateLimit, chat);

module.exports = router;