app.directive('notification', function () {
    return {
        restrict: 'E',
        require: 'ngModel',
        scope: {
            data: '=ngModel'
        },
        link: function (scope, element, attrs, ngModel) {
        },
        template: '<div ng-show="data.show" class="col-md-6 col-md-offset-2 alert alert-{{data.type}} fade in" style="position: fixed; top: 4px; z-index: 1000;"><strong>{{data.status}}</strong>&nbsp;&nbsp;{{data.err_msg}}</div>'
    };
});