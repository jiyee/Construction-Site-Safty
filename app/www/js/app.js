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
        // console.log('stateChangeSuccess', current, previous, eventObj);
    });

    $rootScope.$on("$stateChangeError", function (event, current, previous, eventObj) {
        // console.log('stateChangeError', current, previous, eventObj);
    });

    $rootScope.$on('$stateChangeStart', function (event, current, previous, eventObj) {
        // console.log('stateChangeStart', current, previous, eventObj);
    });
}])

// 注册全局变量
// 121.40.202.109
.constant('settings', {
    'baseUrl': 'http://' + '10.171.40.8' + ':3000',
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
    })

    // 行业主管抽象页，用于数据共享
    .state('administrator', {
        url: '/administrator',
        abstract: true,
        template: "<ui-view></ui-view>",
        resolve: {
        }
    })

    // 用户登录
    .state('administrator.login', {
        url: '/login',
        templateUrl: 'templates/administrator/login.html',
        controller: 'AdministratorLoginCtrl',
        resolve: {
            projects: ["ProjectService", function (ProjectService) {
                return ProjectService.find();
            }]
        }
    })

    // 行业主管主面板
    .state('administrator.dashboard', {
        url: '/dashboard/:userId',
        templateUrl: 'templates/administrator/dashboard.html',
        controller: 'AdministratorDashboardCtrl',
        resolve: {
            resolveUser: ["AuthService", function (AuthService) {
                return {
                    _id: 0,
                    name: '测试用户'
                };
                // return AuthService.getUser();
            }]
        }
    })

    // 抽查监督抽象页，用于数据共享
    .state('capture', {
        url: '/capture',
        abstract: true,
        template: "<ui-view></ui-view>",
        resolve: {
            resolveUser: ["AuthService", function (AuthService) {
                return {
                    _id: 0,
                    name: '测试用户'
                };
                // return AuthService.getUser();
            }]
        }
    })

    // 创建监督
    .state('capture.create', {
        url: '/create',
        templateUrl: 'templates/capture/create.html',
        controller: 'CaptureCreateCtrl'
    })

    // 监督检查
    .state('capture.list', {
        url: '/:captureId',
        templateUrl: 'templates/capture/list.html',
        controller: 'CaptureListCtrl'
    })
    ;

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
app.factory('AuthService', ["$rootScope", "$http", "$q", "$window", "settings", function($rootScope, $http, $q, $window, settings) {
    var project, user;

    if ($window.sessionStorage["project"]) {
        project = JSON.parse($window.sessionStorage["project"]);
        $rootScope._project = project;
    }

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
                        $window.sessionStorage["project"] = JSON.stringify($rootScope._project);
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
                        $window.sessionStorage["project"] = null;
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
app.factory('CaptureService', ["$http", "$q", "settings", function($http, $q, settings) {
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
        create: function(form) {
            var deferred = $q.defer();

            $http.post(settings.baseUrl + '/capture/create', form)
                .success(function(data) {
                    if (data.code > 0) {
                        deferred.reject(data.message);
                    } else {
                        deferred.resolve(data.capture);
                    }
                })
                .error(function(err) {
                    deferred.reject(err);
                });

            return deferred.promise;
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
app.constant('files', [{
    "index": "1.1.1.1",
    "file": "TY-LD-01",
    "name": "办公、生活区域临时用电专项安全检查表",
    "group": "1. 防电"
}, {
    "index": "1.2.1.1",
    "file": "TY-LD-02",
    "name": "施工现场临时用电专项安全检查表",
    "group": "1. 防电"
}, {
    "index": "2.1.1.1",
    "file": "TY-XF-01",
    "name": "消防安全检查表",
    "group": "2. 防火"
}, {
    "index": "3.1.1.1",
    "file": "TY-FH-01",
    "name": "临边与个体防护防护专项安全检查表",
    "group": "3. 安全防护"
}, {
    "index": "4.1.1.1",
    "file": "TY-ZC-01",
    "name": "承重支架(满堂支架、贝雷支架)基础专项施工安全检查表",
    "group": "4. 支撑体系"
}, {
    "index": "4.1.1.2",
    "file": "TY-ZC-02",
    "name": "承重支架(满堂支架、贝雷支架)搭设施工专项安全检查表",
    "group": "4. 支撑体系"
}, {
    "index": "4.1.1.3",
    "file": "TY-ZC-03",
    "name": "承重支架(满堂支架、贝雷支架)拆除施工专项安全检查表",
    "group": "4. 支撑体系"
}, {
    "index": "4.1.1.4",
    "file": "TY-ZC-04",
    "name": "脚手架施工专项安全检查表",
    "group": "4. 支撑体系"
}, {
    "index": "5.1.1.1",
    "file": "TY-JXSB-01",
    "name": "吊装工程（塔吊）专项安全检查表",
    "group": "5. 机械设备"
}, {
    "index": "5.1.1.2",
    "file": "TY-JXSB-02",
    "name": "吊装工程（汽车吊）专项安全检查表",
    "group": "5. 机械设备"
}, {
    "index": "5.1.1.3",
    "file": "TY-JXSB-03",
    "name": "吊装工程（龙门吊）专项安全检查表",
    "group": "5. 机械设备"
}, {
    "index": "5.1.1.4",
    "file": "TY-JXSB-04",
    "name": "吊装工程（缆索起重机）专项安全检查表",
    "group": "5. 机械设备"
}, {
    "index": "5.1.1.5",
    "file": "TY-JXSB-05",
    "name": "吊装工程（电梯）专项安全检查表",
    "group": "5. 机械设备"
}, {
    "index": "5.1.1.6",
    "file": "TY-JXSB-06",
    "name": "吊装工程（架桥机）专项安全检查表",
    "group": "5. 机械设备"
}, {
    "index": "5.2.1.1",
    "file": "TY-MB-01",
    "name": "滑模施工专项安全检查表",
    "group": "5. 机械设备"
}, {
    "index": "5.2.1.2",
    "file": "TY-MB-02",
    "name": "翻模施工专项安全检查表",
    "group": "5. 机械设备"
}, {
    "index": "5.2.1.3",
    "file": "TY-MB-03",
    "name": "移动模架专项安全检查表",
    "group": "5. 机械设备"
}, {
    "index": "5.2.1.4",
    "file": "TY-MB-04",
    "name": "挂篮整体专项安全检查表",
    "group": "5. 机械设备"
}, {
    "index": "5.2.1.5",
    "file": "TY-MB-05",
    "name": "挂篮移篮专项安全检查表",
    "group": "5. 机械设备"
}, {
    "index": "5.2.1.6",
    "file": "TY-MB-06",
    "name": "挂篮砼浇筑专项安全检查表",
    "group": "5. 机械设备"
}, {
    "index": "5.2.1.7",
    "file": "TY-MB-07",
    "name": "挂篮拆移专项安全检查表",
    "group": "5. 机械设备"
}, {
    "index": "6.1.1.1",
    "file": "TY-ZY-01",
    "name": "高处作业施工专项安全检查表",
    "group": "6. 施工作业"
}, {
    "index": "6.1.1.2",
    "file": "TY-ZY-02",
    "name": "深基坑现场作业专项安全检查表",
    "group": "6. 施工作业"
}, {
    "index": "6.1.1.3",
    "file": "TY-ZY-03",
    "name": "隧道爆破作业专项安全检查表",
    "group": "6. 施工作业"
}, {
    "index": "6.1.1.4",
    "file": "TY-ZY-04",
    "name": "人工挖孔桩爆破作业专项安全检查表",
    "group": "6. 施工作业"
}, {
    "index": "6.1.1.5",
    "file": "TY-ZY-05",
    "name": "高边坡爆破作业专项安全检查表",
    "group": "6. 施工作业"
}, {
    "index": "6.1.1.6",
    "file": "TY-ZY-06",
    "name": "炸药库安全专项检查表",
    "group": "6. 施工作业"
}, {
    "index": "7.1.1.1",
    "file": "TY-QX-01",
    "name": "不利气候环境专项施工安全检查表",
    "group": "7. 不利气象"
}, {
    "index": "8.1.1.1",
    "file": "ZYGL-QLLC-01",
    "name": "水上钢便桥、平台施工专项安全检查表",
    "group": "8. 公路专项施工作业安全"
}, {
    "index": "8.1.1.2",
    "file": "ZYGL-QLLC-02",
    "name": "明挖基础施工专项安全检查表",
    "group": "8. 公路专项施工作业安全"
}, {
    "index": "8.1.1.3",
    "file": "ZYGL-QLLC-03",
    "name": "人工挖孔桩专项安全检查表",
    "group": "8. 公路专项施工作业安全"
}, {
    "index": "8.1.1.4",
    "file": "ZYGL-QLLC-04",
    "name": "水上作业钻孔灌注桩专项安全检查表",
    "group": "8. 公路专项施工作业安全"
}, {
    "index": "8.1.1.5",
    "file": "ZYGL-QLLC-05",
    "name": "钻孔灌注桩专项安全检查表",
    "group": "8. 公路专项施工作业安全"
}, {
    "index": "8.1.1.6",
    "file": "ZYGL-QLLC-06",
    "name": "沉入桩施工专项安全检查表",
    "group": "8. 公路专项施工作业安全"
}, {
    "index": "8.1.1.7",
    "file": "ZYGL-QLLC-07",
    "name": "水中围堰施工专项安全检查表",
    "group": "8. 公路专项施工作业安全"
}, {
    "index": "8.1.2.1",
    "file": "ZYGL-QLDT-01",
    "name": "墩柱、台帽施工专项安全检查表",
    "group": "8. 公路专项施工作业安全"
}, {
    "index": "8.1.2.2",
    "file": "ZYGL-QLDT-02",
    "name": "水上作业专项安全检查表",
    "group": "8. 公路专项施工作业安全"
}, {
    "index": "8.1.3.1",
    "file": "ZYGL-QLSB-01",
    "name": "预制梁安装专项安全检查表",
    "group": "8. 公路专项施工作业安全"
}, {
    "index": "8.1.3.2",
    "file": "ZYGL-QLSB-02",
    "name": "现浇箱梁混凝土浇筑施工专项安全检查表",
    "group": "8. 公路专项施工作业安全"
}, {
    "index": "8.1.3.3",
    "file": "ZYGL-QLSB-03",
    "name": "现浇箱梁预应力张拉压浆施工专项安全检查表",
    "group": "8. 公路专项施工作业安全"
}, {
    "index": "8.1.3.4",
    "file": "ZYGL-QLSB-04",
    "name": "桥面铺装专项安全检查表",
    "group": "8. 公路专项施工作业安全"
}, {
    "index": "8.1.3.5",
    "file": "ZYGL-QLSB-05",
    "name": "防撞栏施工专项安全检查表",
    "group": "8. 公路专项施工作业安全"
}, {
    "index": "8.1.3.6",
    "file": "ZYGL-QLSB-06",
    "name": "跨线施工安全专项检查",
    "group": "8. 公路专项施工作业安全"
}, {
    "index": "8.2.1.1",
    "file": "ZYGL-QLSD-01",
    "name": "隧道施工专项安全检查表",
    "group": "8. 公路专项施工作业安全"
}, {
    "index": "8.2.1.2",
    "file": "ZYGL-QLSD-02",
    "name": "隧道施工材料、车辆及机械专项安全检查表",
    "group": "8. 公路专项施工作业安全"
}, {
    "index": "8.2.1.3",
    "file": "ZYGL-QLSD-03",
    "name": "隧道施工洞口作业专项安全检查表",
    "group": "8. 公路专项施工作业安全"
}, {
    "index": "8.2.1.4",
    "file": "ZYGL-QLSD-04",
    "name": "隧道施工二衬台车及作业平台专项安全检查表",
    "group": "8. 公路专项施工作业安全"
}, {
    "index": "8.2.1.5",
    "file": "ZYGL-QLSD-05",
    "name": "隧道施工通风与除尘专项安全检查表",
    "group": "8. 公路专项施工作业安全"
}, {
    "index": "8.2.1.6",
    "file": "ZYGL-QLSD-06",
    "name": "隧道施工支护与开挖作业专项安全检查表",
    "group": "8. 公路专项施工作业安全"
}, {
    "index": "8.3.1.1",
    "file": "ZYGL-LJBP-01",
    "name": "高边坡施工专项安全检查表",
    "group": "8. 公路专项施工作业安全"
}, {
    "index": "8.3.1.2",
    "file": "ZYGL-LJBP-02",
    "name": "高边坡锚喷支护施工专项安全检查表",
    "group": "8. 公路专项施工作业安全"
}, {
    "index": "8.3.1.3",
    "file": "ZYGL-LJBP-03",
    "name": "高边坡预应力锚索施工专项安全检查表",
    "group": "8. 公路专项施工作业安全"
}, {
    "index": "8.3.1.4",
    "file": "ZYGL-LJ-01",
    "name": "路基土方工程专项安全检查表",
    "group": "8. 公路专项施工作业安全"
}, {
    "index": "8.3.1.5",
    "file": "ZYGL-LJ-02",
    "name": "路基石方工程专项安全检查表",
    "group": "8. 公路专项施工作业安全"
}, {
    "index": "8.3.1.6",
    "file": "ZYGL-LJ-03",
    "name": "路基工程机械专项安全检查表",
    "group": "8. 公路专项施工作业安全"
}, {
    "index": "8.3.1.7",
    "file": "ZYGL-LJ-04",
    "name": "路基防护工程专项安全检查表",
    "group": "8. 公路专项施工作业安全"
}, {
    "index": "8.3.1.8",
    "file": "ZYGL-LJ-05",
    "name": "软基处理专项安全检查表",
    "group": "8. 公路专项施工作业安全"
}, {
    "index": "8.3.1.9",
    "file": "ZYGL-LM-01",
    "name": "路面基层施工专项安全检查表",
    "group": "8. 公路专项施工作业安全"
}, {
    "index": "8.3.1.1",
    "file": "0",
    "name": "ZYGL-LM-02 沥青路面施工专项安全检查表",
    "group": "8. 公路专项施工作业安全"
}, {
    "index": "8.3.1.1",
    "file": "1",
    "name": "ZYGL-LM-03 水泥混凝土路面施工专项安全检查表",
    "group": "8. 公路专项施工作业安全"
}, {
    "index": "8.3.1.1",
    "file": "2",
    "name": "ZYGL-LM-04 机械碾压专项安全检查表",
    "group": "8. 公路专项施工作业安全"
}, {
    "index": "8.3.1.1",
    "file": "3",
    "name": "ZYGL-LM-05 旧路面凿除施工专项安全检查表",
    "group": "8. 公路专项施工作业安全"
}, {
    "index": "8.3.1.1",
    "file": "4",
    "name": "ZYGL-LM-06 路面施工交通专项安全检查表",
    "group": "8. 公路专项施工作业安全"
}, {
    "index": "9.1.1.1",
    "file": "ZYGL-LJZD-01",
    "name": "驻地建设专项安全检查表",
    "group": "9. 临建"
}, {
    "index": "9.2.1.1",
    "file": "ZYGL-LJBHZ-01",
    "name": "拌和场专项安全检查表",
    "group": "9. 临建"
}, {
    "index": "9.3.1.1",
    "file": "ZYGL-LJYZC-01",
    "name": "预制场专项安全检查表",
    "group": "9. 临建"
}, {
    "index": "9.4.1.1",
    "file": "ZYGL-LJGJJG-01",
    "name": "钢筋加工场专项安全检查表",
    "group": "9. 临建"
}, {
    "index": "9.5.1.1",
    "file": "ZYGL-LJCK-01",
    "name": "仓库专项安全检查表",
    "group": "9. 临建"
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
}]);

app.constant('wbs', [{
    "name": "软土地基",
    "group": "路基土石方工程",
    "files": ["ZYGL-LJ-05", "ZYGL-LJ-03", "TY-LD-02", "TY-QX-01", "TY-XF-01", "TY-FH-01", "TY-ZC-04", "TY-JXSB-02", "TY-ZY-01"]
}, {
    "name": "土石方路基",
    "group": "路基土石方工程",
    "files": ["ZYGL-LJ-01", "ZYGL-LJ-02", "ZYGL-LJBP-01", "TY-ZY-05", "ZYGL-LJ-03", "TY-LD-02", "TY-QX-01", "TY-XF-01", "TY-FH-01", "TY-ZC-04", "TY-JXSB-02", "TY-ZY-01"]
}, {
    "name": "其他支护",
    "group": "砌筑防护工程",
    "files": ["ZYGL-LJ-04", "ZYGL-LJ-03", "TY-LD-02", "TY-QX-01", "TY-XF-01", "TY-FH-01", "TY-ZC-04", "TY-JXSB-02", "TY-ZY-01"]
}, {
    "name": "喷锚支护",
    "group": "砌筑防护工程",
    "files": ["ZYGL-LJBP-02", "ZYGL-LJ-03", "TY-LD-02", "TY-QX-01", "TY-XF-01", "TY-FH-01", "TY-ZC-04", "TY-JXSB-02", "TY-ZY-01"]
}, {
    "name": "预应力锚索",
    "group": "砌筑防护工程",
    "files": ["ZYGL-LJBP-03", "ZYGL-LJ-03", "TY-LD-02", "TY-QX-01", "TY-XF-01", "TY-FH-01", "TY-ZC-04", "TY-JXSB-02", "TY-ZY-01"]
}, {
    "name": "基层",
    "group": "路面工程",
    "files": ["ZYGL-LJ-01", "ZYGL-LJ-06", "ZYGL-LJ-04", "TY-LD-02", "TY-QX-01", "TY-XF-01", "TY-FH-01", "TY-ZC-04", "TY-JXSB-02", "TY-ZY-01"]
}, {
    "name": "面层",
    "group": "路面工程",
    "files": ["ZYGL-LJ-02", "ZYGL-LJ-03", "ZYGL-LJ-05", "ZYGL-LJ-06", "ZYGL-LJ-04", "TY-LD-02", "TY-QX-01", "TY-XF-01", "TY-FH-01", "TY-ZC-04", "TY-JXSB-02", "TY-ZY-01"]
}, {
    "name": "扩大基础",
    "group": "基础及下部构造",
    "files": ["ZYGL-QLLC-02", "TY-ZY-02", "ZYGL-QLLC-01", "ZYGL-QLLC-07", "ZYGL-QLDT-02", "TY-JXSB-05", "TY-JXSB-04", "TY-JXSB-01", "TY-MB-01", "TY-MB-02", "TY-MB-03", "TY-LD-02", "TY-QX-01", "TY-XF-01", "TY-FH-01", "TY-ZC-04", "TY-JXSB-02", "TY-ZY-01"]
}, {
    "name": "桩基",
    "group": "基础及下部构造",
    "files": ["ZYGL-QLLC-03", "TY-ZY-04", "ZYGL-QLLC-04", "ZYGL-QLLC-05", "ZYGL-QLLC-06", "ZYGL-QLLC-01", "ZYGL-QLLC-07", "ZYGL-QLDT-02", "TY-JXSB-05", "TY-JXSB-04", "TY-JXSB-01", "TY-MB-01", "TY-MB-02", "TY-MB-03", "TY-LD-02", "TY-QX-01", "TY-XF-01", "TY-FH-01", "TY-ZC-04", "TY-JXSB-02", "TY-ZY-01"]
}, {
    "name": "墩柱、台帽",
    "group": "基础及下部构造",
    "files": ["ZYGL-QLDT-01", "ZYGL-QLLC-01", "ZYGL-QLLC-07", "ZYGL-QLDT-02", "TY-JXSB-05", "TY-JXSB-04", "TY-JXSB-01", "TY-MB-01", "TY-MB-02", "TY-MB-03", "TY-LD-02", "TY-QX-01", "TY-XF-01", "TY-FH-01", "TY-ZC-04", "TY-JXSB-02", "TY-ZY-01"]
}, {
    "name": "梁的安装",
    "group": "上部构造预制与安装",
    "files": ["ZYGL-QLSB-01", "TY-JXSB-06", "TY-JXSB-01", "TY-LD-02", "TY-QX-01", "TY-XF-01", "TY-FH-01", "TY-ZC-04", "TY-JXSB-02", "TY-ZY-01"]
}, {
    "name": "预应力张拉",
    "group": "上部构造现场浇筑",
    "files": ["ZYGL-QLSB-02", "TY-ZC-01", "TY-ZC-02", "TY-ZC-03", "TY-JXSB-01", "TY-MB-04", "TY-MB-05", "TY-MB-06", "TY-MB-07", "TY-LD-02", "TY-QX-01", "TY-XF-01", "TY-FH-01", "TY-ZC-04", "TY-JXSB-02", "TY-ZY-01"]
}, {
    "name": "浇筑",
    "group": "上部构造现场浇筑",
    "files": ["ZYGL-QLSB-03", "TY-ZC-01", "TY-ZC-02", "TY-ZC-03", "TY-JXSB-01", "TY-MB-04", "TY-MB-05", "TY-MB-06", "TY-MB-07", "TY-LD-02", "TY-QX-01", "TY-XF-01", "TY-FH-01", "TY-ZC-04", "TY-JXSB-02", "TY-ZY-01"]
}, {
    "name": "桥面铺装",
    "group": "总体、桥面系及附属",
    "files": ["ZYGL-QLSB-04", "ZYGL-QLSB-06", "TY-LD-02", "TY-QX-01", "TY-XF-01", "TY-FH-01", "TY-ZC-04", "TY-JXSB-02", "TY-ZY-01"]
}, {
    "name": "栏杆安装",
    "group": "总体、桥面系及附属",
    "files": ["ZYGL-QLSB-05", "ZYGL-QLSB-06", "TY-LD-02", "TY-QX-01", "TY-XF-01", "TY-FH-01", "TY-ZC-04", "TY-JXSB-02", "TY-ZY-01"]
}, {
    "name": "洞口工程",
    "group": "洞口工程",
    "files": ["ZYGL-QLSD-03", "ZYGL-QLSD-01", "ZYGL-QLSD-02", "ZYGL-QLSD-05", "TY-ZY-03", "TY-LD-02", "TY-QX-01", "TY-XF-01", "TY-FH-01", "TY-ZC-04", "TY-JXSB-02", "TY-ZY-01"]
}, {
    "name": "洞身开挖与衬砌",
    "group": "洞身开挖与衬砌",
    "files": ["ZYGL-QLSD-04", "ZYGL-QLSD-06", "ZYGL-QLSD-01", "ZYGL-QLSD-02", "ZYGL-QLSD-05", "TY-ZY-03", "TY-LD-02", "TY-QX-01", "TY-XF-01", "TY-FH-01", "TY-ZC-04", "TY-JXSB-02", "TY-ZY-01"]
}, {
    "name": "驻地",
    "group": "驻地",
    "files": ["ZYGL-LJZD-01", "TY-LD-01", "TY-ZY-03", "TY-LD-02", "TY-QX-01", "TY-XF-01", "TY-FH-01", "TY-ZC-04", "TY-JXSB-02", "TY-ZY-01"]
}, {
    "name": "拌和场",
    "group": "拌和场",
    "files": ["ZYGL-LJBHZ-01", "TY-ZY-03", "TY-LD-02", "TY-QX-01", "TY-XF-01", "TY-FH-01", "TY-ZC-04", "TY-JXSB-02", "TY-ZY-01"]
}, {
    "name": "预制场",
    "group": "预制场",
    "files": ["ZYGL-LJYZC-01", "TY-JXSB-03", "TY-ZY-03", "TY-LD-02", "TY-QX-01", "TY-XF-01", "TY-FH-01", "TY-ZC-04", "TY-JXSB-02", "TY-ZY-01"]
}, {
    "name": "钢筋加工场",
    "group": "钢筋加工场",
    "files": ["ZYGL-LJGJJG-01", "TY-ZY-03", "TY-LD-02", "TY-QX-01", "TY-XF-01", "TY-FH-01", "TY-ZC-04", "TY-JXSB-02", "TY-ZY-01"]
}, {
    "name": "仓库",
    "group": "仓库",
    "files": ["TY-ZY-06", "ZYGL-LJCK-01", "TY-ZY-03", "TY-LD-02", "TY-QX-01", "TY-XF-01", "TY-FH-01", "TY-ZC-04", "TY-JXSB-02", "TY-ZY-01"]
}]);

app.controller('AdministratorDashboardCtrl', ["$scope", "$rootScope", "$state", "$stateParams", "settings", "UserService", "CheckService", "AuthService", "resolveUser", function($scope, $rootScope, $state, $stateParams, settings, UserService, CheckService, AuthService, resolveUser) {
    $scope.data = {};
    $scope.data.user = resolveUser;

    // var extent = ol.proj.transform([111.56067, 30.50430, 111.24344, 30.29702],
    //     'EPSG:4326', 'EPSG:900913');
    // var center = ol.proj.transform([111.40068, 30.39583],
    //     'EPSG:4326', 'EPSG:900913');

    $scope.map = {
        center: {
            latitude: 30.39583,
            longitude: 111.40068
        },
        extent: [111.56067, 30.50430, 111.24344, 30.29702],
        zoom: 12,
    };

    var extent = ol.proj.transform($scope.map.extent,
        'EPSG:4326', 'EPSG:900913');
    var center = ol.proj.transform([$scope.map.center.longitude, $scope.map.center.latitude],
        'EPSG:4326', 'EPSG:900913');

    var elMap = document.getElementById("map");
    var headerHeight = 44;
    var footerHeight = 0;
    elMap.style.height = (window.innerHeight - headerHeight - footerHeight) + 'px';

    var view = new ol.View({
        projection: 'EPSG:900913',
        center: center,
        minZoom: 10,
        maxZoom: 16,
        zoom: 12
    });

    var server = "http://121.40.202.109:8080/";

    var map = new ol.Map({
        layers: [
            new ol.layer.Tile({
                // crossOrigin: 'anonymous',
                // url: '//{a-c}.tile.openstreetmap.org/{z}/{x}/{y}.png'
                source: new ol.source.XYZ({
                    tileUrlFunction: function(coordinate) {
                        if (coordinate === undefined) {
                            return "";
                        }

                        var z = coordinate[0];
                        var x = coordinate[1];
                        var y = coordinate[2];

                        return 'data/' + 'tianditu' + '/' + 'satellite' + '/' + z + '/' + x + '/' + y + '.jpg';
                    },
                    extent: extent,
                    minZoom: 10,
                    maxZoom: 16,
                    wrapx: false
                })
            }),
            new ol.layer.Tile({
                source: new ol.source.XYZ({
                    tileUrlFunction: function(coordinate) {
                        if (coordinate === undefined) {
                            return "";
                        }

                        var z = coordinate[0];
                        var x = coordinate[1];
                        var y = coordinate[2];

                        return 'data/' + 'tianditu' + '/' + 'overlay_s' + '/' + z + '/' + x + '/' + y + '.png';
                    },
                    extent: extent,
                    minZoom: 10,
                    maxZoom: 16,
                    wrapx: false
                })
            }),
            // new ol.layer.Vector({
            //     source: new ol.source.KML({
            //         projection: 'EPSG:4326',
            //         url: 'data/geojson/yzgs.kml'
            //     }),
            //     style: function(feature, resolution) {
            //         var style = new ol.style.Style({
            //             stroke: new ol.style.Stroke({
            //                 color: 'blue',
            //                 width: 4
            //             }),
            //             text: ""
            //         });
            //         return [style];
            //     }
            // }),

            new ol.layer.Tile({
                source: new ol.source.TileWMS({
                    url: 'http://121.40.202.109:8080/geoserver/wms',
                    params: {
                        'LAYERS': 'css:YZGS'
                    },
                    serverType: 'geoserver'
                })
            })
        ],
        // renderer: 'canvas',
        renderer: 'dom', // Android手机性能不行，只能采用DOM方式渲染
        target: 'map',
        logo: false,
        view: view
    });

    var geolocation = new ol.Geolocation({
        projection: view.getProjection()
    });

    // update the HTML page when the position changes.
    geolocation.on('change', function() {
        console.log(geolocation.getPosition());
    });

    // handle geolocation error.
    geolocation.on('error', function(error) {
        console.log(error);
    });

    var accuracyFeature = new ol.Feature();
    accuracyFeature.bindTo('geometry', geolocation, 'accuracyGeometry');

    var positionFeature = new ol.Feature();
    positionFeature.bindTo('geometry', geolocation, 'position')
        .transform(function() {}, function(coordinates) {
            return coordinates ? new ol.geom.Point(coordinates) : null;
        });

    var featuresOverlay = new ol.FeatureOverlay({
        map: map,
        features: [accuracyFeature, positionFeature]
    });

    geolocation.setTracking(true);

    $scope.toCapture = function () {
        $state.go('capture.create', {
        });
    };

    $scope.toCaptureList = function () {
        $state.go('capture.list', {
        });
    };

    $scope.toEvaluationList = function () {
        $state.go('evaluation.list', {
        });
    };

    $scope.logout = function () {
        AuthService.logout().then(function () {
            $state.go('welcome');
        }, function (err) {
            alert(err);
            $state.go('welcome');
        });
    };

    // map.getView().fitExtent(extent, map.getSize());
}]);

app.controller('AdminitratorLoginCtrl', ["$scope", "$rootScope", "$state", "$stateParams", "settings", "projects", "ProjectService", "SegmentService", "UnitService", "UserService", "AuthService", function($scope, $rootScope, $state, $stateParams, settings, projects, ProjectService, SegmentService, UnitService, UserService, AuthService) {
    $scope.data = {};
    $scope.data.projects = projects;

    $scope.changeProject = function (project) {
        $scope.project = project;
    };

    $scope.login = function () {
        if (!$scope.data.username) {
            alert('请选择用户');
            return;
        }

        if (!$scope.data.password) {
            alert('请输入密码');
            return;
        }

        // 保存到$rootScopre, 并非特别好的方式
        $rootScope._project = $scope.project;

        AuthService.login($scope.data.username, $scope.data.password).then(function (user) {
            $state.go("^.dashboard", {
                userId: user._id,
            });
        }, function (err) {
            alert(err);
        });
    };

}]);
app.controller('CaptureCreateCtrl', ["$scope", "$rootScope", "$state", "$stateParams", "settings", "ProjectService", "SegmentService", "UserService", "CaptureService", "AuthService", "files", "resolveUser", function($scope, $rootScope, $state, $stateParams, settings, ProjectService, SegmentService, UserService, CaptureService, AuthService, files, resolveUser) {
    $scope.data = {};
    $scope.data.user = resolveUser;
    // $scope.data.projectId = $scope.data.user.segment ? $scope.data.user.segment.project : $rootScope._project._id;
    $scope.data.images = [];

    // 用户登录状态异常控制
    if (!$scope.data.user) {
        alert('用户登录状态异常');
        AuthService.logout().then(function () {
            $state.go('welcome');
        });
    }

    $scope.capture = function () {
        function onSuccess(imageURI) {
            $scope.data.images.push(imageURI);
            $scope.$apply();
        }

        function onFail(message) {}

        navigator.camera.getPicture(onSuccess, onFail, {
            quality: 75,
            destinationType: Camera.DestinationType.FILE_URI,
            saveToPhotoAlbum: true
        });
    };

    $scope.save = function () {
        CaptureService.create({
            name: $scope.data.name,
            description: $scope.data.description,
            user: $scope.data.user._id,
            // project: $scope.data.projectId,
            images: $scope.data.images.join("|"),
            px: $scope.data.px,
            py: $scope.data.py
        }).then(function(check) {
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

app.controller('CheckCreateCtrl', ["$scope", "$rootScope", "$state", "$stateParams", "settings", "ProjectService", "SegmentService", "UserService", "CheckService", "AuthService", "files", "resolveUser", function($scope, $rootScope, $state, $stateParams, settings, ProjectService, SegmentService, UserService, CheckService, AuthService, files, resolveUser) {
    $scope.data = {};
    $scope.data.user = resolveUser;
    $scope.data.segments = [];
    $scope.data.projectId = $scope.data.user.segment ? $scope.data.user.segment.project : $rootScope._project._id;
    $scope.data.files = files;

    // 用户登录状态异常控制
    if (!$scope.data.user) {
        alert('用户登录状态异常');
        AuthService.logout().then(function () {
            $state.go('welcome');
        });
    }

    SegmentService.findByProjectId($scope.data.projectId).then(function (segments) {
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
    };

    $scope.newCheck = function () {
        CheckService.create({
            project: $scope.data.projectId,
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
        console.log($scope.data.check.rectifications);
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

        $scope.data.checked_items = [];
        $scope.data.score = 0;

        // 标识考核历史记录
        _.each($scope.data.table.items, function (level1) {
            _.each(level1.items, function (level2) {
                level2.pass = level2.fail = level2.uncheck = 0;
                _.each(level2.items, function (level3) {
                    if (level3.status === 'FAIL') {
                        level3.full_index = [level1.index, level2.index, level3.index].join('-');
                        $scope.data.checked_items.push(level3);
                        $scope.data.score += parseInt(level3.score, 10);
                        level2.fail += 1;
                    } else if (level3.status === 'PASS') {
                        level2.pass += 1;
                    } else if (level3.status === 'UNCHECK') {
                        level2.uncheck += 1;
                    }
                });
            });
        });

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

app.controller('EvaluationCreateCtrl', ["$scope", "$rootScope", "$state", "$stateParams", "settings", "wbs", "ProjectService", "SegmentService", "UserService", "UnitService", "CheckService", "EvaluationService", "AuthService", "resolveUser", function($scope, $rootScope, $state, $stateParams, settings, wbs, ProjectService, SegmentService, UserService, UnitService, CheckService, EvaluationService, AuthService, resolveUser) {
    $scope.wbs = wbs;
    $scope.data = {};
    $scope.data.user = resolveUser;
    $scope.data.projectId = $scope.data.user.segment ? $scope.data.user.segment.project : $rootScope._project._id;

    // 用户登录状态异常控制
    if (!$scope.data.user) {
        alert('用户登录状态异常');
        AuthService.logout().then(function () {
            $state.go('welcome');
        });
    }

    ProjectService.findById($scope.data.projectId).then(function (project) {
        $scope.data.project = project;
    });

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

        if (!$scope.data.wbs) {
            alert('请选择工程进展');
            return;
        }

        EvaluationService.create({
            project: $scope.data.projectId,
            segment: ($scope.data.branch || $scope.data.section)['_id'],
            unit: $scope.data.unit._id,
            wbs: $scope.data.wbs
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
            end_date.setDate(end_date.getDate() + 1);

            start_date = [start_date.getFullYear(), start_date.getMonth() + 1, start_date.getDate()].join('-');
            end_date = [end_date.getFullYear(), end_date.getMonth() + 1, end_date.getDate()].join('-');

        var current_unit = $scope.data.user.unit,
            checked_items = [],
            reLink = /(SGJC|SGXCTY|SGXCGL|SGXCSY)-([A-Z])-([A-Z][0-9]+)-([0-9])+/,
            matches = null;
        CheckService.list(project, segment, start_date, end_date).then(function (checks) {
            $scope.data.checks = checks;

            angular.forEach(checks, function (check) {
                if (check.checked_items && check.check_user.unit._id === current_unit._id) {
                    angular.forEach(check.checked_items, function (item) {
                        if (item.status !== 'UNCHECK' && item.link !== '') {
                            matches = item.link.match(reLink);

                            item.link = {};
                            item.link.file = matches[1];
                            item.link.level1 = matches[2];
                            item.link.level2 = matches[3];
                            item.link.level3 = matches[4];

                            item.check_date = check.check_date;

                            checked_items.push(item);
                        }
                    });
                }
            });

            var table, level1, level2, level3;
            angular.forEach(checked_items, function (item) {
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
                level3.checked_items = level3.checked_items || [];
                level3.checked_items.push(item);
            });

            // console.log(checked_items);
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

    $scope.toggleLinkScore = function(linkScore) {
        toggleLinkScore(linkScore);
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

    function toggleLinkScore (bool) {
        if (bool) {
            angular.forEach($scope.data.evaluation.tables, function (table) {
                angular.forEach(table.items, function(level1) {
                    angular.forEach(level1.items, function(level2) {
                        angular.forEach(level2.items, function(level3) {
                            var pass = 0,
                                fail = 0, 
                                last_pass = true;

                            if (level3.is_checked && level3.checked_items) {
                                level3.checked_items.sort(function compareDate(a, b) {
                                    return a.check_date - b.check_date;
                                });

                                if (level3.checked_items[0]['score'] === '0') { // 最近一次合格
                                    last_pass = true;
                                } else if (level3.checked_items[0]['score'] === '1') { // 最近一次不合格
                                    last_pass = false;
                                }

                                angular.forEach(level3.checked_items, function (item) {
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
        } else {
            angular.forEach($scope.data.evaluation.tables, function (table) {
                angular.forEach(table.items, function(level1) {
                    angular.forEach(level1.items, function(level2) {
                        angular.forEach(level2.items, function(level3) {
                            level3.status = 'UNCHECK';
                            level3.score = null;
                        });
                    });
                });
            });
        }
    }
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
            end_date.setDate(end_date.getDate() + 1);

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
                if (check.checked_items) {
                    angular.forEach(check.checked_items, function (item) {
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

        $scope.data.checked_items = [];
        $scope.data.score = 0;

        // 标识考核历史记录
        _.each($scope.data.evaluation.tables, function (table) {
            _.each(table.items, function (level1) {
                _.each(level1.items, function (level2) {
                    level2.pass = level2.fail = level2.uncheck = 0;
                    _.each(level2.items, function (level3) {
                        if (level3.status === 'FAIL') {
                            level3.full_index = [table.file, level1.index, level2.index, level3.index].join('-');
                            $scope.data.checked_items.push(level3);
                            $scope.data.score += parseInt(level3.score, 10);
                            level2.fail += 1;
                        } else if (level3.status === 'PASS') {
                            level2.pass += 1;
                        } else if (level3.status === 'UNCHECK') {
                            level2.uncheck += 1;
                        }
                    });
                });
            });
        });
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
    $scope.data.group = {};

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
    if ($scope.data.user.segment) {
        $scope.data.group = $scope.data.user.segment;
        UserService.findBySegmentId($scope.data.user.segment._id).then(function (users) {
            $scope.data.groupUsers = users;
        });
    } else if ($scope.data.user.unit) {
        $scope.data.group = $scope.data.user.unit;
        UserService.findByUnitId($scope.data.user.unit._id).then(function (users) {
            $scope.data.groupUsers = users;
        });
    }

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

        SegmentService.findByProjectId(project._id).then(function(segments) {
            var tree = [];
            var roots = angular.copy(segments);

            function deepLoop(root, level) {
                tree.push({
                    level: level,
                    _id: root._id,
                    name: root.name
                });

                // 只列出标段和分部
                if (root.segments && root.type === '标段') {
                    level += 1;
                    angular.forEach(root.segments, function(child) {
                        deepLoop(child, level);
                    });
                }
            }

            angular.forEach(roots, function (child) {
                deepLoop(child, 0);
            });

            $scope.data.segments = tree;
        });

        UnitService.findByProjectId(project._id).then(function (units) {
            console.log(units); 

            $scope.data.units = units;
        });
    };

    $scope.changeUnit = function (unit) {
        $scope.unit = unit;

        if ($scope.unit.type !== '施工单位') {
            UserService.findByUnitId($scope.unit._id).then(function(users) {
                $scope.data.users = users;
            });
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
            $scope.data.users = _.filter(users, function (user) {
                return user.unit.type === '施工单位';
            });
        });
    };

    $scope.login = function () {
        if (!$scope.data.username) {
            alert('请选择用户');
            return;
        }

        if (!$scope.data.password) {
            alert('请输入密码');
            return;
        }

        // 保存到$rootScopre, 并非特别好的方式
        $rootScope._project = $scope.project;

        AuthService.login($scope.data.username, $scope.data.password).then(function (user) {
            $state.go("^.dashboard", {
                userId: user._id,
            });
        }, function (err) {
            alert(err);
        });
    };

}]);