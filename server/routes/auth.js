const express = require('express');
const {login, register, logout, forgotPassword, verifyAdmin, resendConfirmationMail, verifyStudent, verifyAccessToken, verifyAccount} = require('../controllers/auth');
// const {getSizeController}= require("../middleware/calculateFileSize");
// const { clearSystem } = require('../file/manageFiles');
const router = express.Router();

router.post('/login', login);
router.post('/register', register);
router.post("/logout", verifyStudent, logout);
router.post('/forgot-password', forgotPassword);
router.post('/resend-mail', resendConfirmationMail);
router.get("/verify/:token", verifyAccount);
// router.get('/file-size', verifyAdmin, getSizeController)
// router.get('/clear-sys', verifyAdmin, clearSystem);
module.exports = router;


//router.route('/user/confirm/:token').get(validateAccount);

// router.route('/user/:id').put(updateUser).delete(verifyAccessToken, deleteUser);