const objectAssign = require('object-assign');
const socketio = require('socket.io');
const io = socketio();

const socketApi = {};
socketApi.io = io;

const users = { };

io.on('connection', (socket) => {
    console.log('a user connected');
    
    // kullanıcın giriş yapması 
    socket.on('newUser', (data) => {
        const defaultData = {
            id: socket.id,
            position:  {
                x: 0,
                y: 0
            }
        }

        const userData = objectAssign(data, defaultData); // iki değeri birleştirerek tek nesne olarak bize döndürür.
        users[socket.id] = userData // datayı users nesnesinde id altına pushluyoruz.
        console.log(users);

        socket.broadcast.emit('newUser', users[socket.id]); // tüm clientlara gösterme
        socket.emit('initPlayers', users); // oyuncu ekleme 
    });

    //  kullanıcının ayrılması ve silinmesi
    socket.on('disconnect', () => {
        socket.broadcast.emit('disUser', users[socket.id]); 
        delete users[socket.id];

        console.log(users);
    });
});

module.exports = socketApi;