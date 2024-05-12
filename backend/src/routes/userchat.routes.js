import { Router } from "express";
import { getUserChat } from "../controllers/userchat.controller.js";

const router = Router();

router.route("/:userid").get(getUserChat);

export default router;
