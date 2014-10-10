app.controller('ReviewCtrl', function($scope, $stateParams, $state, BasicMgrService) {
    console.log($stateParams.reviewId);

    $scope.shouldHideSubitems = {};

    BasicMgrService.getReview("unit_1", "2014-09", "1").then(function(data) {
        console.log(data);
        $scope.data = data;
    });

    $scope.toggle = function(index, item) {
        if ($scope.shouldHideSubitems[item.index] === undefined) {
            $scope.shouldHideSubitems[item.index] = true;
        } else {
            $scope.shouldHideSubitems[item.index] = !$scope.shouldHideSubitems[item.index];
        }
    };

    $scope.review = function(index, item, subitem) {
        console.log(index, item, subitem);

        $state.go("review/item", {
            itemId: item.index,
            subItemId: subitem.index
        });
    };
});


app.controller('ReviewCardCtrl', function($scope, $stateParams, $state, BasicMgrService) {
    var itemId = $stateParams.itemId,
        subItemId = $stateParams.subItemId;

    BasicMgrService.getReviewItem("unit_1", "2014-09", "1", itemId, subItemId).then(function(data) {
        console.log(data);
        $scope.data = data;
    });

    $scope.changeScore = function(item, score) {
        if (score > 0) {
            item.status = 2;
        } else if (score === 0) {
            item.status = 1;
        } else {
            item.status = 0;
        }

        $scope.$apply();
    };

    $scope.takePhoto = function(item) {
        function onSuccess(imageURI) {
            item.image = imageURI;
            $scope.$apply();
        }

        function onFail(message) {}

        navigator.camera.getPicture(onSuccess, onFail, {
            quality: 75,
            destinationType: Camera.DestinationType.FILE_URI,
            saveToPhotoAlbum: true
        });
    };

    $scope.saveAndReturn = function(item) {
        console.log(item);
        BasicMgrService.setReviewItem("unit_1", "2014-09", "1", itemId, subItemId, item).then(function(ret) {

        });

        history.back();

        // $state.go("review", {
        //     reviewId: ["unit_1", "2014-09", "1"].join("_")
        // });
    };
});