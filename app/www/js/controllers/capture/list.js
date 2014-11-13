app.controller('CaptureListCtrl', function($scope, $rootScope, $state, $stateParams, settings, ProjectService, UserService, UnitService, CaptureService, AuthService, resolveUser) {
    $scope.data = {};
    $scope.data.user = resolveUser;
    $scope.data.captures = [];
    $scope.data.categories = {};

    CaptureService.findByUserId($scope.data.user._id).then(function(captures) {
        $scope.data.captures = captures;

        _.each(captures, function(capture) {
            $scope.data.categories[capture.project.name + " " + capture.section.name] = $scope.data.categories[capture.project.name + " " + capture.section.name] || [];
            $scope.data.categories[capture.project.name + " " + capture.section.name].push(capture);
        });
    });

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
