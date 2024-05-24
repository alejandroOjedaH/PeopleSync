import { Router } from "express";
import {
  createUser,
  loginUser,
  checkTokenUser,
  getUser,
  updateUser,
  getUsers,
  getAllUsers
} from "../controllers/users.controller.js";

const router = Router();

router.route("/authenticate").post(loginUser).get(checkTokenUser);
router.route("/authenticate/new").post(createUser);
router.route("/:id").get(getUser).put(updateUser);
router.route("/notequal/:id").get(getUsers);
router.route("/").get(getAllUsers);

export default router;
