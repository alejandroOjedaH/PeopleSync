import { Router } from "express";
import { getUserChat, getUserChatByChatId, updateUserChat } from "../controllers/userchat.controller.js";

const router = Router();

router.route("/:userid").get(getUserChat);
router.route("/chat/:chatid").get(getUserChatByChatId);
router.route("/").put(updateUserChat);

export default router;
