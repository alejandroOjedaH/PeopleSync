export function configSocket(io) {
    io.on('connection', (socket) => {
        //Chat
        socket.on('join', (chat) => {
            socket.join(chat);
            console.log('Usuario conectado a: ' + chat);
        });

        socket.on('leave', (room) => {
            socket.leave(room);
            console.log(`Usuario dejó la sala: ${room}`);
        });

        //Videollamada
        socket.on('offer', (data) => {
            socket.broadcast.emit('offer', data);
        });

        socket.on('answer', (data) => {
            socket.broadcast.emit('answer', data);
        });

        socket.on('candidate', (data) => {
            socket.broadcast.emit('candidate', data);
        });

        socket.on('disconnect', () => {
            console.log('Cliente desconectado');
        });

        //Añadir un join call que emita un userConnected que recarge el componente

        //Añadir un disconect que quite al otro usuario de la llamada
    });
}