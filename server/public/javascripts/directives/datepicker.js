app.directive('datepicker', function() {
    return {
      restrict: 'A',
      require: '?ngModel',
      link: function(scope, element, attrs, ngModel) {
        if (!ngModel) return;

        ngModel.$render = function() { //This will update the view with your model in case your model is changed by another code.
           $(element).datepicker('update', ngModel.$viewValue || '');
        };

        $(element).datepicker().on("changeDate",function(event){
            scope.$apply(function() {
               ngModel.$setViewValue(event.format()); //This will update the model property bound to your ng-model whenever the datepicker's date changes.
            });
        });
      }
    };
});