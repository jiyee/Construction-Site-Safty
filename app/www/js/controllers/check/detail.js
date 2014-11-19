app.controller('CheckDetailCtrl', function($scope, $rootScope, $state, $stateParams, $ionicPopup, settings,  OfflineService, AuthService, resolveUser) {
    $scope.data = {};
    $scope.data.check = {};
    $scope.data.user = resolveUser;
    $scope.data.checkId = $stateParams.checkId;

    if (OfflineService.isOffline($scope.data.checkId)) {
        $scope.data.isOffline = true;
        OfflineService.findById($scope.data.checkId).then(function(check) {
            $scope.data.check = check;
            $scope.data.checked_items = [];
            if ($scope.data.check.table) {
                _.each($scope.data.check.table.items, function(level1) {
                    _.each(level1.items, function(level2) {
                        _.each(level2.items, function(level3) {
                            if (level3.status != 'UNCHECK' && level3.score > 0) {
                                level3.full_index = [level1.index, level2.index, level3.index].join('-');
                                $scope.data.checked_items.push(level3);
                            }
                        });
                    });
                });
            }
        });
    }

    $scope.remove = function() {
        OfflineService.remove($scope.data.checkId);
        alert('删除成功');
        $scope.toBack();
    };

    $scope.toTable = function() {
        $state.go('^.table', {
            tableId: $scope.data.check.table._id
        });
    };

    $scope.toBack = function() {
        $state.go('^.list');
    };

});