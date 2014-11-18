app.controller('CaptureListCtrl', function($scope, $rootScope, $state, $stateParams, settings, OfflineService, AuthService, resolveUser) {
    $scope.data = {};
    $scope.data.user = resolveUser;
    $scope.data.captures = [];
    $scope.data.captures_divided_by_segment = {};

    // 用户登录状态异常控制
    if (!$scope.data.user) {
        alert('用户登录状态异常');
        AuthService.logout().then(function() {
            $state.go('welcome');
        });
    }

    OfflineService.list('capture').then(function(captures) {
        $scope.data.captures = captures;

        _.each(captures, function(capture) {
            $scope.data.captures_divided_by_segment[capture.project.name + " " + capture.section.name] = $scope.data.captures_divided_by_segment[capture.project.name + " " + capture.section.name] || [];
            $scope.data.captures_divided_by_segment[capture.project.name + " " + capture.section.name].push(capture);
        });
    });

    $scope.toDetail = function(item) {
        // NOTICE 离线保存的key为uuid
        $state.go('^.detail', {
            captureId: item.uuid
        });
    };

    $scope.toBack = function() {
        $state.go('^.map', {
            userId: $scope.data.user._id
        });
    };
});
