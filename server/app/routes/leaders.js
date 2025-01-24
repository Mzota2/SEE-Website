const express = require("express");
const {createLeader, updateLeader, deleteLeader, getLeaders} = require("../controllers/leaders");
const {verifyStudent} = require("../controllers/auth")
const router = express.Router();

router.get("/leaders",  getLeaders);
router.delete("/leaders/:id", verifyStudent, deleteLeader);
router.put("/leaders/:id", verifyStudent, updateLeader);
router.post("/leaders", verifyStudent, createLeader);

module.exports = router;