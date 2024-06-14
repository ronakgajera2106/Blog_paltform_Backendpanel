const { Router } = require("express");
const {
  createBlog,
  getAllBlogs,
  getOneBlog,
  updateBlog,
  deleteBlog,
} = require("../../controllers/blogController");
const { isLoggedIn } = require("../../controllers/middleware");

const blogrouter = Router();

blogrouter.post("/createblog", isLoggedIn, createBlog);
blogrouter.get("/allblogs", getAllBlogs);
blogrouter.get("/getoneblog/:id", isLoggedIn, getOneBlog);
blogrouter.post("/updateblog/:id", isLoggedIn, updateBlog);
blogrouter.post("/deleteBlog/:id", isLoggedIn, deleteBlog);

module.exports = blogrouter;
