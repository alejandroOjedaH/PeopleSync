import { Router } from "express";
import { createMessage, getMessages } from "../controllers/message.controller.js";

const router = Router();

router.route("/").post(createMessage);
router.route("/:chatid").get(getMessages);

export default router;
