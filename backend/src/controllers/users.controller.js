import { User } from "../models/User.js";
import { encrypt, login } from "../config/hash.js";
import { generateToken, checkToken } from "../config/jwt.js";
import { Op } from "sequelize";

export async function createUser(req, res) {
  const { username, email, password } = req.body;

  try {
    const hashPassword = await encrypt(password);
    const newUser = await User.create({
      username: username,
      email: email,
      password: hashPassword,
    });
    res.status(200).json(newUser);
  } catch (err) {
    res.status(500).json({ err: err.message });
  }
}

export async function loginUser(req, res) {
  const { username, password } = req.body;

  try {
    const user = await User.findOne({
      where: { username: username },
    });
    const isLoged = await login(username, password, user.password);
    if (isLoged) {
      const token = generateToken(user);
      res.status(200).json({ token: token, id: user.id });
    } else {
      res.status(401).json({ isLoged });
    }
  } catch (err) {
    res.status(500).json({ err: err.message });
  }
}

export async function checkTokenUser(req, res) {
  try {
    let token = req.headers.authorization;
    token = token.split(" ")[1];
    if (checkToken(token)) {
      res.status(200).json(true);
    } else {
      res.status(200).json(false);
    }
  } catch (err) {
    res.status(500).json({ err: err.message });
  }
}

export async function getUser(req, res) {
  try {
    let user = await User.findOne({
      where: { id: req.params.id }
    })
    res.status(200).json(user);
  } catch (err) {
    res.status(500).json({ err: err.message });
  }
}

export async function updateUser(req, res) {
  try {
    let user = await User.findOne({
      where: { id: req.params.id }
    })
    console.log(req.body.password);

    if (req.body.password) {
      req.body.password = await encrypt(req.body.password);
    }
    await user.update(req.body);
    res.status(200).json(user);
  } catch (err) {
    res.status(500).json({ err: err.message });
  }
}

export async function getUsers(req, res) {
  try {
    let user = await User.findAll({
      where: {
        id: { [Op.ne]: req.params.id }
      }
    });
    res.status(200).json(user);
  } catch (err) {
    res.status(500).json({ err: err.message });
  }
}