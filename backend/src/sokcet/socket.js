import io from "./app.js";

io.on('connection', (socket) => {
    console.log('Un usuario se ha conectado');
    socket.on('join', (chat) => {
        socket.join(chat);
        console.log('Usuario conectado a: ' + chat);
    });

    socket.on('message', (data) => {
        io.to(data.chatId).emit('mensaje', data);
    })
});