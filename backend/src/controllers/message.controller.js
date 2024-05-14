import { Message } from "../models/Message.js";
import { User } from "../models/User.js";

export async function createMessage(req, res) {
    try {
        let newMessage = await Message.create(req.body);
        res.status(200).json(newMessage);
    } catch (err) {
        res.status(500).json({ err: err.message });
    }
}

export async function getMessages(req, res) {
    try {
        let messages = await Message.findAll({
            where: { chatId: req.params.chatid },
            include: [{ model: User }],
            order: [["createdAt", "ASC"]],
        });
        res.status(200).json(messages);
    } catch (err) {
        res.status(500).json({ err: err.message });
    }
}