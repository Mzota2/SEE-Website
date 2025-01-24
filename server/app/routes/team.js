const express = require("express");
const {createTeam, updateTeam, deleteTeam, getTeam} = require("../controllers/team");
const {verifyStudent} = require("../controllers/auth")
const router = express.Router();

router.get("/team",  getTeam);
router.delete("/team", verifyStudent, deleteTeam);
router.put("/team", verifyStudent, updateTeam);
router.post("/team", verifyStudent, createTeam);

module.exports = router;