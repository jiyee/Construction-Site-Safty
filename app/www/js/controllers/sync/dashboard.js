app.controller('SyncDashboardCtrl', function($scope, $rootScope, $state, $stateParams, settings, OfflineService, resolveUser) {
    $scope.data = {};
    $scope.data.user = resolveUser;

    OfflineService.list().then(function(list) {
        $scope.data.list = list;
    });

    $scope.toDetail = function(item) {
        if (item._type_ === 'capture') {
            $state.go('^.capture', {
                captureId: item.uuid
            });
        } else if (item._type_ === 'check') {
            $state.go('^.check', {
                checkId: item.uuid
            });
        } else if (item._type_ === 'evaluation') {
            $state.go('^.evaluation', {
                evaluationId: item.uuid
            });
        }
    };

    $scope.toBack = function() {
        $state.go([$scope.data.user.role, 'dashboard'].join('.'), {
            userId: $scope.data.user._id
        });
    };

});
