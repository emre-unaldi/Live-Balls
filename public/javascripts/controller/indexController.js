app.controller('indexController', ['$scope', 'indexFactory', ($scope, indexFactory) => {

    $scope.messages = [ ];
    $scope.players = { };

    $scope.init = () => {
        const username = prompt('Please enter username');
        if (username) {
            initSocket(username);
        } else {
            return false;
        }
    };
    
    function initSocket(username) {
        const connectionoptions = {
            reconnectionAttempts: 3,
            reconnectionDelay: 600
        };
        
        indexFactory.connectSocket('http://localhost:3000', connectionoptions)
          .then((socket) => {
            socket.emit('newUser', { username });

            socket.on('initPlayers', (players) => {
                $scope.players = players;
                $scope.$apply();
            });

            socket.on('newUser', (data) =>{
                const messageData = {
                    type: {
                        code: 0, // sunucu veya kullanıcı mesajı
                        message: 1 // oturum aç veya bağlantıyı kes mesajı
                    },  // info
                    username: data.username
                };
                $scope.messages.push(messageData);
                $scope.$apply();
            });

            socket.on('disUser', (data) => {
                const messageData = {
                    type: {
                        code: 0,
                        message: 0
                    },  // info
                    username: data.username
                };
                $scope.messages.push(messageData);
                $scope.$apply();
                console.log(data);
            });
          }).catch((err) => {
            console.log(err);
          });
    };
    
}]);