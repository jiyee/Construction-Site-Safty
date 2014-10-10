app.controller('BuilderDashCtrl', function($scope, $state, userData, BasicMgrService) {
    console.log(userData);
    // BasicMgr.getReview("unit_1", "2014-08", "1").then(function(data) {
    // console.log(data);
    // });

    // BasicMgr.getRect("unit_1", "2014-08", "1").then(function(data) {
    //     console.log(data);
    // }, function(err){
    //     console.log(err);
    // });

    function getPaddedNumber(number) {
        if (number < 10)
            return "0" + number;
        else
            return number;
    }

    var unitId = "unit_1";
    var date = new Date();
    var currentDate = date.getFullYear() + "-" + getPaddedNumber(date.getMonth() + 1);

    $scope.toReview = function() {
        var reviewId = [unitId, currentDate, "1"].join("_");

        $state.go("review", {
            reviewId: reviewId
        });
    };

    $scope.toScore = function() {
        var reviewId = [unitId, currentDate, "1"].join("_");

        $state.go("score", {
            reviewId: reviewId
        });
    };

    $scope.toReport = function() {
        var reviewId = [unitId, currentDate, "1"].join("_");

        $state.go("report", {
            reviewId: reviewId
        });
    };
});