const express = require("express");
const {createPost, updatePost, deletePost, getPost, getAllPosts} = require("../controllers/posts");
const {verifyStudent} = require("../controllers/auth")
const router = express.Router();

router.get("/posts/:id",  getPost).get("/posts", getAllPosts);
router.delete("/posts/:id", verifyStudent, deletePost);
router.put("/posts/:id", verifyStudent, updatePost);
router.post("/posts", verifyStudent, createPost);

module.exports = router;