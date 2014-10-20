var app = angular.module('app', ['ionic']);

// 加载ionic和cordova
app.run(["$rootScope", "$ionicPlatform", function($rootScope, $ionicPlatform) {
    $ionicPlatform.ready(function() {
        if (window.cordova && window.cordova.plugins.Keyboard) {
            cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
        }
        if (window.StatusBar) {
            StatusBar.hide();
        }
    });

    $rootScope.$on("$stateChangeSuccess", function (event, current, previous, eventObj) {
        console.log('stateChangeSuccess', current, previous, eventObj);
    });

    $rootScope.$on("$stateChangeError", function (event, current, previous, eventObj) {
        console.log('stateChangeError', current, previous, eventObj);
    });

    $rootScope.$on('$stateChangeStart', function (event, current, previous, eventObj) {
        console.log('stateChangeStart', current, previous, eventObj);
    });
}])

// 注册全局变量
.constant('settings', {
    'baseUrl': 'http://' + '127.0.0.1' + ':3000',
    'project': '监利至江陵高速公路',
    'roles': {
        '行业主管': 'admin',
        '安全管理': 'manager',
        '一线员工': 'normal'
    }
})

.config(['$httpProvider',function ($httpProvider) {
    $httpProvider.defaults.withCredentials = true;
 }]) 

