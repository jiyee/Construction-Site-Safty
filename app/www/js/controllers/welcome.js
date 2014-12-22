app.controller('WelcomeCtrl', function($scope, $ionicPopup, $state, $stateParams, settings, user, SyncService) {
    $scope.data = {};
    $scope.data.server = settings.baseUrl;

    // 用户session判断，自动跳转
    if (user && user.role) {
        $state.go([user.role, 'dashboard'].join('.'), {
            userId: user._id
        });
    }

    $scope.setServerAddr = function() {
        SyncService.fullUpgrade().then(function() {
            alert('离线包下载成功');
        }, function() {
            alert('离线包下载失败');
        });

        // var popup = $ionicPopup.show({
        //     template: '<input type="text" ng-model="data.server">',
        //     title: '输入服务器地址：',
        //     scope: $scope,
        //     buttons: [{
        //         text: '取消'
        //     }, {
        //         text: '<b>保存</b>',
        //         type: 'button-positive',
        //         onTap: function(e) {
        //             if (!$scope.data.server) {
        //                 e.preventDefault();
        //             } else {
        //                 return $scope.data.server;
        //             }
        //         }
        //     }, ]
        // });

        // popup.then(function(server) {
        //     if (!server) return;

        //     settings.baseUrl = server;
        // });
    };

});