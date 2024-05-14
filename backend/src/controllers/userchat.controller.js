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

export async function getUserChatByChatId(req, res) {
    try {
        const idChat = req.params.chatid;
        const userChats = await UserChat.findAll({
            where: {
                chatId: idChat
            },
            include: [{
                model: Chat
            }, {
                model: User
            }]
        }
        )
        res.status(200).json(userChats);
    } catch (err) {
        res.status(500).json({ err: err.message });
    }
}

export async function updateUserChat(req, res) {
    try {
        const idChat = req.body.id;
        const integrantes = req.body.integrantes;

        //modificar chat
        const chat = await Chat.findOne({
            where: {
                id: idChat
            }
        })

        chat.name = req.body.name;
        await chat.save();

        //eliminar integrantes
        const userChats = await UserChat.findAll({
            where: {
                chatId: idChat
            },
            include: [{
                model: Chat
            }, {
                model: User
            }]
        })
        await destroyUserChat(userChats);

        //agregar integrantes
        await integrantes.forEach(element => {
            UserChat.create({ chatId: idChat, userId: element.id });
        });

        res.status(200).json(userChats);
    } catch (err) {
        res.status(500).json({ err: err.message });
    }
}

async function destroyUserChat(userChats) {
    userChats.forEach((element) => {
        element.destroy();
    });
}