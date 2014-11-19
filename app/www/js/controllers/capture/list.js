app.controller('CaptureListCtrl', function($scope, $rootScope, $state, $stateParams, $ionicModal, settings, CaptureService, OfflineService, AuthService, resolveUser) {
    $scope.data = {};
    $scope.data.user = resolveUser;

    // 用户登录状态异常控制
    if (!$scope.data.user) {
        alert('用户登录状态异常');
        AuthService.logout().then(function() {
            $state.go('welcome');
        });
    }

    $scope.load = function() {
        CaptureService.findByUserId($scope.data.user._id).then(function(captures) {
            $scope.data.captures = captures;
        });

        OfflineService.list('capture').then(function(captures) {
            $scope.data.offlineCaptures = captures;
            $scope.data.captures_divided_by_segment = {};

            var key;
            _.each(captures, function(capture) {
                key = capture.project.name + " / " + capture.section.name;
                if (!$scope.data.captures_divided_by_segment[key]) {
                    $scope.data.captures_divided_by_segment[key] = [];
                }

                $scope.data.captures_divided_by_segment[key].push(capture);
            });
        });
    };

    $scope.load();

    $ionicModal.fromTemplateUrl('arrange-modal.html', {
        scope: $scope,
    }).then(function(modal) {
        $scope.modal = modal;
    });
    $scope.openModal = function($event) {
        $scope.modal.show($event);
    };
    $scope.closeModal = function() {
        $scope.modal.hide();
    };

    // 分类整理，多条数据汇总成一条数据
    $scope.arrange = function() {
        var selected = _.filter($scope.data.offlineCaptures, {
            checked: true
        });

        if (selected.length === 0) {
            alert('请选择要汇总的数据');
            return;
        }

        var projectAt = _.countBy(selected, function(capture) {
            return capture.project._id;
        });
        if (_.keys(projectAt).length > 1) {
            alert('汇总数据必须在同一项目');
            return;
        }

        var sectionAt = _.countBy(selected, function(capture) {
            return capture.section._id;
        });
        if (_.keys(sectionAt).length > 1) {
            alert('汇总数据必须在同一标段');
            return;
        }

        var capture = {};
        capture.project = _.first(_.keys(projectAt));
        capture.section = _.first(_.keys(sectionAt));
        capture.user = $scope.data.user._id;
        capture.archives = [];
        _.each(selected, function(item) {
            capture.archives.push(_.pick(item, ['object', 'comment', 'category', 'images']));
        });

        CaptureService.create(capture).then(function(capture) {
            alert('保存成功');

            // 清空本地数据
            _.each(selected, function(item) {
                OfflineService.remove(item._id);
            });
            // 重新加载服务器数据
            $scope.load();
            // 关闭弹窗
            $scope.closeModal();
        }, function(err) {
            alert('保存失败');
        });
    };

    $scope.toDetail = function(item) {
        $state.go('^.detail', {
            captureId: item._id
        });
    };

    $scope.toBack = function() {
        $state.go('^.map', {
            userId: $scope.data.user._id
        });
    };
});
