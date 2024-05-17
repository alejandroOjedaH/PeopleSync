import { Message } from "../models/Message.js";
import { User } from "../models/User.js";
import { UserChat } from "../models/UserChat.js";
import { io } from "../app.js";

export async function createMessage(req, res) {
    try {
        let newMessage = await Message.create(req.body);
        newMessage = await newMessage.reload({ include: [{ model: User }] });

        //Send to client
        io.to(newMessage.chatId).emit('message', newMessage);

        //Notice notification
        const usersChat = await UserChat.findAll({ where: { chatId: newMessage.chatId } });

        await usersChat.forEach(element => {
            element.isNewMessage = true;
            saveNotification(element);
        });
        io.to("lobby").emit('isMessage', newMessage.chatId);

        res.status(200).json(newMessage);
    } catch (err) {
        res.status(500).json({ err: err.message });
    }
}

async function saveNotification(element) {
    await element.save();
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