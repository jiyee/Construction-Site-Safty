app.controller('OfflineCheckCtrl', function($scope, $rootScope, $state, $stateParams, settings, files, OfflineService) {
    $scope.data = {};
    $scope.data.files = files;
    $scope.data.checkId = $stateParams.checkId;

    $scope.newCheck = function () {
        if (!$scope.data.file) {
            alert('请选择检查用表');
            return;
        }

        if (!$scope.data.target) {
            alert('请填写检查对象');
            return;
        }

        OfflineService.newCheck({
            checkId: $scope.data.checkId,
            file: $scope.data.file,
            target: $scope.data.target
        }).then(function(check) {
            $state.go('^.table', {
                tableId: check.table
            });
        }, function (err) {
            alert(err);
        });
    };

});