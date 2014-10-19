app.controller('ContactCtrl', function($scope, $stateParams, UserService) {
    var userId = $stateParams.userId;

    UserService.findById(userId).then(function(user) {
        $scope.name = user.name;
        $scope.tel = user.tel;
        $scope.mobile = user.mobile;
    });

});