// 注册路由
.config(["$stateProvider", "$urlRouterProvider", "$compileProvider", "$locationProvider", function($stateProvider, $urlRouterProvider, $compileProvider, $locationProvider) {

    // $locationProvider.html5Mode(true);
    $locationProvider.hashPrefix('!');

    // 设置默认路由
    $urlRouterProvider.otherwise('welcome');

    // 条件路由
    $stateProvider

    // 首页，用户类型
    .state('welcome', {
        url: '/welcome',
        templateUrl: 'templates/welcome.html',
        controller: 'WelcomeCtrl',
        resolve: {
            user: ["AuthService", function (AuthService) {
                return AuthService.getUser();
            }]
        }
    })

    // 安全管理抽象页，用于数据共享
    .state('manager', {
        url: '/manager',
        abstract: true,
        template: "<ui-view></ui-view>",
        resolve: {
        }
    })

    // 用户登录
    .state('manager.login', {
        url: '/login',
        templateUrl: 'templates/manager/login.html',
        controller: 'ManagerLoginCtrl',
        resolve: {
            projects: ["ProjectService", function (ProjectService) {
                return ProjectService.find();
            }]
        }
    })

    // 用户主面板
    .state('manager.dashboard', {
        url: '/dashboard/:userId',
        templateUrl: 'templates/manager/dashboard.html',
        controller: 'ManagerDashboardCtrl',
        resolve: {
            resolveUser: ["AuthService", function (AuthService) {
                return AuthService.getUser();
            }]
        }
    })

    // 安全检查抽象页，用于数据共享
    .state('check', {
        url: '/check',
        abstract: true,
        template: "<ui-view></ui-view>",
        resolve: {
            resolveUser: ["AuthService", function (AuthService) {
                return AuthService.getUser();
            }]
        }
    })

    // 创建监督检查
    .state('check.create', {
        url: '/create',
        templateUrl: 'templates/check/create.html',
        controller: 'CheckCreateCtrl'
    })

    // 监督检查详情 
    .state('check.detail', {
        url: '/:checkId',
        templateUrl: 'templates/check/detail.html',
        controller: 'CheckDetailCtrl'
    })

    // 考核列表页
    .state('check.table', {
        url: "/table/:tableId",
        templateUrl: "templates/check/table.html",
        controller: 'CheckTableCtrl'
    })

    // 考核单项页
    .state('check.review', {
        url: "/table/:tableId/:itemId/:subItemId",
        templateUrl: "templates/check/review.html",
        controller: 'CheckReviewCtrl'
    })

    // 下达整改通知书 
    .state('check.criterion', {
        url: '/:checkId/criterion',
        templateUrl: 'templates/check/criterion.html',
        controller: 'CheckCriterionCtrl'
    })

    // 整改提交 
    .state('check.rectification', {
        url: '/:checkId/rectification',
        templateUrl: 'templates/check/rectification.html',
        controller: 'CheckRectificationCtrl'
    })

    // 用户联系方式
    .state('contact', {
        url: "/contact/:userId",
        templateUrl: "templates/contact.html",
        controller: 'ContactCtrl',
    })

    // 考核评价抽象页，用于数据共享
    .state('evaluation', {
        url: '/evaluation',
        abstract: true,
        template: "<ui-view></ui-view>",
        resolve: {
            resolveUser: ["AuthService", function (AuthService) {
                return AuthService.getUser();
            }]
        }
    })

    // 创建建设单位选择页
    .state('evaluation.list', {
        url: '/list',
        templateUrl: 'templates/evaluation/list.html',
        controller: 'EvaluationListCtrl'
    })

    // 创建建设单位选择页
    .state('evaluation.create', {
        url: '/create',
        templateUrl: 'templates/evaluation/create.html',
        controller: 'EvaluationCreateCtrl'
    })

    // 创建建设单位选择页
    .state('evaluation.detail', {
        url: '/:evaluationId',
        templateUrl: 'templates/evaluation/detail.html',
        controller: 'EvaluationDetailCtrl'
    })

    // 日常安全检查汇总页
    .state('evaluation.summary', {
        url: '/:evaluationId/summary',
        templateUrl: 'templates/evaluation/summary.html',
        controller: 'EvaluationSummaryCtrl'
    })

    // 考核评价推荐内容 
    .state('evaluation.generate', {
        url: '/:evaluationId/generate',
        templateUrl: 'templates/evaluation/generate.html',
        controller: 'EvaluationGenerateCtrl'
    })

    // 考核评价表单 
    .state('evaluation.table', {
        url: '/:evaluationId/table',
        templateUrl: 'templates/evaluation/table.html',
        controller: 'EvaluationTableCtrl'
    })

    // 考核评价单项页
    .state('evaluation.review', {
        url: "/evaluation/:evaluationId/:tableId/:itemId/:subItemId",
        templateUrl: "templates/evaluation/review.html",
        controller: 'EvaluationReviewCtrl'
    });

    // 设置image url白名单，否则AngularJS解析URL错误
    $compileProvider.imgSrcSanitizationWhitelist(/^\s*(https?|file|blob|cdvfile|content):|data:image\//);
    $compileProvider.aHrefSanitizationWhitelist(/^\s*(https?|file|blob|cdvfile|content|sms|smsto|tel|mailto):|data:image\//);
}]);

app.controller('ContactCtrl', ["$scope", "$stateParams", "UserService", function($scope, $stateParams, UserService) {
    var userId = $stateParams.userId;

    UserService.findById(userId).then(function(user) {
        $scope.name = user.name;
        $scope.tel = user.tel;
        $scope.mobile = user.mobile;
    });

}]);

app.controller('WelcomeCtrl', ["$scope", "$ionicPopup", "$state", "$stateParams", "settings", "user", function($scope, $ionicPopup, $state, $stateParams, settings, user) {
    $scope.data = {};
    $scope.data.server = settings.baseUrl;

    // 用户session判断，自动跳转
    if (user && user.role && user.role.name) {
        $state.go([settings.roles[user.role.name], 'dashboard'].join('.'), {
            userId: user._id
        });
    }

    $scope.setServerAddr = function() {
        var popup = $ionicPopup.show({
            template: '<input type="text" ng-model="data.server">',
            title: '输入服务器地址：',
            scope: $scope,
            buttons: [{
                text: '取消'
            }, {
                text: '<b>保存</b>',
                type: 'button-positive',
                onTap: function(e) {
                    if (!$scope.data.server) {
                        e.preventDefault();
                    } else {
                        return $scope.data.server;
                    }
                }
            }, ]
        });

        popup.then(function(server) {
            if (!server) return;

            settings.baseUrl = server;
        });
    };

}]);
app.filter('rotate', function() {
    return function(input) {
        if (input) {
            return '0deg';
        }

        return '90deg';
    };
});
app.filter('score', function() {
    return function(input) {
        input = parseFloat(input);

        if (input > 70) {
            return '达标';
        } else {
            return '不达标';
        }
    };
});
app.factory('AuthService', ["$http", "$q", "$window", "settings", function($http, $q, $window, settings) {
    var user;

    if ($window.sessionStorage["user"]) {
        user = JSON.parse($window.sessionStorage["user"]);
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
                        $window.sessionStorage["user"] = JSON.stringify(data.user);
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
                        $window.sessionStorage["user"] = JSON.stringify(data.user);
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

            $http.post(settings.baseUrl + '/logout')
                .success(function(data) {
                    if (data.code > 0) {
                        deferred.reject(data.message);
                    } else {
                        user = null;
                        $window.sessionStorage["user"] = null;
                        deferred.resolve(data.user);
                    }
                })
                .error(function(err) {
                    deferred.reject(err);
                });

            return deferred.promise;
        },
        getUser: function () {
            console.log('session user', user);
            return user;
        }
    };
}]);
app.factory('CheckService', ["$http", "$q", "settings", function($http, $q, settings) {
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
        create: function(form) {
            var deferred = $q.defer();

            $http.post(settings.baseUrl + '/check/create', form)
                .success(function(data) {
                    if (data.code > 0) {
                        deferred.reject(data.message);
                    } else {
                        deferred.resolve(data.check);
                    }
                })
                .error(function(err) {
                    deferred.reject(err);
                });

            return deferred.promise;
        },
        forward: function(checkId, nextUserId, rectificationCriterion) {
            var deferred = $q.defer();

            $http.post(settings.baseUrl + '/check/' + checkId + '/forward', {
                    next_user_id: nextUserId,
                    rectification_criterion: rectificationCriterion  
                })
                .success(function(data) {
                    if (data.code > 0) {
                        deferred.reject(data.message);
                    } else {
                        deferred.resolve(data.check);
                    }
                })
                .error(function(err) {
                    deferred.reject(err);
                });

            return deferred.promise;
        },
        backward: function (checkId, rectificationResult) {
            var deferred = $q.defer();

            $http.post(settings.baseUrl + '/check/' + checkId + '/backward', {
                    rectification_result: rectificationResult  
                })
                .success(function(data) {
                    if (data.code > 0) {
                        deferred.reject(data.message);
                    } else {
                        deferred.resolve(data.check);
                    }
                })
                .error(function(err) {
                    deferred.reject(err);
                });

            return deferred.promise;
        },
        end: function (checkId) {
            var deferred = $q.defer();

            $http.post(settings.baseUrl + '/check/' + checkId + '/end', {
                })
                .success(function(data) {
                    if (data.code > 0) {
                        deferred.reject(data.message);
                    } else {
                        deferred.resolve(data.check);
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
    };
}]);

app.factory('EvaluationService', ["$http", "$q", "settings", function($http, $q, settings) {
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
        }
    };
}]);
app.factory('ProjectService', ["$http", "$q", "settings", function($http, $q, settings) {
    return {
        find: function() {
            var deferred = $q.defer();

            $http.get(settings.baseUrl + '/projects/all')
                .success(function(data) {
                    deferred.resolve(data.projects);
                })
                .error(function(err) {
                    deferred.reject(err);
                });

            return deferred.promise;
        },
        findById: function(projectId) {
            var deferred = $q.defer();

            $http.get(settings.baseUrl + '/project/' + projectId)
                .success(function(data) {
                    if (data.error) {
                        deferred.reject(data.error);
                    } else {
                        deferred.resolve(data.project);                    
                    }
                })
                .error(function(err) {
                    deferred.reject(err);
                });

            return deferred.promise;
        }
    };
}]);

app.factory('SegmentService', ["$http", "$q", "settings", function($http, $q, settings) {
    return {
        find: function() {
            var deferred = $q.defer();

            $http.get(settings.baseUrl + '/segments/all')
                .success(function(data) {
                    deferred.resolve(data.segments);
                })
                .error(function(err) {
                    deferred.reject(err);
                });

            return deferred.promise;
        },
        findById: function(segmentId) {
            var deferred = $q.defer();

            $http.get(settings.baseUrl + '/segment/' + segmentId)
                .success(function(data) {
                    deferred.resolve(data.segment);
                })
                .error(function(err) {
                    deferred.reject(err);
                });

            return deferred.promise;
        },
        findByProjectId: function(projectId) {
            var deferred = $q.defer();

            $http.get(settings.baseUrl + '/project/' + projectId + '/segments')
                .success(function(data) {
                    deferred.resolve(data.segments);
                })
                .error(function(err) {
                    deferred.reject(err);
                });

            return deferred.promise;
        },
        findByUnitId: function(unitId) {
            var deferred = $q.defer();

            $http.get(settings.baseUrl + '/unit/' + unitId + '/segments')
                .success(function(data) {
                    deferred.resolve(data.segments);
                })
                .error(function(err) {
                    deferred.reject(err);
                });

            return deferred.promise;
        }
    };
}]);

app.factory('TableService', ["$http", "$q", "settings", function($http, $q, settings) {
    return {
        findById: function(tableId) {
            var deferred = $q.defer();

            $http.get(settings.baseUrl + '/table/' + tableId)
                .success(function(data) {
                    deferred.resolve(data.table);
                })
                .error(function(err) {
                    deferred.reject(err);
                });

            return deferred.promise;
        },
        update: function(tableId, table) {
            var deferred = $q.defer();

            $http.post(settings.baseUrl + '/table/' + tableId + '/update', {
                    table_id: tableId,
                    table: JSON.stringify(table)
                })
                .success(function(data) {
                    if (data.code > 0) {
                        deferred.reject(data.message);
                    } else {
                        deferred.resolve(data.table);
                    }
                })
                .error(function(err) {
                    deferred.reject(err);
                });

            return deferred.promise;
        },
    };
}]);
app.factory('UnitService', ["$http", "$q", "settings", function($http, $q, settings) {
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
}]);

app.factory('UserService', ["$http", "$q", "settings", function($http, $q, settings) {
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
        }
    };
}]);

