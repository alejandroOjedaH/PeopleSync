import { Router } from "express";
import {
  createUser,
  loginUser,
  checkTokenUser,
  getUser,
  updateUser,
  getUsers
} from "../controllers/users.controller.js";

const router = Router();

router.route("/authenticate").post(loginUser).get(checkTokenUser).post(createUser);
router.route("/authenticate/new").post(createUser);
router.route("/:id").get(getUser).put(updateUser);
router.route("/notequal/:id").get(getUsers);

export default router;
