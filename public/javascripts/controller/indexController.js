app.controller('indexController', ['$scope', 'indexFactory', ($scope, indexFactory) => {
    const connectionoptions = {
        reconnectionAttempts: 3,
        reconnectionDelay: 600
    };
    
    indexFactory.connectSocket('http://localhost:3000', connectionoptions)
      .then((socket) => {
          console.log('Bağlantı gerçekleşti', socket);
      }).catch((err) => {
          console.log(err);
      });
}]);