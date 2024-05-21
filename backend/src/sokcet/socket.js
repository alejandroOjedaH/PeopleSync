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
        socket.on('joinVideocall', (videocall) => {
            socket.join(videocall.callId);
            socket.to(videocall.callId).emit('userConnected', videocall.userId);
        });

        socket.on('disconnect', (videocall) => {
            socket.broadcast.to(videocall.roomId).emit('userDisconnected', videocall.userId);
        });
    });
}