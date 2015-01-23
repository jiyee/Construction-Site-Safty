app.controller('CheckReviewCtrl', function($scope, $stateParams, $state, settings, $ionicPopup, TableService, OfflineService, AuthService, UploadService, resolveUser) {
    $scope.data = {};
    $scope.data.user = resolveUser;
    $scope.data.table = {};
    $scope.data.tableId = $stateParams.tableId;
    $scope.data.itemId = $stateParams.itemId;
    $scope.data.subItemId = $stateParams.subItemId;
    $scope.data.isOffline = OfflineService.isOffline($scope.data.tableId) ? true : false;
    $scope.data.isDirty = false;

    // 用户登录状态异常控制
    if (!$scope.data.user) {
        alert('用户登录状态异常');
        AuthService.logout().then(function () {
            $state.go('welcome');
        });
    }

    var AutoService = $scope.data.isOffline ? OfflineService : TableService;
    AutoService.findById($scope.data.tableId).then(function(table) {
        $scope.data.table = table;

        _.each(table.items, function(item, key) {
            if (item.index === $scope.data.itemId) {
                _.each(item.items, function(subitem, key) {
                    if (subitem.index === $scope.data.subItemId) {
                        $scope.data.review = subitem;
                        return;
                    }
                });
            }
        });
    });

    $scope.changeScore = function(item, score) {
        if (score > 0) {
            item.status = 'FAIL';
        } else if (score === 0) {
            item.status = 'PASS';
        } else {
            item.status = 'UNCHECK';
        }

        $scope.data.isDirty = true;
    };

    $scope.takePhoto = function(item) {
        function onSuccess(imageURI) {
            item.images = item.images || [];
            var image = {
                uri: imageURI,
                date: Date.now()
            };
            item.images.push(image);
            $scope.$apply();

            $scope.data.isDirty = true;

            UploadService.upload(image.uri).then(function(res) {
                image.url = res.url;
            }, function(err) {
                console.log(err);
            });
        }

        function onFail(message) {
            alert(message);
        }

        navigator.camera.getPicture(onSuccess, onFail, {
            quality: 75,
            destinationType: Camera.DestinationType.DATA_URL,
            saveToPhotoAlbum: true
        });
    };

    $scope.removePhoto = function(item, image) {
        if (_.find(item.images, image)) {
            item.images = _.without(item.images, image);
        }

        $scope.data.isDirty = true;
    };

    $scope.toBack = function() {
        if (!$scope.data.isDirty) {
            $state.go('^.table', {
                tableId: $scope.data.tableId
            });

            return;
        }

        var confirmPopup = $ionicPopup.confirm({
            title: '退出提醒',
            template: '评价打分是否确定保存？',
            buttons: [{
                text: '取消',
                type: 'button-default'
            }, {
                text: '确定',
                type: 'button-positive',
                onTap: function(e) {
                    return true;
                }
            }]
        });

        confirmPopup.then(function(res) {
            if (res) {
                AutoService.update($scope.data.tableId, $scope.data.table).then(function(table) {
                    $state.go('^.table', {
                        tableId: $scope.data.tableId
                    });
                }, function(err) {
                    alert(err);
                });
            } else {
                $state.go('^.table', {
                    tableId: $scope.data.tableId
                });
            }
        });
    };

    $scope.save = function() {
        AutoService.update($scope.data.tableId, $scope.data.table).then(function(table) {
            $scope.data.isDirty = false;
            alert('保存成功');
        }, function(err) {
            alert(err);
        });
    };
});