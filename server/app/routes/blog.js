const express = require("express");
const {createBlog, updateBlog, deleteBlog, getBlog} = require("../controllers/blog");
const {verifyStudent} = require("../controllers/auth")
const router = express.Router();

router.get("/blog",  getBlog);
router.delete("/blog", verifyStudent, deleteBlog);
router.put("/blog", verifyStudent, updateBlog);
router.post("/blog", verifyStudent, createBlog);

module.exports = router;