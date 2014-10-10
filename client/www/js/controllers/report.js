app.controller('ReportCtrl', function($scope, $stateParams, $state, BasicMgrService) {
    BasicMgrService.getReview("unit_1", "2014-09", "1").then(function(data) {
        $scope.data = data;
    });

    BasicMgrService.getScore("unit_1", "2014-09", "1").then(function (data) {
        $scope.data.basicMgr = data;
        console.log($scope.data);
    });

    BasicMgrService.getRect("unit_1", "2014-09", "1").then(function (data) {
        $scope.data.rects = data;
        console.log($scope.data);
    });

    $scope.report = function () {
        alert("报送成功！");

        $state.go("builder.dash", {
        });
    };
});

app.filter('level', function() {
    return function(input) {
        input = parseFloat(input);

        if (input > 70) {
            return '达标';
        } else {
            return '不达标';
        }
    };
});
