import { Router } from "express";
import {
  createUser,
  loginUser,
  checkTokenUser,
} from "../controllers/users.controller.js";

const router = Router();

router.route("/authenticate").post(loginUser).get(checkTokenUser).post(createUser);
router.route("/authenticate/new").post(createUser);

export default router;
