var app = angular.module('app', ['ui.router']);

// var ipAddr = 'localhost';
var ipAddr = '121.40.202.109';

// 注册全局变量
app.constant('settings', {
    'baseUrl': 'http://' + ipAddr + ':3000'
});

app.config(['$stateProvider', '$urlRouterProvider', '$compileProvider', '$locationProvider', function($stateProvider, $urlRouterProvider, $compileProvider, $locationProvider) {

    $locationProvider.hashPrefix('!');

    $stateProvider
        .state('login', {
            url: '/login',
            templateUrl: 'views/login.html',
            controller: 'LoginController'
        })

        .state('dashboard', {
            url: '/dashboard',
            templateUrl: 'views/dashboard.html',
            controller: 'DashboardController',
            resolve: {
                resolveUser: function(AuthService) {
                    return AuthService.getUser();
                }
            }
        });

    // 设置默认路由
    $urlRouterProvider.otherwise('/login');

    // 设置image url白名单，否则AngularJS解析URL错误
    $compileProvider.imgSrcSanitizationWhitelist(/^\s*(https?|file|blob|cdvfile|content):|data:image\//);
    $compileProvider.aHrefSanitizationWhitelist(/^\s*(https?|file|blob|cdvfile|content|sms|smsto|tel|mailto):|data:image\//);
}]);
app.controller('DashboardController', function($scope, $state, $stateParams, settings, CaptureService, CheckService, EvaluationService, resolveUser) {
    $scope.data = {};
    $scope.data.user = resolveUser;
    $scope.data.files = [];

    CaptureService.findByUserId($scope.data.user._id).then(function(captures) {
        $scope.data.files = _.sortBy(_.union($scope.data.files, _.each(captures, function(capture) {
            capture.type = '安全检查';
            if (capture.process && capture.process.status === 'END') {
                capture.status = '已整改';
            } else {
                capture.status = '处理中';
            }
        })), ['type', 'status', 'createAt']);
    });

    CheckService.findByUserId($scope.data.user._id).then(function(checks) {
        $scope.data.files = _.sortBy(_.union($scope.data.files, _.each(checks, function(check) {
            check.type = '日常巡检';
            if (check.process && check.process.status === 'END') {
                check.status = '已整改';
            } else {
                check.status = '处理中';
            }
        })), ['type', 'status', 'createAt']);
    });

    EvaluationService.findByUserId($scope.data.user._id).then(function(evaluations) {
        $scope.data.files = _.sortBy(_.union($scope.data.files, _.each(evaluations, function(evaluation) {
            evaluation.type = '考核评价';
            if (evaluation.process && evaluation.process.status === 'END') {
                evaluation.status = '已整改';
            } else {
                evaluation.status = '处理中';
            }
        })), ['type', 'status', 'createAt']);
    });

    $scope.docxgen = function(item) {
        var service;
        if (item.type === '安全检查') {
            service = CaptureService;
        } else if (item.type === '日常巡检') {
            service = CheckService;
        } else if (item.type === '考核评价') {
            service = EvaluationService;
        } else {
            return;
        }

        service.docxgen(item._id).then(function(files) {
            var refs = [];
            _.each(files, function(file) {
                refs.push({
                    url: settings.baseUrl + '/docx/' + item._id + '_' + file + '.docx'
                });
            });

            $scope.data.refs = refs;

            $("#docxModal").modal('show');

        }, function(err) {
            alert(err);
        });
    };

});
app.controller('CategoryDetailController', function($scope, $state, $stateParams, category, CategoryService) {
    $scope.data = {};
    $scope.data.category = category;

    $scope.data.upToken = category.upToken;

    $scope.$on('select', function(evt, row) {
        $scope.data.category.cars.push(row);
    });

    $scope.update = function() {
        if ($scope.form.$invalid) {
            alert('请填写完整表单内容！');
            return;
        }

        CategoryService.update($scope.data.category).then(function(result) {
            if (result) {
                alert('保存成功！');
            }
        }, function(result) {
            alert(result.message);
        });
    };

    $scope.publish = function() {
        if ($scope.form.$invalid) return;

        $scope.data.category.status = "PUBLISH";

        CategoryService.update($scope.data.category).then(function(result) {
            if (result) {
                alert('发布成功！');
            }
        }, function(result) {
            alert(result.message);
        });
    };

    $scope.withdraw = function() {
        if ($scope.form.$invalid) return;

        $scope.data.category.status = "WITHDRAW";

        CategoryService.update($scope.data.category).then(function(result) {
            if (result) {
                alert('撤销成功！');
            }
        }, function(result) {
            alert(result.message);
        });
    };
});
app.controller('LoginController', function($scope, $state, $stateParams, UnitService, UserService, AuthService) {
    $scope.data = {};

    UnitService.find().then(function(units) {
        $scope.data.units = units;
    });

    $scope.$watch('data.unit', function (unit) {
        if (!unit) return;

        UserService.findByUnitId(unit._id).then(function (users) {
            $scope.data.users = users;
        });
    });

    $scope.login = function () {
        if (!$scope.data.unit) {
            alert('请选择单位');
            return;
        }

        if (!$scope.data.user) {
            alert('请选择用户');
            return;
        }

        if (!$scope.data.password) {
            alert('请输入密码');
            return;
        }

        AuthService.login($scope.data.user.username, $scope.data.password).then(function (user) {
            $state.go("dashboard", {
                userId: user._id,
            });
        }, function (err) {
            alert(err);
        });
    };
});
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
app.directive('ngEnter', function () {
    return function (scope, element, attrs) {
        element.bind("keydown keypress", function (event) {
            if(event.which === 13) {
                scope.$apply(function (){
                    scope.$eval(attrs.ngEnter);
                });

                event.preventDefault();
            }
        });
    };
});
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
app.factory('AuthService', function($rootScope, $http, $q, settings) {
    var user;

    if (localStorage.getItem('current_user')) {
        try {
            user = JSON.parse(localStorage.getItem('current_user'));
        } catch(ex) {
            user = null;
        }
    }

    return {
        login: function(username, password) {
            var deferred = $q.defer();

            $http.post(settings.baseUrl + '/login', {
                    username: username,
                    password: password
                })
                .success(function(data) {
                    if (data.code > 0) {
                        deferred.reject(data.message);
                    } else {
                        user = data.user;
                        localStorage.setItem('current_user', JSON.stringify(data.user));
                        deferred.resolve(data.user);
                    }
                })
                .error(function(err) {
                    deferred.reject(err);
                });

            return deferred.promise;
        },
        auth: function () {
            var deferred = $q.defer();

            $http.get(settings.baseUrl + '/auth')
                .success(function(data) {
                    if (data.code > 0) {
                        deferred.reject(data.message);
                    } else {
                        user = data.user;
                        localStorage.setItem('current_user', JSON.stringify(data.user));
                        deferred.resolve(data.user);
                    }
                })
                .error(function(err) {
                    deferred.reject(err);
                });

            return deferred.promise;
        },
        logout: function () {
            var deferred = $q.defer();

            user = null;
            localStorage.removeItem('current_user');

            $http.post(settings.baseUrl + '/logout')
                .success(function(data) {
                    if (data.code > 0) {
                        deferred.reject(data.message);
                    } else {
                        deferred.resolve(data.user);
                    }
                })
                .error(function(err) {
                    deferred.reject(err);
                });

            deferred.resolve();

            return deferred.promise;
        },
        getUser: function () {
            return user;
        }
    };
});
app.factory('CaptureService', function($http, $q, settings) {
    return {
        find: function() {
            var deferred = $q.defer();

            $http.get(settings.baseUrl + '/captures/all')
                .success(function(data) {
                    deferred.resolve(data.captures);
                })
                .error(function(err) {
                    deferred.reject(err);
                });

            return deferred.promise;
        },
        findById: function(captureId) {
            var deferred = $q.defer();

            $http.get(settings.baseUrl + '/capture/' + captureId)
                .success(function(data) {
                    deferred.resolve(data.capture);
                })
                .error(function(err) {
                    deferred.reject(err);
                });

            return deferred.promise;
        },
        findByUserId: function(userId) {
            var deferred = $q.defer();

            $http.get(settings.baseUrl + '/user/' + userId + '/captures')
                .success(function(data) {
                    deferred.resolve(data.captures);
                })
                .error(function(err) {
                    deferred.reject(err);
                });

            return deferred.promise;
        },
        findByProcessCurrentUserId: function(userId) {
            var deferred = $q.defer();

            $http.get(settings.baseUrl + '/process/' + userId + '/captures')
                .success(function(data) {
                    deferred.resolve(data.captures);
                })
                .error(function(err) {
                    deferred.reject(err);
                });

            return deferred.promise;
        },
        list: function(projectId, segmentId, startDate, endDate) {
            var deferred = $q.defer();

            $http.get(settings.baseUrl + '/captures/list/' + projectId + '/' + segmentId + '/' + startDate + '/' + endDate)
                .success(function(data) {
                    deferred.resolve(data.captures);
                })
                .error(function(err) {
                    deferred.reject(err);
                });

            return deferred.promise;
        },
        docxgen: function(captureId) {
            var deferred = $q.defer();

            $http.get(settings.baseUrl + '/capture/' + captureId + '/docxgen')
                .success(function(data) {
                    deferred.resolve(data.files);
                })
                .error(function(err) {
                    deferred.reject(err);
                });

            return deferred.promise;
        },
    };
});
app.factory('CheckService', function($http, $q, settings) {
    return {
        find: function() {
            var deferred = $q.defer();

            $http.get(settings.baseUrl + '/checks')
                .success(function(data) {
                    deferred.resolve(data.checks);
                })
                .error(function(err) {
                    deferred.reject(err);
                });

            return deferred.promise;
        },
        findById: function(checkId) {
            var deferred = $q.defer();

            $http.get(settings.baseUrl + '/check/' + checkId)
                .success(function(data) {
                    deferred.resolve(data.check);
                })
                .error(function(err) {
                    deferred.reject(err);
                });

            return deferred.promise;
        },
        findByUserId: function(userId) {
            var deferred = $q.defer();

            $http.get(settings.baseUrl + '/user/' + userId + '/checks')
                .success(function(data) {
                    deferred.resolve(data.checks);
                })
                .error(function(err) {
                    deferred.reject(err);
                });

            return deferred.promise;
        },
        findByProcessCurrentUserId: function(userId) {
            var deferred = $q.defer();

            $http.get(settings.baseUrl + '/process/' + userId + '/checks')
                .success(function(data) {
                    deferred.resolve(data.checks);
                })
                .error(function(err) {
                    deferred.reject(err);
                });

            return deferred.promise;
        },
        create: function(form) {
            var deferred = $q.defer();

            $http.post(settings.baseUrl + '/check/create', form)
                .success(function(data) {
                    if (data.code > 0) {
                        deferred.reject(data.message);
                    } else {
                        deferred.resolve();
                    }
                })
                .error(function(err) {
                    deferred.reject(err);
                });

            return deferred.promise;
        },
        list: function(projectId, segmentId, startDate, endDate) {
            var deferred = $q.defer();

            $http.get(settings.baseUrl + '/checks/list/' + projectId + '/' + segmentId + '/' + startDate + '/' + endDate)
                .success(function(data) {
                    deferred.resolve(data.checks);
                })
                .error(function(err) {
                    deferred.reject(err);
                });

            return deferred.promise;
        },
        docxgen: function(checkId) {
            var deferred = $q.defer();

            $http.get(settings.baseUrl + '/check/' + checkId + '/docxgen')
                .success(function(data) {
                    deferred.resolve(data.files);
                })
                .error(function(err) {
                    deferred.reject(err);
                });

            return deferred.promise;
        },
    };
});

app.factory('EvaluationService', function($http, $q, settings) {
    return {
        find: function() {
            var deferred = $q.defer();

            $http.get(settings.baseUrl + '/evaluations')
                .success(function(data) {
                    deferred.resolve(data.evaluations);
                })
                .error(function(err) {
                    deferred.reject(err);
                });

            return deferred.promise;
        },
        findById: function(evaluationId) {
            var deferred = $q.defer();

            $http.get(settings.baseUrl + '/evaluation/' + evaluationId)
                .success(function(data) {
                    deferred.resolve(data.evaluation);
                })
                .error(function(err) {
                    deferred.reject(err);
                });

            return deferred.promise;
        },
        findByUserId: function(userId) {
            var deferred = $q.defer();

            $http.get(settings.baseUrl + '/user/' + userId + '/evaluations')
                .success(function(data) {
                    deferred.resolve(data.evaluations);
                })
                .error(function(err) {
                    deferred.reject(err);
                });

            return deferred.promise;
        },
        create: function(form) {
            var deferred = $q.defer();

            $http.post(settings.baseUrl + '/evaluation/create', form)
                .success(function(data) {
                    if (data.code > 0) {
                        deferred.reject(data.message);
                    } else {
                        deferred.resolve(data.evaluation);
                    }
                })
                .error(function(err) {
                    deferred.reject(err);
                });

            return deferred.promise;
        },
        update: function(evaluationId, evaluation) {
            var deferred = $q.defer();

            $http.post(settings.baseUrl + '/evaluation/' + evaluationId + '/update', {
                    evaluation_id: evaluationId,
                    evaluation: JSON.stringify(evaluation)
                })
                .success(function(data) {
                    if (data.code > 0) {
                        deferred.reject(data.message);
                    } else {
                        deferred.resolve(data.evaluation);
                    }
                })
                .error(function(err) {
                    deferred.reject(err);
                });

            return deferred.promise;
        },
        findByProcessCurrentUserId: function(userId) {
            var deferred = $q.defer();

            $http.get(settings.baseUrl + '/process/' + userId + '/evaluations')
                .success(function(data) {
                    deferred.resolve(data.evaluations);
                })
                .error(function(err) {
                    deferred.reject(err);
                });

            return deferred.promise;
        },
        list: function(projectId, segmentId, startDate, endDate) {
            var deferred = $q.defer();

            $http.get(settings.baseUrl + '/evaluations/list/' + projectId + '/' + segmentId + '/' + startDate + '/' + endDate)
                .success(function(data) {
                    deferred.resolve(data.evaluations);
                })
                .error(function(err) {
                    deferred.reject(err);
                });

            return deferred.promise;
        },
        docxgen: function(evaluationId) {
            var deferred = $q.defer();

            $http.get(settings.baseUrl + '/evaluation/' + evaluationId + '/docxgen')
                .success(function(data) {
                    deferred.resolve(data.files);
                })
                .error(function(err) {
                    deferred.reject(err);
                });

            return deferred.promise;
        },
    };
});
app.factory('UnitService', function($http, $q, settings) {
    return {
        find: function() {
            var deferred = $q.defer();

            $http.get(settings.baseUrl + '/units/all')
                .success(function(data) {
                    deferred.resolve(data.units);
                })
                .error(function(err) {
                    deferred.reject(err);
                });

            return deferred.promise;
        },
        findById: function(unitId) {
            var deferred = $q.defer();


            $http.get(settings.baseUrl + '/unit/' + unitId)
                .success(function(data) {
                    deferred.resolve(data.unit);
                })
                .error(function(err) {
                    deferred.reject(err);
                });

            return deferred.promise;
        },
        findByProjectId: function(projectId) {
            var deferred = $q.defer();

            $http.get(settings.baseUrl + '/project/' + projectId + '/units')
                .success(function(data) {
                    deferred.resolve(data.units);
                })
                .error(function(err) {
                    deferred.reject(err);
                });

            return deferred.promise;
        },
        findBySegmentId: function(segmentId) {
            var deferred = $q.defer();

            $http.get(settings.baseUrl + '/segment/' + segmentId + '/units')
                .success(function(data) {
                    deferred.resolve(data.units);
                })
                .error(function(err) {
                    deferred.reject(err);
                });

            return deferred.promise;
        }
    };
});

app.factory('UsedCarService', ['$http', '$q', '$log',
    function($http, $q, $log) {
        return {
            query: function(params) {
                var query_url = "/index.php?c=used_car&type=get_cars";
                var d = $q.defer();

                $http.get(query_url, {
                    params: params
                }).success(function(data) {
                    if (data.status === 0) {
                        d.resolve(data.data);
                    } else {
                        d.reject(data);
                    }
                }).error(function(data, status, headers, config) {
                    d.reject(data);
                });

                return d.promise;
            },

            getBrandAndSeries: function() {
                var query_url = "/index.php?c=used_car&type=get_brand_and_series";
                var d = $q.defer();

                $http.get(query_url).success(function(data) {
                    if (data.status === 0) {
                        d.resolve(data.data);
                    } else {
                        d.reject(data);
                    }
                }).error(function(data, status, headers, config) {
                    d.reject(data);
                });

                return d.promise;
            }
        };
    }
]);
app.factory('UserService', function($http, $q, settings) {
    return {
        find: function() {
            var deferred = $q.defer();

            $http.get(settings.baseUrl + '/users/all')
                .success(function(data) {
                    deferred.resolve(data.users);
                })
                .error(function(err) {
                    deferred.reject(err);
                });
            return deferred.promise;
        },
        findById: function(userId) {
            var deferred = $q.defer();


            $http.get(settings.baseUrl + '/user/' + userId)
                .success(function(data) {
                    deferred.resolve(data.user);
                })
                .error(function(err) {
                    deferred.reject(err);
                });

            return deferred.promise;
        },
        findBySegmentId: function(segmentId) {
            var deferred = $q.defer();


            $http.get(settings.baseUrl + '/segment/' + segmentId + '/users')
                .success(function(data) {
                    deferred.resolve(data.users);
                })
                .error(function(err) {
                    deferred.reject(err);
                });

            return deferred.promise;
        },
        findByUnitId: function(unitId) {
            var deferred = $q.defer();


            $http.get(settings.baseUrl + '/unit/' + unitId + '/users')
                .success(function(data) {
                    deferred.resolve(data.users);
                })
                .error(function(err) {
                    deferred.reject(err);
                });

            return deferred.promise;
        }
    };
});
