import { Chat } from "../models/Chat.js";
import { UserChat } from "../models/UserChat.js";
import { User } from "../models/User.js";
import { encrypt, login } from "../config/hash.js";
import { generateToken, checkToken } from "../config/jwt.js";
import { Op } from "sequelize";

export async function createChat(req, res) {
    try {
        const nameChat = req.body.name;
        const integrantes = req.body.integrantes;

        const newChat = await Chat.create({ name: nameChat });

        await integrantes.forEach(element => {
            UserChat.create({ chatId: newChat.id, userId: element.id });
        });
        res.status(200).json(newChat);
    } catch (err) {
        res.status(500).json({ err: err.message });
    }
}
