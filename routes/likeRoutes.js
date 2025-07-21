const express = require('express');
const {
  toggleLike,
  getLikeCount,
  hasUserLiked,
} = require('../controllers/likeController');

const { protect } = require('../controllers/authController');

const router = express.Router();

// Toggle like/unlike (requires login)
router.post('/', protect, toggleLike);

// Get total like count for a blog (public)
router.get('/count/:postId', getLikeCount);

// Check if the current user liked a post (requires login)
router.get('/status/:postId', protect, hasUserLiked);

module.exports = router;