app.controller('CheckCreateCtrl', ["$scope", "$rootScope", "$state", "$stateParams", "settings", "ProjectService", "SegmentService", "UserService", "CheckService", "AuthService", "resolveUser", function($scope, $rootScope, $state, $stateParams, settings, ProjectService, SegmentService, UserService, CheckService, AuthService, resolveUser) {
    $scope.data = {};
    $scope.data.user = resolveUser;
    $scope.data.segments = [];

    // 用户登录状态异常控制
    if (!$scope.data.user) {
        alert('用户登录状态异常');
        AuthService.logout().then(function () {
            $state.go('welcome');
        });
    }

    SegmentService.findByProjectId($scope.data.user.segment.project).then(function (segments) {
        $scope.data.segments = $scope.data.segments.concat(segments);
    });

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
            project: $scope.data.user.segment.project,
            segment: ($scope.data.place || $scope.data.branch || $scope.data.section)['_id'],
            file: $scope.data.file,
            check_target: $scope.data.check_target
        }).then(function(check) {
            $state.go('^.table', {
                tableId: check.table
            });
        }, function (err) {
            alert(err);
        });
    };

    $scope.toBack = function () {
        $state.go([settings.roles[$scope.data.user.role.name], 'dashboard'].join('.'), {
            userId: $scope.data.user._id
        });
    };
}]);
app.controller('CheckCriterionCtrl', ["$scope", "$rootScope", "$state", "$stateParams", "settings", "ProjectService", "SegmentService", "UserService", "CheckService", "AuthService", "resolveUser", function($scope, $rootScope, $state, $stateParams, settings, ProjectService, SegmentService, UserService, CheckService, AuthService, resolveUser) {
    $scope.data = {};
    $scope.data.user = resolveUser;
    $scope.data.check = {};
    $scope.data.checkId = $stateParams.checkId;
    $scope.data.users = [];

    UserService.find().then(function (users) {
        $scope.data.users = $scope.data.users.concat(users);
    });

    CheckService.findById($scope.data.checkId).then(function(check) {
        $scope.data.check = check;

        // var rectifications = [];

        // angular.forEach(check.table.items, function(level1) {
        //     angular.forEach(level1.items, function(level2) {
        //         angular.forEach(level2.items, function(level3) {
        //             if (level3.status && level3.score > 0) {
        //                 rectifications.push({
        //                     name: level3.name,
        //                     image_url: level3.image_url
        //                 });
        //             }
        //         });
        //     });
        // });

        // $scope.data.rectifications = rectifications;
    });

    $scope.toBack = function() {
        $state.go([settings.roles[$scope.data.user.role.name], 'dashboard'].join('.'), {
            userId: $scope.data.user._id
        });
    };

    $scope.toForward = function() {
        if (!$scope.data.nextUserId) {
            alert('请选择整改责任人');
            return;
        }

        if (!$scope.data.check.rectification_criterion) {
            alert('请填写整改要求');
            return;
        }

        CheckService.forward($scope.data.checkId, $scope.data.nextUserId, $scope.data.check.rectification_criterion).then(function(check) {
            alert("下达完毕");
            $state.go([settings.roles[$scope.data.user.role.name], 'dashboard'].join('.'), {
                userId: $scope.data.user._id
            });
        }, function(err) {
            alert(err); 
        });
    };

}]);
app.controller('CheckDetailCtrl', ["$scope", "$rootScope", "$state", "$stateParams", "$ionicPopup", "settings", "ProjectService", "SegmentService", "UserService", "CheckService", "AuthService", "resolveUser", function($scope, $rootScope, $state, $stateParams, $ionicPopup, settings, ProjectService, SegmentService, UserService, CheckService, AuthService, resolveUser) {
    $scope.data = {};
    $scope.data.check = {};
    $scope.data.user = resolveUser;
    $scope.data.checkId = $stateParams.checkId;

    CheckService.findById($scope.data.checkId).then(function(check) {
        $scope.data.check = check;

        // var rectifications = [];

        // angular.forEach(check.table.items, function(level1) {
        //     angular.forEach(level1.items, function(level2) {
        //         angular.forEach(level2.items, function(level3) {
        //             if (level3.status && level3.score > 0) {
        //                 rectifications.push({
        //                     name: level3.name,
        //                     image_url: level3.image_url
        //                 });
        //             }
        //         });
        //     });
        // });

        // $scope.data.rectifications = rectifications;
    });

    $scope.toBack = function() {
        $state.go([settings.roles[$scope.data.user.role.name], 'dashboard'].join('.'), {
            userId: $scope.data.user._id
        });
    };

    $scope.toTable = function() {
        $state.go('^.table', {
            tableId: $scope.data.check.table._id
        });
    };

    $scope.toCriterion = function() {
        $state.go('^.criterion', {
            checkId: $scope.data.check._id
        });
    };

    $scope.toRectification = function () {
        $state.go('^.rectification', {
            checkId: $scope.data.check._id
        });
    };

    $scope.backward = function() {
        CheckService.backward($scope.data.checkId, $scope.data.check.rectification_result).then(function(check) {
            alert("整改提交完毕");
            $state.go([settings.roles[$scope.data.user.role.name], 'dashboard'].join('.'), {
                userId: $scope.data.user._id
            });
        }, function(err) {
            alert(err); 
        });
    };

    $scope.end = function () {
        var confirmPopup = $ionicPopup.confirm({
            title: '整改验收',
            template: '安全整改验收是否通过？',
            buttons: [{
                text: '不通过',
                type: 'button-default'
            }, {
                text: '通过',
                type: 'button-positive',
                onTap: function(e) {
                    return true;
                }
            }]
        });

        confirmPopup.then(function(res) {
            if (res) {
                CheckService.end($scope.data.checkId).then(function(check) {
                    alert('整改验收完毕，本次安全检查结束。');
                    $state.go([settings.roles[$scope.data.user.role.name], 'dashboard'].join('.'), {
                        userId: $scope.data.user._id
                    });
                }, function (err) {
                    alert(err);
                });
            }
        });
    };


}]);
app.controller('CheckRectificationCtrl', ["$scope", "$rootScope", "$state", "$stateParams", "settings", "ProjectService", "SegmentService", "UserService", "CheckService", "AuthService", "resolveUser", function($scope, $rootScope, $state, $stateParams, settings, ProjectService, SegmentService, UserService, CheckService, AuthService, resolveUser) {
    $scope.data = {};
    $scope.data.user = resolveUser;
    $scope.data.check = {};
    $scope.data.checkId = $stateParams.checkId;

    CheckService.findById($scope.data.checkId).then(function(check) {
        $scope.data.check = check;

        // var table = check.table,
        //     rectifications = [];

        // angular.forEach(table.items, function(level1) {
        //     angular.forEach(level1.items, function(level2) {
        //         angular.forEach(level2.items, function(level3) {
        //             if (level3.status && level3.score > 0) {
        //                 rectifications.push({
        //                     name: level3.name,
        //                     image_url: level3.image_url
        //                 });
        //             }
        //         });
        //     });
        // });

        // $scope.data.rectifications = rectifications;
    });

    $scope.toBack = function() {
        $state.go('^.detail', {
            checkId: $scope.data.checkId
        });
    };

    $scope.toBackward = function() {
        if (!$scope.data.check.rectification_result) {
            alert('请填写整改情况');
            return;
        }

        CheckService.backward($scope.data.checkId, $scope.data.check.rectification_result).then(function(check) {
            alert("整改提交完毕");
            $state.go([settings.roles[$scope.data.user.role.name], 'dashboard'].join('.'), {
                userId: $scope.data.user._id
            });
        }, function(err) {
            alert(err); 
        });
    };

}]);
app.controller('CheckReviewCtrl', ["$scope", "$stateParams", "$state", "settings", "TableService", "AuthService", "resolveUser", function($scope, $stateParams, $state, settings, TableService, AuthService, resolveUser) {
    $scope.data = {};
    $scope.data.user = resolveUser;
    $scope.data.table = {};
    $scope.data.tableId = $stateParams.tableId;
    $scope.data.itemId = $stateParams.itemId;
    $scope.data.subItemId = $stateParams.subItemId;

    // 用户登录状态异常控制
    if (!$scope.data.user) {
        alert('用户登录状态异常');
        AuthService.logout().then(function () {
            $state.go('welcome');
        });
    }

    TableService.findById($scope.data.tableId).then(function(table) {
        $scope.data.table = table;

        angular.forEach(table.items, function(item, key) {
            if (item.index === $scope.data.itemId) {
                angular.forEach(item.items, function(subitem, key) {
                    if (subitem.index === $scope.data.subItemId) {
                        $scope.data.review = subitem;
                        return;
                    }
                });
            }
        });
    });

    $scope.changeScore = function(item, score) {
        if (score > 0) {
            item.status = 'FAIL';
        } else if (score === 0) {
            item.status = 'PASS';
        } else {
            item.status = 'UNCHECK';
        }
    };

    $scope.takePhoto = function(item) {
        function onSuccess(imageURI) {
            item.image_url = imageURI;
            $scope.$apply();
        }

        function onFail(message) {}

        navigator.camera.getPicture(onSuccess, onFail, {
            quality: 75,
            destinationType: Camera.DestinationType.FILE_URI,
            saveToPhotoAlbum: true
        });
    };

    $scope.saveAndReturn = function() {
        TableService.update($scope.data.tableId, $scope.data.table).then(function(table) {
            $state.go('^.table', {
                tableId: $scope.data.tableId
            });
        }, function(err) {
            alert(err);
        });
    };
}]);
app.controller('CheckTableCtrl', ["$scope", "$stateParams", "$state", "settings", "TableService", "AuthService", "resolveUser", function($scope, $stateParams, $state, settings, TableService, AuthService, resolveUser) {
    $scope.data = {};
    $scope.data.user = resolveUser;
    $scope.data.table = {};
    $scope.data.tableId = $stateParams.tableId;

    // 用户登录状态异常控制
    if (!$scope.data.user) {
        alert('用户登录状态异常');
        AuthService.logout().then(function () {
            $state.go('welcome');
        });
    }

    $scope.ifHideSubItems = {};

    TableService.findById($scope.data.tableId).then(function(table) {
        $scope.data.table = table;
    });

    $scope.toggle = function(index, item) {
        if ($scope.ifHideSubItems[item.index] === undefined) {
            $scope.ifHideSubItems[item.index] = true;
        } else {
            $scope.ifHideSubItems[item.index] = !$scope.ifHideSubItems[item.index];
        }
    };

    $scope.review = function(index, item, subItem) {
        $state.go("^.review", {
            tableId: $scope.data.tableId,
            itemId: item.index,
            subItemId: subItem.index
        });
    };

    $scope.toBack = function () {
        $state.go([settings.roles[$scope.data.user.role.name], 'dashboard'].join('.'), {
            userId: $scope.data.user._id
        });
    };
}]);

