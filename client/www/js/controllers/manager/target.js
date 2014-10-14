app.controller('ManagerTargetCtrl', function($scope, $rootScope, $state, $stateParams, settings, ProjectService, SegmentService, UserService, CheckService, AuthService) {
    $scope.data = {};
    $scope.data.userId = $stateParams.userId;
    $scope.data.segments = [];

    $scope.$watch('current.project', function() {
        if ($scope.current.project) {
            SegmentService.findByProjectId($scope.current.project._id).then(function (segments) {
                $scope.data.segments = $scope.data.segments.concat(segments);
            });
        }
    });

    $scope.current = $rootScope.current;

    if (!$scope.current) {
        $scope.current = {};
        UserService.findById($scope.data.userId).then(function(user) {
            $scope.current.user = user;
            $scope.current.segment = user.segment;
        });

        // TODO 这里因为数据结构设计问题，暂时写死
        ProjectService.find().then(function(project) {
            $scope.current.project = project[0];
            $scope.data.project = project[0];
        });
    } else {
        $scope.data.project = $scope.current.project;
    }


    $scope.changeSection = function (section) {
        if (!section) return;

        $scope.data.section = section;
        SegmentService.findById(section._id).then(function (segment) {
            $scope.data.segments = $scope.data.segments.concat(segment.segments);
        });
    };

    $scope.changeBranch = function (branch) {
        if (!branch) return;

        $scope.data.branch = branch;
        SegmentService.findById(branch._id).then(function (segment) {
            $scope.data.segments = $scope.data.segments.concat(segment.segments);
        });
    };

    $scope.changePlace = function (place) {
        $scope.data.place = place;
    };

    $scope.newCheck = function () {
        CheckService.create({
            project_id: $scope.data.project._id,
            segment_id: ($scope.data.place || $scope.data.branch || $scope.data.section)['_id'],
            file: $scope.data.file,
            check_target: $scope.data.check_target
        }).then(function(check) {
            console.log(JSON.stringify(check));
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