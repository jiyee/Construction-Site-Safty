app.controller('ManagerTableCtrl', function($scope, $stateParams, $state, TableService) {
    $scope.data = {};
    $scope.data.userId = $stateParams.userId;
    $scope.data.tableId = $stateParams.tableId;

    $scope.shouldHideSubitems = {};

    TableService.findById($scope.data.tableId).then(function(table) {
        $scope.data.table = table;
    });

    $scope.toggle = function(index, item) {
        if ($scope.shouldHideSubitems[item.index] === undefined) {
            $scope.shouldHideSubitems[item.index] = true;
        } else {
            $scope.shouldHideSubitems[item.index] = !$scope.shouldHideSubitems[item.index];
        }
    };

    $scope.review = function(index, item, subItem) {
        $state.go("^.review", {
            userId: $scope.data.userId,
            tableId: $scope.data.tableId,
            itemId: item.index,
            subItemId: subItem.index
        });
    };

    $scope.toBack = function () {
        $state.go('^.dashboard', {
            userId: $scope.data.userId
        });
    };
});
