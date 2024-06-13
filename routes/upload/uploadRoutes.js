const { Router } = require("express");
const { uploadImage } = require("../../controllers/uploadController");

const uploadImg = Router();

uploadImg.post("/upload", uploadImage);

module.exports = uploadImg;
