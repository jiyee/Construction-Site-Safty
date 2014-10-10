app.controller('ManagerCheckCtrl', function($scope, $rootScope, $state, $stateParams, settings, ProjectService, PartService, UserService, CheckService, AuthService) {
    $scope.data = {};
    $scope.data.userId = $stateParams.userId;
    $scope.data.parts = [];

    $scope.$watch('current.project', function() {
        if ($scope.current.project) {
            PartService.findByProjectId($scope.current.project._id).then(function (parts) {
                $scope.data.parts = $scope.data.parts.concat(parts);
            });
        }
    });

    $scope.current = $rootScope.current;

    if (!$scope.current) {
        $scope.current = {};
        UserService.findById($scope.data.userId).then(function(user) {
            $scope.current.user = user;
            $scope.current.part = user.part;
        });

        // TODO 这里因为数据结构设计问题，暂时写死
        ProjectService.find().then(function(project) {
            $scope.current.project = project[0];
            $scope.data.project = project[0];
        });
    }

    $scope.changeSection = function (section) {
        if (!section) return;

        $scope.data.section = section;
        PartService.findById(section._id).then(function (part) {
            $scope.data.parts = $scope.data.parts.concat(part.parts);
        });
    };

    $scope.changeBranch = function (branch) {
        if (!branch) return;

        $scope.data.branch = branch;
        PartService.findById(branch._id).then(function (part) {
            $scope.data.parts = $scope.data.parts.concat(part.parts);
        });
    };

    $scope.changePlace = function (place) {
        $scope.data.place = place;
    };

    $scope.newCheck = function () {
        console.log($scope.data);

        CheckService.create({
            project_id: $scope.data.project._id,
            part_id: ($scope.data.place || $scope.data.branch || $scope.data.section)['_id'],
            file: $scope.data.file,
            check_target: $scope.data.check_target
        }).then(function(check) {
            console.log(check);
            $state.go('^.table', {
                userId: $scope.data.userId,
                tableId: check.table
            });
        }, function (err) {
            alert(err);
        });
    };

    $scope.toBack = function () {
        $state.go('^.dashboard', {
            userId: $scope.data.userId
        });
    };
});