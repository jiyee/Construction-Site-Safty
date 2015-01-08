app.controller('CategoryDetailController', function($scope, $state, $stateParams, category, CategoryService) {
    $scope.data = {};
    $scope.data.category = category;

    $scope.data.upToken = category.upToken;

    $scope.$on('select', function(evt, row) {
        $scope.data.category.cars.push(row);
    });

    $scope.update = function() {
        if ($scope.form.$invalid) {
            alert('请填写完整表单内容！');
            return;
        }

        CategoryService.update($scope.data.category).then(function(result) {
            if (result) {
                alert('保存成功！');
            }
        }, function(result) {
            alert(result.message);
        });
    };

    $scope.publish = function() {
        if ($scope.form.$invalid) return;

        $scope.data.category.status = "PUBLISH";

        CategoryService.update($scope.data.category).then(function(result) {
            if (result) {
                alert('发布成功！');
            }
        }, function(result) {
            alert(result.message);
        });
    };

    $scope.withdraw = function() {
        if ($scope.form.$invalid) return;

        $scope.data.category.status = "WITHDRAW";

        CategoryService.update($scope.data.category).then(function(result) {
            if (result) {
                alert('撤销成功！');
            }
        }, function(result) {
            alert(result.message);
        });
    };
});