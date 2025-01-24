const express = require("express");
const {createContact, updateContact, deleteContact, getContact} = require("../controllers/contact");
const {verifyStudent} = require("../controllers/auth")
const router = express.Router();

router.get("/contact",  getContact);
router.delete("/contact", verifyStudent, deleteContact);
router.put("/contact", verifyStudent, updateContact);
router.post("/contact", verifyStudent, createContact);

module.exports = router;