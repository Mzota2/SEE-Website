const express = require("express");
const {createProgram, updateProgram, deleteProgram, getProgram, getAllPrograms} = require("../controllers/programs");
const {verifyStudent} = require("../controllers/auth")
const router = express.Router();

router.get("/programs/:id",  getProgram).get("/programs", getAllPrograms);
router.delete("/programs/:id", verifyStudent, deleteProgram);
router.put("/programs/:id", verifyStudent, updateProgram);
router.post("/programs", verifyStudent, createProgram);

module.exports = router;