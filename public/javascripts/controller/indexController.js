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
            socket.emit('newUser', { username }); // kullanıcın giriş yapması 

            socket.on('initPlayers', (players) => { // oyuncu ekleme
                $scope.players = players;
                $scope.$apply();
            });

            // kullanıcının giriş yapması 
            socket.on('newUser', (data) =>{
                const messageData = {
                    type: {
                        code: 0, // sunucu veya kullanıcı mesajı
                        message: 1 // oturum aç veya bağlantıyı kes mesajı
                    },  // info
                    username: data.username
                };
                $scope.messages.push(messageData);
                $scope.players[data.id] = data;
                $scope.$apply(); // ekranda gösterme angular
            });

            //  kullanıcının ayrılması ve silinmesi 
            socket.on('disUser', (data) => {
                const messageData = {
                    type: {
                        code: 0,
                        message: 0
                    },  // info
                    username: data.username
                };
                $scope.messages.push(messageData);
                delete $scope.players[data.id];
                $scope.$apply();
            });

            // animasyon kontrolü
            let animate = false;
            $scope.onClickPlayer = ($event) => {
                console.log($event.offsetX, $event.offsetY);

                if(!animate){
                    animate = true;
                    $('#' + socket.id).animate({ 'left': $event.offsetX, 'top': $event.offsetY }, () => {
                        animate = false;
                    });
                }

            };

          }).catch((err) => {
            console.log(err);
          });
    };
    
}]);