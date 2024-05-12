import { Router } from "express";
import {
  createUser,
  loginUser,
  checkTokenUser,
  getUser,
  updateUser
} from "../controllers/users.controller.js";

const router = Router();

router.route("/authenticate").post(loginUser).get(checkTokenUser).post(createUser);
router.route("/authenticate/new").post(createUser);
router.route("/:username").get(getUser).put(updateUser);

export default router;
