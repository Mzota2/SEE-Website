const express = require("express");
const {GetStudent, GetAll, Delete, Update } = require("../controllers/students");
const {verifyStudent} = require("../controllers/auth")
const router = express.Router();

router.get("/students/me", verifyStudent, GetStudent).get("/students", verifyStudent, GetAll);
router.delete("/students/:id", verifyStudent, Delete);
router.put("/students/:id", verifyStudent, Update);

module.exports = router;