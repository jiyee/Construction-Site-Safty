app.controller('CaptureCreateCtrl', function($scope, $rootScope, $state, $stateParams, $timeout, $ionicModal, settings, categories, SegmentService, CaptureService, OfflineService, AuthService, UploadService, resolveUser, resolveProjects) {
    $scope.data = {};
    $scope.data.user = resolveUser;
    $scope.data.projects = resolveProjects;
    $scope.data.sections = [];
    $scope.data.branches = [];
    $scope.data.level1s = _.uniq(categories, 'name');
    $scope.data.categories = categories;
    $scope.data.images = [];
    $scope.data.center_x = 0;
    $scope.data.center_y = 0;
    $scope.data.object = $scope.$parent.properties ? $scope.$parent.properties.object : null;

    // 用户登录状态异常控制
    if (!$scope.data.user) {
        alert('用户登录状态异常');
        AuthService.logout().then(function() {
            $state.go('welcome');
        });
    }

    // 自动选中默认项目、标段、分部
    // 优先选择预先设定的项目、标段、分部
    var project = $scope.$parent.data.project || $scope.data.user.project;
    var section = $scope.$parent.data.section || $scope.data.user.section;
    var branch = $scope.$parent.data.branch || $scope.data.user.branch;

    if (project) {
        $scope.data.project = _.find($scope.data.projects, {_id: project._id});
        SegmentService.findByProjectId(project._id).then(function (segments) {
            $scope.data.sections = segments;

            if (section) {
                // BUG 只有延时才能解决默认选中问题
                $timeout(function() {
                    $scope.data.section = _.find($scope.data.sections, {
                        _id: section._id
                    });
                }, 100);
            }
        });
    }

    $scope.$watch('data.project', function (project) {
        if (!project) return;

        SegmentService.findByProjectId(project._id).then(function (segments) {
            $scope.data.sections = segments;
        });
    });

    $scope.$watch('data.section', function(section) {
        if (!section) return;

        SegmentService.findById(section._id).then(function (segment) {
            $scope.data.branches = segment.segments;

            if (branch) {
                // BUG 只有延时才能解决默认选中问题
                $timeout(function() {
                    $scope.data.branch = _.find($scope.data.branches, {
                        _id: branch._id
                    });
                }, 100);
            }
        });
    });

    $scope.$watch('data.level1', function (name) {
        if (!name) {
            $scope.level1 = {
                "name": name,
                "items": []
            };
            $scope.data.level3 = '';
            return;
        }

        var category = _.find($scope.data.categories, {name: name});
        $scope.level1 = {
            "name": name,
            "items": []
        };
        var groups = _.uniq(_.pluck(category.items, 'group'));
        _.each(groups, function(item) {
            $scope.level1.items.push({
                "name": item,
                "items": []
            });
        });

        _.each(category.items, function(item) {
            if (!_.contains(groups, item.group)) return;

            _.find($scope.level1.items, {"name": item.group}).items.push({
                "name": item.name
            });
        });
    });

    var onSuccess = function(position) {
        $scope.data.center_x = position.coords.longitude;
        $scope.data.center_y = position.coords.latitude;
        $scope.$apply();
    };

    var onError = function(error) {
        $scope.data.center_x = 0;
        $scope.data.center_y = 0;
        $scope.$apply();
    };

    navigator.geolocation.getCurrentPosition(onSuccess, onError);

    $scope.takePhoto = function() {
        function onSuccess(imageURI) {
            var image = {
                uri: imageURI,
                date: Date.now(),
                center: [$scope.data.center_x, $scope.data.center_y]
            };
            $scope.data.images.push(image);
            $scope.$apply();

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

    $scope.removePhoto = function(image) {
        if (_.find($scope.data.images, image)) {
            $scope.data.images = _.without($scope.data.images, image);
        }
    };

    $ionicModal.fromTemplateUrl('level3-modal.html', {
        scope: $scope,
    }).then(function(modal) {
        $scope.modal = modal;
    });
    $scope.openModal = function($event) {
        if (!$scope.data.level1) return;
        $scope.modal.show($event);
    };
    $scope.closeModal = function() {
        $scope.modal.hide();

        $scope.data.level3 = '';
        _.each($scope.level1.items, function(level2) {
            _.each(level2.items, function(level3) {
                if (level3.selected) $scope.data.level3 = level3.name;
            });
        });
    };
    $scope.clearModal = function () {
        $scope.data.level3 = '';
        _.each($scope.level1.items, function(level2) {
            _.each(level2.items, function(level3) {
                level3.selected = false;
            });
        });
    };

    $scope.ifHideSubItems = {};
    $scope.toggle = function(index, item) {
        if ($scope.ifHideSubItems[item.name] === undefined) {
            $scope.ifHideSubItems[item.name] = true;
        } else {
            $scope.ifHideSubItems[item.name] = !$scope.ifHideSubItems[item.name];
        }
    };
    $scope.select = function(index, level2, level3) {
        if (!$scope.level1) return;

        _.each($scope.level1.items, function(level2) {
            _.each(level2.items, function(level3) {
                level3.selected = false;
            });
        });

        level3.selected = true;
    };

    $scope.save = function() {
        if (!$scope.data.project) {
            alert('请选择检查项目');
            return;
        }

        if (!$scope.data.section) {
            alert('请选择合同段');
            return;
        }

        if (!$scope.data.level1) {
            alert('请选择检查类别');
            return;
        }

        if (!$scope.data.level3 && !$scope.data.images) {
            alert('请选择存在问题或拍照存档');
            return;
        }

        // 离线重构, 离线保存均保持对象，等到同步时保存_id
        OfflineService.newCapture({
            user: $scope.data.user,
            project: $scope.data.project,
            section: $scope.data.section,
            branch: $scope.data.branch,
            object: $scope.data.object,
            level1: $scope.data.level1,
            // level2: $scope.data.level2,
            level3: $scope.data.level3,
            comment: $scope.data.comment,
            images: $scope.data.images
        }).then(function(check) {
            alert('保存成功');
            $scope.toBack();
        }, function(err) {
            alert(err);
        });
    };

    $scope.toBack = function() {
        $state.go('^.map', {
            userId: $scope.data.user._id
        });
    };
});
