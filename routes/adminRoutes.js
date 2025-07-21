const express = require('express');
const {
  getAllUsers,
  updateUserRole,
  deleteUser,
  getDashboardStats,
  getAllBlogs,
  deleteBlog,
  getAllCategories,
  createCategory,
  updateCategory,
  deleteCategory
} = require('../controllers/adminController');

const { protect, adminOnly } = require('../controllers/authController');
const { toggleUserStatus } = require('../controllers/adminController');

const router = express.Router();

// Admin dashboard stats
router.get('/dashboard/stats', protect, adminOnly, getDashboardStats);

// Get all users with pagination and filters
router.get('/users', protect, adminOnly, getAllUsers);

// Update user role (admin only)
router.put('/users/:id/role', protect, adminOnly, updateUserRole);

// Delete a user (admin only)
router.delete('/users/:id', protect, adminOnly, deleteUser);
router.patch('/users/:id/status', protect, adminOnly, toggleUserStatus);

// Get all blogs with pagination and filters
router.get('/blogs', protect, adminOnly, getAllBlogs);

// Delete a blog (admin only)
router.delete('/blogs/:id', protect, adminOnly, deleteBlog);

// Categories management
router.get('/categories', protect, adminOnly, getAllCategories);
router.post('/categories', protect, adminOnly, createCategory);
router.put('/categories/:id', protect, adminOnly, updateCategory);
router.delete('/categories/:id', protect, adminOnly, deleteCategory);

module.exports = router;
