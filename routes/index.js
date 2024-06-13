const { Router } = require("express");
const router = Router();
const authRoutes = require("./user/Auth");
const blogrouter = require("./blog/blog.route");
const uploadImg = require("./upload/uploadRoutes");

router.use("/user/auth", authRoutes);
router.use("/blog", blogrouter);
router.use("/image", uploadImg);

module.exports = router;
