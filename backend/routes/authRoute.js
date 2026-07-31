const express = require("express");
const router = express.Router();
const {register,login,refresh,logout} = require("../controllers/AuthController");
const { verifyToken } = require("../middleware/authMiddleware");
const {registerValidation, loginValidation, validate} = require("../validations/authValidation");
const authRateLimit = require("../middleware/authRateLimit");

router.post("/register",authRateLimit,registerValidation,validate,register);
router.post("/login",authRateLimit,loginValidation,validate,login);
router.post("/refresh",refresh);
router.post("/logout",logout);
router.get("/profile",verifyToken,(req,res)=>{
    res.status(200).json({message: "Profile data",user: req.user});
})

module.exports = router;