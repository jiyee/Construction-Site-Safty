app.controller('SyncCheckCtrl', function($scope, $rootScope, $state, $stateParams, settings, OfflineService, SegmentService, CheckService, TableService, resolveProjects, resolveUser) {
    $scope.data = {};
    $scope.data.user = resolveUser;
    $scope.data.projects = resolveProjects;
    $scope.data.checkId = $stateParams.checkId;
    $scope.data.project = $rootScope.data.project ? $rootScope.data.project : null;

    OfflineService.findById($scope.data.checkId).then(function (check) {
        $scope.data.file = check.file;
        $scope.data.check_date = check.check_date;
        $scope.data.check_target = check.check_target;
        $scope.data.createAt = check.createAt;

        OfflineService.findById(check.table).then(function (table) {
            $scope.data.table = table;
        });
    });

    $scope.$watch('data.project', function() {
        if (!$scope.data.project) return;

        $scope.data.sections = [];
        SegmentService.findByProjectId($scope.data.project._id).then(function (segments) {
            $scope.data.sections = $scope.data.sections.concat(segments);
        });
    });

    $scope.$watch('data.section', function() {
        if (!$scope.data.section) return;

        $scope.data.branches = [];
        SegmentService.findById($scope.data.section._id).then(function (segment) {
            _.each(segment.segments, function (value) {
                if (value.type === '分部') {
                    $scope.data.branches.push(value);
                }
            });
        });
    });

    $scope.remove = function() {
        OfflineService.remove($scope.data.checkId);
        OfflineService.remove($scope.data.table.uuid);
        alert('删除成功');
        $state.go('^.dashboard');
    };

    $scope.sync = function() {
        if (!$scope.data.project) {
            alert('请选择检查项目');
            return;
        }

        if (!$scope.data.section) {
            alert('请选择检查合同段');
            return;
        }

        if (!$scope.data.file) {
            alert('请选择检查表单');
            return;
        }

        if (!$scope.data.check_target) {
            alert('请输入检查对象');
            return;
        }

        CheckService.create({
            file: $scope.data.file,
            project: $scope.data.project._id,
            segment: ($scope.data.place || $scope.data.branch || $scope.data.section)['_id'],
            check_date: $scope.data.check_date,
            check_target: $scope.data.check_target
        }).then(function(check) {
            TableService.findById(check.table).then(function(table) {
                table.items = $scope.data.table.items;
                TableService.update(table._id, table).then(function(table) {
                    alert('同步成功');
                    OfflineService.remove($scope.data.checkId);
                    OfflineService.remove($scope.data.table.uuid);
                    $state.go('^.dashboard');
                }, function (err) {
                    alert(err);
                });
            }, function() {
                alert(err);
            });
        }, function (err) {
            alert(err);
        });
    };
});
