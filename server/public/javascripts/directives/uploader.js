app.directive('uploader', function ($timeout, QiniuService) {
    return {
        restrict: 'E',
        require: 'ngModel',
        scope: {
            data: '=ngModel'
        },
        link: function (scope, element, attrs, ngModel) {
            var id = attrs.id;

            scope.id = attrs.id;
            scope.title = attrs.title;
            scope.data = scope.data || "";

            if (scope.data) {
                scope.temp = {
                    name: scope.data.split("/")[3],
                    img_url: scope.data,
                    percent: 100,
                    bytesPerSecond: 0,
                    sending: false
                };
            }

            $timeout(function () {
                QiniuService.uploader(id, {
                    uptoken: attrs.uptoken,
                    multi_selection: false
                }, function (file) {
                    var metadata = {
                        name: file.name,
                        size: file.size,
                        percent: 0,
                        bytesPerSecond: 0,
                        sending: true
                    };

                    file.metadata = metadata;
                    scope.temp = metadata;
                    scope.$apply();
                }, function (metadata, percent, bytesPerSecond) {
                    metadata.percent = percent;
                    metadata.bytesPerSecond = bytesPerSecond;
                    scope.$apply();
                }, function (metadata, up, file, info) {
                    metadata.percent = 100;
                    metadata.bytesPerSecond = 0;
                    metadata.sending = false;
                    metadata.id = file.target_name;
                    metadata.img_url = "http://rrcdn.qiniudn.com/" + file.target_name.toLowerCase();

                    scope.data = metadata.img_url;
                    scope.$apply();
                }).then(function() {

                }, function (metadata, errTip) {
                    metadata.errTip = errTip;
                    scope.$apply();
                });
            }, 0);
        },
        controller: function ($scope) {
            $scope.remove = function(index) {
                $scope.data = "";
                $scope.temp = {};
            };
        },
        templateUrl: 'js/category/directives/uploader.html'
    };
});