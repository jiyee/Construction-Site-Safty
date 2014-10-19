app.controller('CheckDetailCtrl', function($scope, $rootScope, $state, $stateParams, $ionicPopup, settings, ProjectService, SegmentService, UserService, CheckService, AuthService, resolveUser) {
    $scope.data = {};
    $scope.data.check = {};
    $scope.data.user = resolveUser;
    $scope.data.checkId = $stateParams.checkId;

    CheckService.findById($scope.data.checkId).then(function(check) {
        $scope.data.check = check;

        // var rectifications = [];

        // angular.forEach(check.table.items, function(level1) {
        //     angular.forEach(level1.items, function(level2) {
        //         angular.forEach(level2.items, function(level3) {
        //             if (level3.status && level3.score > 0) {
        //                 rectifications.push({
        //                     name: level3.name,
        //                     image_url: level3.image_url
        //                 });
        //             }
        //         });
        //     });
        // });

        // $scope.data.rectifications = rectifications;
    });

    $scope.toBack = function() {
        $state.go([settings.roles[$scope.data.user.role.name], 'dashboard'].join('.'), {
            userId: $scope.data.user._id
        });
    };

    $scope.toTable = function() {
        $state.go('^.table', {
            tableId: $scope.data.check.table._id
        });
    };

    $scope.toCriterion = function() {
        $state.go('^.criterion', {
            checkId: $scope.data.check._id
        });
    };

    $scope.toRectification = function () {
        $state.go('^.rectification', {
            checkId: $scope.data.check._id
        });
    };

    $scope.backward = function() {
        CheckService.backward($scope.data.checkId, $scope.data.check.rectification_result).then(function(check) {
            alert("整改提交完毕");
            $state.go([settings.roles[$scope.data.user.role.name], 'dashboard'].join('.'), {
                userId: $scope.data.user._id
            });
        }, function(err) {
            alert(err); 
        });
    };

    $scope.end = function () {
        var confirmPopup = $ionicPopup.confirm({
            title: '整改验收',
            template: '安全整改验收是否通过？',
            buttons: [{
                text: '不通过',
                type: 'button-default'
            }, {
                text: '通过',
                type: 'button-positive',
                onTap: function(e) {
                    return true;
                }
            }]
        });

        confirmPopup.then(function(res) {
            if (res) {
                CheckService.end($scope.data.checkId).then(function(check) {
                    alert('整改验收完毕，本次安全检查结束。');
                    $state.go([settings.roles[$scope.data.user.role.name], 'dashboard'].join('.'), {
                        userId: $scope.data.user._id
                    });
                }, function (err) {
                    alert(err);
                });
            }
        });
    };


});