app.controller('OfflineCheckCtrl', function($scope, $rootScope, $state, $stateParams, settings, files, OfflineService) {
    $scope.data = {};
    $scope.data.files = files;
    $scope.data.checkId = $stateParams.checkId;

    $scope.newCheck = function () {
        if (!$scope.data.file) {
            alert('请选择检查用表');
            return;
        }

        if (!$scope.data.check_target) {
            alert('请填写检查对象');
            return;
        }

        OfflineService.newCheck({
            checkId: $scope.data.checkId,
            file: $scope.data.file,
            check_target: $scope.data.check_target
        }).then(function(check) {
            console.log(check);
            $state.go('^.table', {
                tableId: check.table
            });
        }, function (err) {
            alert(err);
        });
    };

});