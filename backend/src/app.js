import express from "express";
import cors from "cors";
import { front } from "./config/config.js";
import { checkCredentials } from "./config/jwt.js";
import { Server } from "socket.io";
import { createServer } from "http";
import { configSocket } from './sokcet/socket.js';

import usersRoutes from "./routes/users.routes.js";
import chatRoutes from "./routes/chat.routes.js";
import messageRoutes from "./routes/message.routes.js";
import userChatRoutes from "./routes/userchat.routes.js";

const app = express();
// Crear sockets
const htmlServer = createServer(app);
export const io = new Server(htmlServer, {
    cors: {
        origin: front,
        methods: ["GET", "POST"]
    }
});

configSocket(io);

//middlewares
app.use(cors({ origin: front }));
app.use(express.json());
app.use("/", checkCredentials);

app.use("/api/users", usersRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/message", messageRoutes);
app.use("/api/userchat", userChatRoutes);

export default htmlServer;
