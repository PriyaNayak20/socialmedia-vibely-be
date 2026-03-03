const express = require("express");
const router = express.Router();
const authController = require("../controllers/auth");

router.post("/send-otp", authController.sendOtp);
router.post("/verify-otp", authController.verifyOtp);
router.post("/complete-registration", authController.completeRegistration);
router.post("/login", authController.login);

module.exports = router;