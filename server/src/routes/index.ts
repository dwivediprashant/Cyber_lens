import { Router } from "express";
import { authSignupController } from "../controllers/authSignupController";
import { authLoginController } from "../controllers/authLoginController";

const router = Router();

router.post("/auth/signup", authSignupController);
router.post("/auth/login", authLoginController);

export default router;
