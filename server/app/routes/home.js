const express = require("express");
const {createHome, updateHome, deleteHome, getHomes} = require("../controllers/home");
const {verifyStudent} = require("../controllers/auth")
const router = express.Router();

router.get("/homes",  getHomes);
router.delete("/homes/:id", verifyStudent, deleteHome);
router.put("/homes/:id", verifyStudent, updateHome);
router.post("/homes", verifyStudent, createHome);

module.exports = router;