app.controller('EvaluationCreateCtrl', ["$scope", "$rootScope", "$state", "$stateParams", "settings", "ProjectService", "SegmentService", "UserService", "UnitService", "CheckService", "EvaluationService", "AuthService", "resolveUser", function($scope, $rootScope, $state, $stateParams, settings, ProjectService, SegmentService, UserService, UnitService, CheckService, EvaluationService, AuthService, resolveUser) {
    $scope.data = {};
    $scope.data.user = resolveUser;

    // 用户登录状态异常控制
    if (!$scope.data.user) {
        alert('用户登录状态异常');
        AuthService.logout().then(function () {
            $state.go('welcome');
        });
    }

    if ($scope.data.user.segment) {
        ProjectService.findById($scope.data.user.segment.project).then(function (project) {
            $scope.data.project = project;
        });
    }

    $scope.$watch('data.project', function() {
        if (!$scope.data.project) return;

        if ($scope.data.user.unit && $scope.data.user.unit.type === '施工单位') {
            $scope.data.unit = $scope.data.user.unit;
        } else {
            $scope.data.units = [];
            UnitService.findByProjectId($scope.data.project._id).then(function (units) {
                angular.forEach(units, function (value) {
                    if (value.type === '施工单位') {
                        $scope.data.units.push(value);
                    }
                });
            });
        }
    });

    $scope.$watch('data.unit', function() {
        if (!$scope.data.unit) return;

        $scope.data.sections = [];
        SegmentService.findByUnitId($scope.data.unit._id).then(function (segments) {
            angular.forEach(segments, function (value) {
                if (value.type === '标段') {
                    $scope.data.sections.push(value);
                }
            });
        });
    });

    $scope.$watch('data.section', function() {
        if (!$scope.data.section) return;

        $scope.data.branches = [];
        SegmentService.findById($scope.data.section._id).then(function (segment) {
            angular.forEach(segment.segments, function (value) {
                if (value.type === '分部') {
                    $scope.data.branches.push(value);
                }
            });
        });
    });

    $scope.changeProject = function (project) {
        $scope.data.project = project;
    };
    $scope.changeUnit = function (unit) {
        $scope.data.unit = unit;
    };
    $scope.changeSection = function (section) {
        $scope.data.section = section;
    };
    $scope.changeBranch = function (branch) {
        $scope.data.branch = branch;
    };

    $scope.toCreate = function () {
        if (!$scope.data.project) {
            alert('请选择考核项目');
            return;
        }

        if (!$scope.data.unit) {
            alert('请选择考核单位');
            return;
        }

        if (!$scope.data.section && !$scope.data.branch) {
            alert('请选择合同段或分部');
            return;
        }

        EvaluationService.create({
            project: $scope.data.user.segment.project,
            segment: ($scope.data.branch || $scope.data.section)['_id'],
            unit: $scope.data.unit._id
        }).then(function(evaluation) {
            $state.go('^.summary', {
                evaluationId: evaluation._id
            });
        }, function(err) {
            alert(err);
        });
    };
    
    $scope.toBack = function () {
        $state.go([settings.roles[$scope.data.user.role.name], 'dashboard'].join('.'), {
            userId: $scope.data.user._id
        });
    };
}]);
app.controller('EvaluationDetailCtrl', ["$scope", "$rootScope", "$state", "$stateParams", "settings", "ProjectService", "SegmentService", "UserService", "UnitService", "CheckService", "EvaluationService", "AuthService", "resolveUser", function($scope, $rootScope, $state, $stateParams, settings, ProjectService, SegmentService, UserService, UnitService, CheckService, EvaluationService, AuthService, resolveUser) {
    $scope.data = {};
    $scope.data.user = resolveUser;
    $scope.data.evaluation = {};
    $scope.data.evaluationId = $stateParams.evaluationId;

    EvaluationService.findById($scope.data.evaluationId).then(function(evaluation) {
        $scope.data.evaluation = evaluation;
    });

    $scope.toBack = function () {
        $state.go([settings.roles[$scope.data.user.role.name], 'dashboard'].join('.'), {
            userId: $scope.data.user._id
        });
    };

    $scope.toDetail = function (item) {
        $state.go('^.detail', {
            evaluationId: item._id 
        });
    };

}]);
app.controller('EvaluationGenerateCtrl', ["$scope", "$rootScope", "$state", "$stateParams", "settings", "ProjectService", "SegmentService", "UserService", "UnitService", "CheckService", "EvaluationService", "AuthService", "resolveUser", function($scope, $rootScope, $state, $stateParams, settings, ProjectService, SegmentService, UserService, UnitService, CheckService, EvaluationService, AuthService, resolveUser) {
    $scope.data = {};
    $scope.data.user = resolveUser;
    $scope.data.evaluation = {};
    $scope.data.evaluationId = $stateParams.evaluationId;

    EvaluationService.findById($scope.data.evaluationId).then(function(evaluation) {
        $scope.data.evaluation = evaluation;

        var project = evaluation.project._id,
            segment = evaluation.segment._id,
            today = new Date(),
            start_date = evaluation.evaluation_date_before ? new Date(evaluation.evaluation_date_before) : new Date(today.setMonth(today.getMonth() - 1)),
            end_date = new Date();

            start_date = [start_date.getFullYear(), start_date.getMonth() + 1, start_date.getDate()].join('-');
            end_date = [end_date.getFullYear(), end_date.getMonth() + 1, end_date.getDate() + 1].join('-');

        var current_unit = $scope.data.user.unit,
            checked = [],
            reLink = /(SGJC|SGXCTY|SGXCGL|SGXCSY)-([A-Z])-([A-Z][0-9]+)-([0-9])+/,
            matches = null;
        CheckService.list(project, segment, start_date, end_date).then(function (checks) {
            $scope.data.checks = checks;

            angular.forEach(checks, function (check) {
                if (check.checked && check.check_user.unit._id === current_unit._id) {
                    angular.forEach(check.checked, function (item) {
                        if (item.status !== 'UNCHECK' && item.link !== '') {
                            matches = item.link.match(reLink);

                            item.link = {};
                            item.link.file = matches[1];
                            item.link.level1 = matches[2];
                            item.link.level2 = matches[3];
                            item.link.level3 = matches[4];

                            item.check_date = check.check_date;

                            checked.push(item);
                        }
                    });
                }
            });

            var table, level1, level2, level3;
            angular.forEach(checked, function (item) {
                table = find($scope.data.evaluation.tables, {
                    key: 'file',
                    value: item.link.file
                });

                if (!table) return;

                level1 = find(table.items, {
                    key: 'index',
                    value: item.link.level1
                });

                if (!level1) return;

                level2 = find(level1.items, {
                    key: 'index',
                    value: item.link.level2
                });

                if (!level2) return;

                level3 = find(level2.items, {
                    key: 'index',
                    value: item.link.level3
                });

                if (!level3) return;

                level2.is_checked = true; // 标识是否已检查过
                level2.is_selected = true; // 标识是否选中
                level3.is_checked = true;
                level3.checked = level3.checked || [];
                level3.checked.push(item);
            });

            angular.forEach($scope.data.evaluation.tables, function (table) {
                angular.forEach(table.items, function(level1) {
                    angular.forEach(level1.items, function(level2) {
                        angular.forEach(level2.items, function(level3) {
                            var pass = 0,
                                fail = 0, 
                                last_pass = true;

                            if (level3.is_checked && level3.checked) {
                                level3.checked.sort(function compareDate(a, b) {
                                    return a.check_date - b.check_date;
                                });

                                if (level3.checked[0]['score'] === '0') { // 最近一次合格
                                    last_pass = true;
                                } else if (level3.checked[0]['score'] === '1') { // 最近一次不合格
                                    last_pass = false;
                                }

                                angular.forEach(level3.checked, function (item) {
                                    if (item.score === '0') {
                                        pass += 1;
                                    } else if (item.score === '1') {
                                        fail += 1;
                                    }
                                });

                                if (last_pass) {
                                    level3.score = Math.floor(level3.range[level3.range.length - 1] * pass / (pass + fail));
                                } else {
                                    level3.score = level3.range[level3.range.length - 1];
                                }

                                if (level3.score === 0) {
                                    level3.status = 'PASS';
                                } else {
                                    level3.status = 'FAIL';
                                }

                                // console.log(last_pass, pass, fail);
                                // console.log(level3.range);
                                // console.log(level3.score);
                            }
                        });
                    });
                });
            });

            console.log(checked);
            console.log($scope.data.evaluation.tables);
        });
    });

    function find(collections, condition) {
        if (collections.length === 0) return;

        var found;
        angular.forEach(collections, function(item) {
            if (item[condition.key] === condition.value) {
                found = item;
                return found;
            }
        });

        return found;
    } 

    $scope.onlySelected = false;
    $scope.toggleSelected = function() {
        $scope.onlySelected = !$scope.onlySelected;
    };

    $scope.toBack = function () {
        $state.go([settings.roles[$scope.data.user.role.name], 'dashboard'].join('.'), {
            userId: $scope.data.user._id
        });
    };

    $scope.toTable = function () {
        EvaluationService.update($scope.data.evaluation._id, $scope.data.evaluation).then(function(table) {
            alert('确认成功');
            $state.go('^.table', {
                evaluationId: $scope.data.evaluation._id 
            });
        }, function(err) {
            alert(err);
        });
        
    };

}]);
app.controller('EvaluationListCtrl', ["$scope", "$rootScope", "$state", "$stateParams", "settings", "ProjectService", "SegmentService", "UserService", "UnitService", "CheckService", "EvaluationService", "AuthService", "resolveUser", function($scope, $rootScope, $state, $stateParams, settings, ProjectService, SegmentService, UserService, UnitService, CheckService, EvaluationService, AuthService, resolveUser) {
    $scope.data = {};
    $scope.data.user = resolveUser;
    $scope.data.evaluations = [];

    EvaluationService.findByUserId($scope.data.user._id).then(function(evaluations) {
        $scope.data.evaluations = evaluations;
    });

    $scope.toBack = function () {
        $state.go([settings.roles[$scope.data.user.role.name], 'dashboard'].join('.'), {
            userId: $scope.data.user._id
        });
    };

    $scope.toDetail = function (item) {
        $state.go('^.detail', {
            evaluationId: item._id 
        });
    };

    $scope.toSummary = function (item) {
        $state.go('^.summary', {
            evaluationId: item._id 
        });
    };

    $scope.toCreate = function () {
        $state.go('^.create');
    };

}]);
app.controller('EvaluationReviewCtrl', ["$scope", "$stateParams", "$state", "settings", "TableService", "AuthService", "resolveUser", function($scope, $stateParams, $state, settings, TableService, AuthService, resolveUser) {
    $scope.data = {};
    $scope.data.user = resolveUser;
    $scope.data.table = {};
    $scope.data.evaluationId = $stateParams.evaluationId;
    $scope.data.tableId = $stateParams.tableId;
    $scope.data.itemId = $stateParams.itemId;
    $scope.data.subItemId = $stateParams.subItemId;

    // 用户登录状态异常控制
    if (!$scope.data.user) {
        alert('用户登录状态异常');
        AuthService.logout().then(function () {
            $state.go('welcome');
        });
    }

    TableService.findById($scope.data.tableId).then(function(table) {
        $scope.data.table = table;

        angular.forEach(table.items, function(item, key) {
            if (item.index === $scope.data.itemId) {
                angular.forEach(item.items, function(subitem, key) {
                    if (subitem.index === $scope.data.subItemId) {
                        $scope.data.review = subitem;
                        return;
                    }
                });
            }
        });
    });

    $scope.changeScore = function(item, score) {
        if (score > 0) {
            item.status = 'FAIL';
        } else if (score === 0) {
            item.status = 'PASS';
        } else {
            item.status = 'UNCHECK';
        }
    };

    $scope.takePhoto = function(item) {
        function onSuccess(imageURI) {
            item.image_url = imageURI;
            $scope.$apply();
        }

        function onFail(message) {}

        navigator.camera.getPicture(onSuccess, onFail, {
            quality: 75,
            destinationType: Camera.DestinationType.FILE_URI,
            saveToPhotoAlbum: true
        });
    };

    $scope.saveAndReturn = function() {
        TableService.update($scope.data.tableId, $scope.data.table).then(function(table) {
            $state.go('^.table', {
                evaluationId: $scope.data.evaluationId
            });
        }, function(err) {
            alert(err);
        });
    };
}]);
app.controller('EvaluationSummaryCtrl', ["$scope", "$rootScope", "$state", "$stateParams", "settings", "ProjectService", "SegmentService", "UserService", "UnitService", "CheckService", "EvaluationService", "AuthService", "resolveUser", function($scope, $rootScope, $state, $stateParams, settings, ProjectService, SegmentService, UserService, UnitService, CheckService, EvaluationService, AuthService, resolveUser) {
    $scope.data = {};
    $scope.data.user = resolveUser;
    $scope.data.evaluation = {};
    $scope.data.evaluationId = $stateParams.evaluationId;

    EvaluationService.findById($scope.data.evaluationId).then(function(evaluation) {
        $scope.data.evaluation = evaluation;
        console.log(evaluation);
        var project = evaluation.project._id,
            segment = evaluation.segment._id,
            today = new Date(),
            start_date = evaluation.evaluation_date_before ? new Date(evaluation.evaluation_date_before) : new Date(today.setMonth(today.getMonth() - 1)),
            end_date = new Date();

            start_date = [start_date.getFullYear(), start_date.getMonth() + 1, start_date.getDate()].join('-');
            end_date = [end_date.getFullYear(), end_date.getMonth() + 1, end_date.getDate()].join('-');

        CheckService.list(project, segment, start_date, end_date).then(function (checks) {
            $scope.data.checks = checks;

            var scores = {
                '施工单位': 0,
                '监理单位': 0,
                '建设单位': 0,
                '政府部门': 0
            };
            angular.forEach(checks, function (check) {
                if (check.checked) {
                    angular.forEach(check.checked, function (item) {
                        if (item.status === 'FAIL') {
                            scores[check.check_user.unit.type] += parseInt(item.score, 10);
                        }
                    });
                }
            });

            $scope.data.scores = scores;
        });
    });



    $scope.toBack = function () {
        $state.go([settings.roles[$scope.data.user.role.name], 'dashboard'].join('.'), {
            userId: $scope.data.user._id
        });
    };

    $scope.toGenerate = function () {
        $state.go('^.generate', {
            evaluationId: $scope.data.evaluation._id
        });
    };

}]);
app.controller('EvaluationTableCtrl', ["$scope", "$stateParams", "$state", "settings", "TableService", "EvaluationService", "AuthService", "resolveUser", function($scope, $stateParams, $state, settings, TableService, EvaluationService, AuthService, resolveUser) {
    $scope.data = {};
    $scope.data.user = resolveUser;
    $scope.data.evaluation = {};
    $scope.data.evaluationId = $stateParams.evaluationId;

    // 用户登录状态异常控制
    if (!$scope.data.user) {
        alert('用户登录状态异常');
        AuthService.logout().then(function () {
            $state.go('welcome');
        });
    }

    EvaluationService.findById($scope.data.evaluationId).then(function(evaluation) {
        $scope.data.evaluation = evaluation;
        console.log(evaluation);
    });

    $scope.ifHideLevel2 = {};
    $scope.toggle = function(table, level1) {
        if ($scope.ifHideLevel2[table.name + level1.index] === undefined) {
            $scope.ifHideLevel2[table.name + level1.index] = true;
        } else {
            $scope.ifHideLevel2[table.name + level1.index] = !$scope.ifHideLevel2[table.name + level1.index];
        }
    };

    $scope.review = function(table, index, level1, level2) {
        $state.go("^.review", {
            evaluationId: $scope.data.evaluationId,
            tableId: table._id,
            itemId: level1.index,
            subItemId: level2.index
        });
    };

    $scope.toBack = function () {
        $state.go([settings.roles[$scope.data.user.role.name], 'dashboard'].join('.'), {
            userId: $scope.data.user._id
        });
    };

    $scope.filterFn = function (level1) {
        var filter = false;
        angular.forEach(level1.items, function(level2) {
            if (level2.is_selected) filter = true;
        });

        return filter;
    };
}]);

