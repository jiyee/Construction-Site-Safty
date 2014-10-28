app.controller('CaptureListCtrl', function($scope, $rootScope, $state, $stateParams, settings, ProjectService, UserService, UnitService, CaptureService, AuthService, resolveUser) {
    $scope.data = {};
    $scope.data.user = resolveUser;
    $scope.data.captures = [];

    CaptureService.findByUserId($scope.data.user._id).then(function(captures) {
        $scope.data.captures = captures;
    });

    $scope.toDetail = function(item) {
        $state.go('^.detail', {
            captureId: item._id
        });
    };

    $scope.toBack = function() {
        $state.go([settings.roles[$scope.data.user.role.name], 'dashboard'].join('.'), {
            userId: $scope.data.user._id
        });
    };
});
