app.controller('CaptureDetailCtrl', function($scope, $rootScope, $state, $stateParams, settings, CaptureService, OfflineService, UserService, AuthService, resolveUser) {
    $scope.data = {};
    $scope.data.user = resolveUser;
    $scope.data.captureId = $stateParams.captureId;
    $scope.data.isOffline = OfflineService.isOffline($scope.data.captureId) ? true : false;

    // 用户登录状态异常控制
    if (!$scope.data.user) {
        alert('用户登录状态异常');
        AuthService.logout().then(function() {
            $state.go('welcome');
        });
    }

    var AutoService = $scope.data.isOffline ? OfflineService : CaptureService;
    AutoService.findById($scope.data.captureId).then(function(capture) {
        $scope.data.capture = capture;

        if (!$scope.data.isOffline && capture.process.archives.length > 0) {
            _.each(capture.process.archives, function(archive) {
                UserService.findById(archive.user).then(function(user) {
                    archive.user = user;
                });
            });
        }
    });

    $scope.docxgen = function() {
        CaptureService.docxgen($scope.data.captureId).then(function(files) {
            $scope.data.files = files;

            var text = "";
            _.each(files, function(file) {
                text += $rootScope.baseUrl + '/docx/' + $scope.data.captureId + '_' + file + '.docx\n';
            });
        }, function(err) {
            alert(err);
        });
    };

    $scope.toProcess = function() {
        $state.go('^.process', {
            captureId: $scope.data.capture._id
        });
    };

    $scope.toBack = function() {
        $state.go('^.list', {
            userId: $scope.data.user._id
        });
    };

    $scope.remove = function() {
        OfflineService.remove($scope.data.captureId);
        alert('删除成功');
        $scope.toBack();
    };
});
