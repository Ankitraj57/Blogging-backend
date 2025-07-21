# MERN Stack Blogging Platform

A full-featured blogging platform built with the MERN stack (MongoDB, Express.js, React.js, Node.js). Users can create, edit, and manage blog posts. Admins have additional access to manage users and content across the platform.

---

## 🛠 Tech Stack

**Frontend**
- React.js
- Redux Toolkit
- React Router DOM
- React Quill (for rich text editing)
- Tailwind CSS or Custom CSS

**Backend**
- Node.js with Express.js
- MongoDB + Mongoose
- JWT Authentication
- Multer + Cloudinary (image upload and storage)

---

## 🔑 Features

### User
- Sign up and log in with JWT-based authentication
- Create, edit, and delete blog posts
- Upload cover images for blogs (Cloudinary integration)
- Like and comment on blogs
- View blogs by other users
- Search blogs by title or filter by category
- View personal and public profiles

### Admin
- Admin-only login
- View all users, blogs, and comments
- Delete any blog or comment
- Manage content platform-wide

---

## 📂 Folder Structure (Backend)

blogging-backend/
├── controllers/
├── models/
├── routes/
├── middleware/
├── utils/
└── index.js


---

## 🚀 Getting Started (Backend)

### 1. Clone the repository
```bash
git clone https://github.com/Ankitraj57/Blogging-backend.git

2. Install dependencies

cd blogging-backend
npm install

3. Set up environment variables

Create a .env file in the root directory and add the following:

PORT=5000
MONGO_URI=your_mongo_db_connection_string
JWT_SECRET=your_jwt_secret_key
CLOUDINARY_CLOUD_NAME=your_cloudinary_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret

4. Run the server

npm run dev
