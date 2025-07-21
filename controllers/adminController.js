const User = require('../models/User');
const Blog = require('../models/Blog');
const Comment = require('../models/Comment');
const Category = require('../models/Category');

// Toggle user status
exports.toggleUserStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { isActive } = req.body;

    // Find user and update status
    const user = await User.findByIdAndUpdate(
      id,
      { isActive },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    res.json({ success: true, data: user });
  } catch (error) {
    console.error('Error toggling user status:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// Get admin dashboard statistics
exports.getDashboardStats = async (req, res) => {
  try {
    // Get all statistics in parallel
    const [userCount, blogCount, commentCount, categoryCount, userStats, blogStats] = await Promise.all([
      User.countDocuments(),
      Blog.countDocuments(),
      Comment.countDocuments(),
      Category.countDocuments(),
      User.aggregate([
        { $match: { role: 'user' } },
        { $group: { 
          _id: null,
          totalUsers: { $sum: 1 },
          activeUsers: { $sum: { $cond: [{ $eq: ['$isActive', true] }, 1, 0] } }
        } }
      ]),
      Blog.aggregate([
        { $group: { 
          _id: null,
          totalBlogs: { $sum: 1 },
          totalComments: { $sum: { $size: '$comments' } }
        } }
      ])
    ]);

    res.json({
      success: true,
      data: {
        users: userCount,
        blogs: blogCount,
        comments: commentCount,
        categories: categoryCount,
        userStats: userStats[0] || { totalUsers: 0, activeUsers: 0 },
        blogStats: blogStats[0] || { totalBlogs: 0, totalComments: 0 }
      }
    });
  } catch (err) {
    console.error('Error fetching dashboard stats:', err);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch dashboard stats',
      message: err.message
    });
  }
};

// Get all users with pagination
exports.getAllUsers = async (req, res) => {
  try {
    const { page = 1, limit = 10, search, role, status } = req.query;
    const skip = (page - 1) * limit;
    const query = {};

    if (search) {
      query.$or = [
        { username: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ];
    }

    if (role) {
      query.role = role;
    }

    if (status !== undefined) {
      query.isActive = status === 'true';
    }

    const [users, total] = await Promise.all([
      User.find(query)
        .select('-password')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
      User.countDocuments(query)
    ]);

    res.json({
      success: true,
      data: {
        users,
        totalPages: Math.ceil(total / limit),
        currentPage: page,
        totalUsers: total
      }
    });
  } catch (err) {
    console.error('Error fetching users:', err);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch users',
      message: err.message
    });
  }
};

// Update user role (admin only)
exports.updateUserRole = async (req, res) => {
  const { userId, role } = req.body;
  if (!['user', 'admin'].includes(role)) {
    return res.status(400).json({ error: 'Invalid role' });
  }

  try {
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ error: 'User not found' });

    user.role = role;
    await user.save();

    res.json({ message: 'User role updated', user });
  } catch (err) {
    res.status(500).json({ error: 'Failed to update user role' });
  }
};

// Delete a user (admin only)
exports.deleteUser = async (req, res) => {
  try {
    const userId = req.params.id;
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found',
        message: 'User with the specified ID does not exist'
      });
    }

    // Delete associated content
    await Promise.all([
      Blog.deleteMany({ author: userId }),
      Comment.deleteMany({ author: userId })
    ]);

    await user.deleteOne();

    res.json({
      success: true,
      message: 'User and associated content deleted successfully'
    });
  } catch (err) {
    console.error('Error deleting user:', err);
    res.status(500).json({
      success: false,
      error: 'Failed to delete user',
      message: err.message
    });
  }
};

// Get all blogs with pagination
exports.getAllBlogs = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const skip = (page - 1) * limit;

    const [blogs, total] = await Promise.all([
      Blog.find()
        .populate('author', 'name email')
        .populate('category', 'name')
        .skip(skip)
        .limit(limit),
      Blog.countDocuments()
    ]);

    res.json({
      blogs,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      totalBlogs: total
    });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch blogs' });
  }
};

// Delete a blog (admin only)
exports.deleteBlog = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) return res.status(404).json({ error: 'Blog not found' });

    // Delete associated comments
    await Comment.deleteMany({ blog: blog._id });

    await blog.deleteOne();
    res.json({ message: 'Blog and associated comments deleted' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete blog' });
  }
};

// Get all categories
exports.getAllCategories = async (req, res) => {
  try {
    const categories = await Category.find().sort({ name: 1 });
    res.json(categories);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch categories' });
  }
};

// Create a new category
exports.createCategory = async (req, res) => {
  try {
    const category = new Category(req.body);
    await category.save();
    res.status(201).json(category);
  } catch (err) {
    res.status(400).json({ error: 'Failed to create category' });
  }
};

// Update a category
exports.updateCategory = async (req, res) => {
  try {
    const category = await Category.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!category) return res.status(404).json({ error: 'Category not found' });
    res.json(category);
  } catch (err) {
    res.status(400).json({ error: 'Failed to update category' });
  }
};

// Delete a category
exports.deleteCategory = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) return res.status(404).json({ error: 'Category not found' });

    // Update blogs to remove this category
    await Blog.updateMany(
      { category: category._id },
      { $unset: { category: 1 } }
    );

    await category.deleteOne();
    res.json({ message: 'Category deleted' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete category' });
  }
};
