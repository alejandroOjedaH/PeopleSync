import { Chat } from "../models/Chat.js";
import { UserChat } from "../models/UserChat.js";
import { User } from "../models/User.js";
import { encrypt, login } from "../config/hash.js";
import { generateToken, checkToken } from "../config/jwt.js";
import { Op } from "sequelize";

export async function getUserChat(req, res) {
    try {
        const idUser = req.params.userid;

        const userChats = await UserChat.findAll({
            where: {
                userId: idUser
            },
            include: [{
                model: Chat,
                include: [{
                    model: UserChat,
                    include: [{
                        model: User
                    }]
                }]
            }]
        }
        )
        res.status(200).json(userChats);
    } catch (err) {
        res.status(500).json({ err: err.message });
    }
}
