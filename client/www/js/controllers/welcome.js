app.controller('WelcomeCtrl', function($scope, $ionicPopup, settings) {
    $scope.data = {};
    $scope.data.server = settings.baseUrl;

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