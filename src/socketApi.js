const objectAssign = require('object-assign');
const socketio = require('socket.io');
const io = socketio();

const socketApi = {};
socketApi.io = io;

const users = [];

io.on('connection', (socket) => {
    console.log('a user connected');

    socket.on('newUser', (data) => {
        const defaultData = {
            id: socket.id,
            position:  {
                x: 0,
                y: 0
            }
        }

        const userData = objectAssign(data, defaultData); // iki değeri birleştirerek tek nesne olarak bize döndürür.
        users.push(userData); // datayı users dizimize pushluyoruz.
    });
});

module.exports = socketApi;