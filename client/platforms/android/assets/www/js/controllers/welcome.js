app.controller('WelcomeCtrl', function($scope, $ionicPopup, $state, $stateParams, settings, user) {
    $scope.data = {};
    $scope.data.server = settings.baseUrl;

    // 用户session判断，自动跳转
    if (user && user.role && user.role.name) {
        $state.go([settings.roles[user.role.name], 'dashboard'].join('.'), {
            userId: user._id
        });
    }

    $scope.setServerAddr = function() {
        var popup = $ionicPopup.show({
            template: '<input type="text" ng-model="data.server">',
            title: '输入服务器地址：',
            scope: $scope,
            buttons: [{
                text: '取消'
            }, {
                text: '<b>保存</b>',
                type: 'button-positive',
                onTap: function(e) {
                    if (!$scope.data.server) {
                        e.preventDefault();
                    } else {
                        return $scope.data.server;
                    }
                }
            }, ]
        });

        popup.then(function(server) {
            if (!server) return;

            settings.baseUrl = server;
        });
    };

});