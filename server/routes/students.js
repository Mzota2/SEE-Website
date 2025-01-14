const express = require("express");
const { Register, GetStudent, GetAll, Delete, Update } = require("../controllers/students");
const router = express.Router();

router.post('/students', Register);
router.get("/students/:id", GetStudent).get("/students", GetAll);
router.delete("/students/:id", Delete);
router.patch("/students/:id",Update);

module.exports = router;