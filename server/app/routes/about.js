const express = require("express");
const {createAbout, updateAbout, deleteAbout, getAbout} = require("../controllers/about");
const {verifyStudent} = require("../controllers/auth")
const router = express.Router();

router.get("/about",  getAbout);
router.delete("/about", verifyStudent, deleteAbout);
router.put("/about", verifyStudent, updateAbout);
router.post("/about", verifyStudent, createAbout);

module.exports = router;