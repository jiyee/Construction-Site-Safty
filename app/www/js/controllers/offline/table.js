app.controller('OfflineTableCtrl', function($scope, $rootScope, $state, $stateParams, settings, OfflineService) {
    $scope.data = {};
    $scope.data.tableId = $stateParams.tableId;

    $scope.ifHideSubItems = {};

    OfflineService.findById($scope.data.tableId).then(function(table) {
        $scope.data.table = table;

        $scope.data.checked_items = [];
        $scope.data.score = 0;

        // 标识考核历史记录
        _.each($scope.data.table.items, function(level1) {
            _.each(level1.items, function(level2) {
                level2.pass = level2.fail = level2.uncheck = 0;
                _.each(level2.items, function(level3) {
                    if (level3.status === 'FAIL') {
                        level3.full_index = [level1.index, level2.index, level3.index].join('-');
                        $scope.data.checked_items.push(level3);
                        $scope.data.score += parseInt(level3.score, 10);
                        level2.fail += 1;
                    } else if (level3.status === 'PASS') {
                        level2.pass += 1;
                    } else if (level3.status === 'UNCHECK') {
                        level2.uncheck += 1;
                    }
                });
            });
        });
    });

    $scope.toggle = function(index, item) {
        if ($scope.ifHideSubItems[item.index] === undefined) {
            $scope.ifHideSubItems[item.index] = true;
        } else {
            $scope.ifHideSubItems[item.index] = !$scope.ifHideSubItems[item.index];
        }
    };

    $scope.review = function(index, item, subItem) {
        $state.go("^.review", {
            tableId: $scope.data.tableId,
            itemId: item.index,
            subItemId: subItem.index
        });
    };

    $scope.remove = function() {
        OfflineService.remove($scope.data.table.uuid);
        OfflineService.remove($scope.data.table.checkId);
        alert('删除成功');
        $state.go('^.dashboard');
    };

});
