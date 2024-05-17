import { Router } from "express";
import { getUserChat, getUserChatByChatId, updateUserChat, notifiactionOff } from "../controllers/userchat.controller.js";

const router = Router();

router.route("/:userid").get(getUserChat);
router.route("/chat/:chatid").get(getUserChatByChatId);
router.route("/").put(updateUserChat);
router.route("/:chatId/:userId").get(notifiactionOff);

export default router;