app.controller('ManagerDashboardCtrl', ["$scope", "$rootScope", "$state", "$stateParams", "settings", "UserService", "CheckService", "AuthService", "resolveUser", function($scope, $rootScope, $state, $stateParams, settings, UserService, CheckService, AuthService, resolveUser) {
    $scope.data = {};
    $scope.data.user = resolveUser;

    // 用户登录状态异常控制
    if (!$scope.data.user || $stateParams.userId !== $scope.data.user._id) {
        alert('用户登录状态异常');
        AuthService.logout().then(function () {
            $state.go('welcome');
        });
    }

    // 加载用户待办列表
    CheckService.findByUserId($scope.data.user._id).then(function(checks) {
        $scope.data.checks = checks;
    });

    // 加载用户所属组织的所有用户，供用户在线状态展示
    UserService.findBySegmentId($scope.data.user.segment._id).then(function (users) {
        $scope.data.segmentUsers = users;
    });

    $scope.toCheckCreate = function () {
        $state.go('check.create', {
        });
    };

    $scope.toCheckDetail = function (item) {
        $state.go('check.detail', {
            checkId: item._id
        });
    };

    $scope.toEvaluationList = function (item) {
        $state.go('evaluation.list', {

        });
    };

    $scope.logout = function () {
        AuthService.logout().then(function () {
            $state.go('welcome');
        });
    };
}]);
app.controller('ManagerLoginCtrl', ["$scope", "$rootScope", "$state", "$stateParams", "settings", "projects", "ProjectService", "SegmentService", "UnitService", "UserService", "AuthService", function($scope, $rootScope, $state, $stateParams, settings, projects, ProjectService, SegmentService, UnitService, UserService, AuthService) {
    $scope.data = {};
    $scope.data.projects = projects;

    AuthService.auth().then(function(user) {
        $state.go("^.dashboard", {
            userId: user._id,
        });
    });

    $scope.changeProject = function (project) {
        $scope.project = project;

        // SegmentService.findByProjectId(project._id).then(function(segments) {
        //     var tree = [];
        //     var roots = angular.copy(segments);

        //     function deepLoop(root, level) {
        //         tree.push({
        //             level: level,
        //             _id: root._id,
        //             name: root.name
        //         });
        //         if (root.segments) {
        //             level += 1;
        //             angular.forEach(root.segments, function(child) {
        //                 deepLoop(child, level);
        //             });
        //         }
        //     }

        //     angular.forEach(roots, function (child) {
        //         deepLoop(child, 0);
        //     });

        //     $scope.data.segments = tree;
        // });

        UnitService.findByProjectId(project._id).then(function (units) {
            console.log(units); 

            $scope.data.units = units;
        });
    };

    $scope.changeUnit = function (unit) {
        if (unit.type === '施工单位') {

        } else {

        }
    };

    $scope.filterUnitConstructor = function (unit, index) {
        return unit.type === '建设单位';
    };

    $scope.filterUnitSupervisor = function (unit, index) {
        return unit.type === '监理单位';
    };

    $scope.filterUnitBuilder = function (unit, index) {
        return unit.type === '施工单位';
    };

    $scope.changeSegment = function (segment) {
        $scope.segment = segment;

        UserService.findBySegmentId(segment._id).then(function(users) {
            $scope.data.users = users;
        });
    };

    $scope.resetSegment = function () {
        $scope.segment = null;
    };

    $scope.login = function () {
        AuthService.login($scope.data.username, $scope.data.password).then(function (user) {

            // 保存到$rootScopre, 并非特别好的方式
            $rootScope.current = {};
            $rootScope.current.project = $scope.project;
            $rootScope.current.segment = $scope.segment;
            $rootScope.current.user = user;

            $state.go("^.dashboard", {
                userId: user._id,
            });
        }, function (err) {
            alert(err);
        });
    };

}]);