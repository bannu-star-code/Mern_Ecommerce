import express from "express";
import { signup, login, logout, l } from "../controllers/auth.controller.js"
import { protectRoute } from "../middleware/auth.middleware.js";
const router = express.Router();

router.post("/signup", signup);

router.post("/login", login);

router.post("/logout", logout);


// I have to write the refresh token code
// router.post("/refresh-token", refreshToken)

// router.get("/profile",getProfie)

router.get("/l", l);



export default router;