app.controller('LoginCtrl', function($scope, $state, $stateParams) {
    $scope.login = function () {
        var roleId = $stateParams.roleId || "builder";
        $state.go(roleId + ".dash");
    };
});