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
    
    // sohbet kısmı kaydırma işlemi
    function scrollTop() {
        setTimeout(() => {
            const element = document.getElementById('chat-area');
            element.scrollTop = element.scrollHeight;   
        });
    };

    function showBubble(id, message){
        $('#' + id).find('.message').show().html(message);

        setTimeout(() => {
            $('#' + id).find('.message').hide();
        }, 3000);
    };

    
    async  function initSocket(username) {
        const connectionoptions = {
            reconnectionAttempts: 3,
            reconnectionDelay: 600
        };
    
        try {
            const socket = await indexFactory.connectSocket('http://localhost:3000', connectionoptions);
            socket.emit('newUser', { username }); // kullanıcın giriş yapması 

            socket.on('initPlayers', (players) => { // oyuncu ekleme
                $scope.players = players;
                $scope.$apply(); // ekranda gösterme angular
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
                scrollTop();
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
                delete $scope.players[data.id]; // çıkış yapan kullanıcının animasyonunu silme 
                scrollTop();
                $scope.$apply(); // ekranda gösterme angular
            });


            socket.on('animate', (data) => {
                console.log(data);
                $('#' + data.socketId).animate({ 'left': data.x, 'top': data.y }, () => {
                    animate = false;
                });
            });

            socket.on('newMessage', (message) => {
                $scope.messages.push(message);
                $scope.$apply(); // anguların gelen datayı ön tarafta build eder
                showBubble(message.socketId, message.text);
                scrollTop();
            });

            // animasyon kontrolü
            let animate = false;
            $scope.onClickPlayer = ($event) => {
                if(!animate){
                    let x = $event.offsetX;
                    let y = $event.offsetY;

                    // koordinat bilgisini alıp arka tarafta güncelleme
                    socket.emit('animate', { x, y });

                    animate = true;
                    $('#' + socket.id).animate({ 'left': x, 'top': y }, () => {
                        animate = false;
                    });
                }
            };

            $scope.newMessage = () => {
                let message = $scope.message;
                const messageData = {
                    type: {
                        code: 1 // sunucu veya kullanıcı mesajı
                    }, 
                    username: username,
                    text: message
                };
                $scope.messages.push(messageData);
                $scope.message = '';

                socket.emit('newMessage', messageData );
                showBubble(socket.id, message);
                scrollTop();
            };
        }catch (err) {
            console.log(err);
        }
    };
}]);