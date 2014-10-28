app.controller('OfflineDashboardCtrl', function($scope, $rootScope, $state, $stateParams, settings, OfflineService) {
    $scope.data = {};

    OfflineService.list().then(function (list) {
        $scope.data.list = list;
    });

    $scope.toDetail = function (item) {
        if (item._type_ === 'capture') {
            $state.go('^.capture', {
                captureId: item.uuid
            });
        } else if (item._type_ === 'check') {
            $state.go('^.table', {
                tableId: item.table
            });
        } else if (item._type_ === 'evaluation') {
            // $state.go('^.table', {
            //     tableId: item.table
            // });
        }
    };

    $scope.toCapture = function () {
        $state.go('^.capture', {
            captureId: OfflineService.guid()
        });
    };

    $scope.toCheck = function () {
        $state.go('^.check', {
            checkId: OfflineService.guid()
        });
    };

    $scope.toEvaluation = function () {
        $state.go('^.evaluation', {
            evaluationId: OfflineService.guid()
        });
    };


});