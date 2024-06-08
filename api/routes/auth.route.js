import express from "express";
import { signup, signin, googleSignUp, googleSignIn } from "../controllers/auth.controller.js";

const router = express.Router();

router.post("/signup", signup);
router.post("/signin", signin);
router.post("/google/signin", googleSignIn);
router.post("/google/signup", googleSignUp);

export default router;
