const express = require('express');
const blogController = require('../controllers/blogController');
const authController = require('../controllers/authController');

const router = express.Router();

// Public routes
router.get('/', blogController.getAllBlogs);
router.get('/new', authController.protect, blogController.getNewBlogForm);
router.get('/:id', blogController.getBlogById);

// Protected routes
router.post('/', authController.protect, blogController.createBlog);
router.put('/:id', authController.protect, blogController.updateBlog);
router.delete('/:id', authController.protect, blogController.deleteBlog);
router.post('/:id/like', authController.protect, blogController.toggleLike);
router.post('/:id/bookmark', authController.protect, blogController.toggleBookmark);

module.exports = router;
