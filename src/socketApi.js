const objectAssign = require('object-assign');
const socketio = require('socket.io');
const io = socketio();

const socketApi = {};
socketApi.io = io;

const users = { };

// helpers
const randomColor = require('../helpers/randomColor');

io.on('connection', (socket) => {
    console.log('a user connected');
    
    // kullanıcın giriş yapması 
    socket.on('newUser', (data) => {
        const defaultData = {
            id: socket.id,
            position:  {
                x: 0,
                y: 0
            },
            color: randomColor()
        }
        const userData = objectAssign(data, defaultData); // iki değeri birleştirerek tek nesne olarak bize döndürür.
        users[socket.id] = userData // datayı users nesnesinde id altına pushluyoruz.

        socket.broadcast.emit('newUser', users[socket.id]); // tüm clientlara gösterme
        socket.emit('initPlayers', users); // oyuncu ekleme 
    });

    //  kullanıcının ayrılması ve silinmesi
    socket.on('disconnect', () => {
        socket.broadcast.emit('disUser', users[socket.id]); // tüm clientlarda ayrılma
        delete users[socket.id]; // çıkış yapan kullanıcıyı silme 
    });

    // koordinat bilgisini alıp arka tarafta güncelleme
    socket.on('animate', (data) => {
        users[socket.id].position.x = data.x;
        users[socket.id].position.y = data.y;

        // koordinat bilgisinin tüm clientlara yansıtılması
        socket.broadcast.emit('animate', { 
            socketId: socket.id, 
            x: data.x, 
            y: data.y 
        });
    });

});

module.exports = socketApi;