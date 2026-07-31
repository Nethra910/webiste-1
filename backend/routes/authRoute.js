const express = require("express");
const router = express.Router();
const {register,login,refresh,logout} = require("../controllers/AuthController");
const { verifyToken } = require("../middleware/authMiddleware");
const {registerValidation, loginValidation, validate} = require("../validations/authValidation");
const rateLimit = require("../middleware/authRateLimit");

router.post("/register",rateLimit,registerValidation,validate,register);
router.post("/login",rateLimit,loginValidation,validate,login);
router.post("/refresh",rateLimit,refresh);
router.post("/logout",rateLimit,logout);
router.get("/profile",verifyToken,(req,res)=>{
    res.status(200).json({message: "Profile data",user: req.user});
})

module.exports = router;