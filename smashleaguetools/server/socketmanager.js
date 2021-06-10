function socketManagement(io) {
    io.on('connection', (socket) => {
        console.log('user connected');

        socket.on('disconnect', () =>{
            console.log('used disconnected');
        });

        socket.on('send match', (msg) => {
            console.log(msg);
        });
    });
}

module.exports = socketManagement;