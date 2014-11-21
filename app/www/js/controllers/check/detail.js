app.controller('CheckDetailCtrl', function($scope, $rootScope, $state, $stateParams, $ionicPopup, settings, OfflineService, CheckService, AuthService, resolveUser) {
    $scope.data = {};
    $scope.data.check = {};
    $scope.data.user = resolveUser;
    $scope.data.checkId = $stateParams.checkId;
    $scope.data.isOffline = OfflineService.isOffline($scope.data.checkId) ? true : false;

    var AutoService = $scope.data.isOffline ? OfflineService : CheckService;
    AutoService.findById($scope.data.checkId).then(function(check) {
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

    $scope.remove = function() {
        OfflineService.remove($scope.data.checkId);
        OfflineService.remove($scope.data.table._id);
        alert('删除成功');
        $scope.toBack();
    };

    $scope.save = function() {
        if ($scope.data.isOffline) {
            var check = {};
            check.project = $scope.data.check.project._id;
            check.section = $scope.data.check.section._id;
            check.branch = $scope.data.check.branch._id;
            check.user = $scope.data.check.user._id;
            check.file = $scope.data.check.file;
            check.object = $scope.data.check.object;
            check.table = _.omit($scope.data.check.table, ['_id', 'uuid', '_type_']);

            // 真正创建在线数据
            CheckService.create(check).then(function(check) {
                alert('保存成功');

                // 清空本地数据
                OfflineService.remove($scope.data.check._id);
                OfflineService.remove($scope.data.table._id);
                $scope.toBack();
            }, function(err) {
                alert('保存失败');
            });
        } else {
            // 实际修改在线数据
            CheckService.update($scope.data.checkId, $scope.data.check).then(function(check) {
                alert('保存成功');
                $scope.toBack();
            }, function(err) {
                alert('保存失败');
            });
        }
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