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
        socket.on('joinVideocall', (data) => {
            socket.join(data.callId);
            console.log('Usuario conectado a: ' + data.callId);
        });

        socket.on('leaveVideocall', (data) => {
            socket.leave(data.callId);
            socket.to(data.callId).emit('userDisconnected');
        });

        //Añadir un disconect que quite al otro usuario de la llamada

        socket.on('offer', (data) => {
            socket.to(data.callId).emit('offer', data);
        });

        socket.on('answer', (data) => {
            socket.to(data.callId).emit('answer', data);
        });

        socket.on('candidate', (data) => {
            socket.to(data.callId).emit('candidate', data);
        });

    });
}