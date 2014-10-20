app.controller('CheckTableCtrl', function($scope, $stateParams, $state, settings, TableService, AuthService, resolveUser) {
    $scope.data = {};
    $scope.data.user = resolveUser;
    $scope.data.table = {};
    $scope.data.tableId = $stateParams.tableId;

    // 用户登录状态异常控制
    if (!$scope.data.user) {
        alert('用户登录状态异常');
        AuthService.logout().then(function () {
            $state.go('welcome');
        });
    }

    $scope.ifHideSubItems = {};

    TableService.findById($scope.data.tableId).then(function(table) {
        $scope.data.table = table;

        // 标识考核历史记录
        _.each($scope.data.table.items, function (level1) {
            _.each(level1.items, function (level2) {
                level2.pass = level2.fail = level2.uncheck = 0;
                _.each(level2.items, function (level3) {
                    if (level3.status === 'FAIL') {
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

    $scope.toBack = function () {
        $state.go([settings.roles[$scope.data.user.role.name], 'dashboard'].join('.'), {
            userId: $scope.data.user._id
        });
    };
});
