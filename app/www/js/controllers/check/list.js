app.controller('CheckListCtrl', function($scope, $rootScope, $state, $stateParams, settings, CheckService, OfflineService, resolveUser) {
    $scope.data = {};
    $scope.data.user = resolveUser;
    $scope.data.checks = [];

    CheckService.findByUserId($scope.data.user._id).then(function(checks) {
        $scope.data.checks = checks;
    });

    OfflineService.list('check').then(function(checks) {
        $scope.data.offlineChecks = checks;
    });

    $scope.toDetail = function(item) {
        $state.go('^.detail', {
            checkId: item._id
        });
    };

    $scope.toCreate = function() {
        $state.go('^.create');
    };

    $scope.toBack = function() {
        $state.go([$scope.data.user.role, 'dashboard'].join('.'), {
            userId: $scope.data.user._id
        });
    };

});
