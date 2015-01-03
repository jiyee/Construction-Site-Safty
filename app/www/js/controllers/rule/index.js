app.controller('RuleIndexCtrl', function($scope, $rootScope, $state, $stateParams, settings, rules, resolveUser) {
    $scope.data = {};
    $scope.data.user = resolveUser;

    $scope.data.rules = rules;

    $scope.select = function(item) {
        _.each($scope.data.rules, function(item) {
            item.selected = false;
        });

        item.selected = true;

        $scope.data.rule = item;
    };

    $scope.select($scope.data.rules[0]);
});