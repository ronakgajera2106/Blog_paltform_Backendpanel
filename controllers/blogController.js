const User = require("../models/User.model");
const blogModel = require("../models/blog.model");

const createBlog = async (req, res) => {
  try {
    const { title, description, tag, author, state, body } = req.body;
    const user_id = req.user_id;
    console.log(user_id, "USERIDDDDD");

    if (!user_id) {
      return res.status(400).json({ error: "User ID not found in request." });
    }

    const existingBlog = await blogModel.findOne({
      title: title,
      description: description,
      tag: tag,
      author: author,
      state: state,
      user_id: user_id,
      body: body,
    });

    if (existingBlog) {
      return res.status(400).json({
        error: "Blog with the same details already exists.",
        existingBlog,
      });
    }
    const blog = await blogModel.create({
      title: title,
      description: description,
      tag: tag,
      author: author,
      state: state,
      user_id: user_id,
      body: body,
      timestamp: new Date(),
      read_count: 0,
      reading_time: calculateReadingTime(body),
    });

    res.status(200).json({ message: "Your blog has been created !!", blog });
  } catch (error) {
    res
      .status(500)
      .json({ error: "An error occurred while creating the blog." });
  }
};

const calculateReadingTime = (text) => {
  const wordsPerMinute = 200; // Average reading speed
  const words = text.split(/\s+/).length;
  const readingTime = Math.ceil(words / wordsPerMinute);
  return readingTime;
};

const getAllBlogs = async (req, res) => {
  try {
    // const user_id = req.user_id;
    // console.log(user_id, "USERIDDDD");

    // Get page and limit from query string
    let page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20; // Set default limit

    // const totalBlogs = await blogModel.countDocuments({ user_id });
    const totalBlogs = await blogModel.countDocuments({});

    const totalPages = Math.ceil(totalBlogs / limit);

    if (page < 1) {
      page = 1;
    } else if (page > totalPages) {
      page = totalPages;
    }

    // Calculation of skip value
    const skip = (page - 1) * limit;

    // Fetch blogs based on pagination parameters
    // const blogs = await blogModel.find({ user_id }).skip(skip).limit(limit);
    const blogs = await blogModel.find({}).skip(skip).limit(limit);

    for (let i = 0; i < blogs.length; i++) {
      const blog = blogs[i];
      blog.read_count = parseInt(blog.read_count) + 1;
      await blog.save();

      // Checking if the blog is published and has a publishedAt date
      if (blog.state === "published" && blog.publishedAt) {
        blog.publishedAt = blog.publishedAt.toDateString(); // Format the date as needed
      } else {
        blog.publishedAt = "Not published yet";
      }
    }

    res.json({
      // user_id: user_id,
      totalPages: totalPages,
      page: page,
      totalBlogs: totalBlogs,
      limit: limit,
      blogs: blogs,
      date: new Date(),
    });
  } catch (error) {
    console.log(error);
    res.status(400).json({ error: "An error occurred while fetching blogs." });
  }
};

const getOneBlog = async (req, res) => {
  try {
    const blogId = req.params.id;
    console.log(blogId, "blogiddd");
    const blog = await blogModel.findOne({ _id: blogId });
    console.log("test=>", blog);

    if (!blog) {
      return res.status(404).json({ message: "Blog not found" });
    }

    blog.read_count = parseInt(blog.read_count) + 1;
    await blog.save();

    // Check if the blog is published and has a publishedAt date
    let publishedDate = "Not published yet";
    if (blog.state === "published" && blog.publishedAt) {
      publishedDate = blog.publishedAt.toDateString(); // Format the date as needed
    }

    // Fetch the user information
    const user_id = blog.user_id;
    console.log(user_id, "<++++++++++++++");
    const user = await User.findById(user_id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({
      user_id: user_id,

      blog: blog,
      publishedDate: publishedDate,
      date: new Date(),
    });
  } catch (error) {
    console.log(error, "ERROR");
    return res.status(500).json({ message: "Internal server error" });
  }
};

const updateBlog = async (req, res) => {
  try {
    const blogId = req.params.id;
    console.log(blogId, "blogiddd");

    const existingBlogPost = await blogModel.findById({ _id: blogId });
    console.log("test=>", existingBlogPost);

    if (!existingBlogPost) {
      return res.status(404).json({ message: "Blog not found" });
    }

    existingBlogPost.title = req.body.title || existingBlogPost.title;
    existingBlogPost.description =
      req.body.description || existingBlogPost.description;
    existingBlogPost.tag = req.body.tag || existingBlogPost.tag;
    existingBlogPost.author = req.body.author || existingBlogPost.author;
    existingBlogPost.state = req.body.state || existingBlogPost.state;

    if (req.body.state === "published" && !existingBlogPost.publishedAt) {
      // Set the publishedAt date if the state is changed to 'published'
      existingBlogPost.publishedAt = new Date();
    }

    const updatedBlogPost = await existingBlogPost.save();

    res.status(302).json({ updateBlog: updatedBlogPost });
  } catch (error) {
    console.log(error, "ERRORRRR");
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const deleteBlog = async (req, res) => {
  try {
    const blogId = req.params.id;
    console.log(blogId, "BLOGIDD");

    const deletedBlogPost = await blogModel.findByIdAndDelete({ _id: blogId });

    if (!deletedBlogPost) {
      return res.status(404).json({ message: "blog not found" });
    }

    res.status(302).json({
      message: "Blog deleted successfully",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

module.exports = {
  createBlog,
  getAllBlogs,
  getOneBlog,
  updateBlog,
  deleteBlog,
};
