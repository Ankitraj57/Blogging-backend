const express = require('express');
const {
  addComment,
  getCommentsByPost,
  deleteComment,
  likeComment,
  unlikeComment
} = require('../controllers/commentController');

const { protect } = require('../controllers/authController');

const router = express.Router();

// Get all comments for a specific blog post
router.get('/:id', getCommentsByPost);

// Add a new comment (authenticated only)
router.post('/', protect, addComment);

// Delete a comment (authenticated + owner or admin)
router.delete('/:id', protect, deleteComment);

// Like a comment (authenticated only)
router.post('/:id/like', protect, likeComment);

// Unlike a comment (authenticated only)
router.delete('/:id/like', protect, unlikeComment);

module.exports = router;
