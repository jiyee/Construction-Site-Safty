var app = angular.module('app', ['ionic', 'ui.bootstrap.datetimepicker']);

// var ipAddr = 'localhost';
// var ipAddr = '10.171.40.9';
var ipAddr = '121.40.202.109';

// if (navigator.notification) {
//     window.alert = navigator.notification.alert;
//     window.prompt = navigator.notification.prompt;
// }

// 加载ionic和cordova
app.run(function($rootScope, $ionicPlatform) {

    if (!window.ActivityIndicator) {
        ActivityIndicator = {
            show: function(text) {
                if (window.ProgressIndicator && window.ProgressIndicator.show) {
                    ProgressIndicator.show(text);
                }
            },
            hide: function() {
                if (window.ProgressIndicator && window.ProgressIndicator.hide) {
                    ProgressIndicator.hide();
                }
            }
        };
    }

    $ionicPlatform.ready(function() {
        if (window.cordova && window.cordova.plugins.Keyboard) {
            cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
        }

        if (window.StatusBar) {
            StatusBar.hide();
        }

        if (!window.sms) {
            window.sms = {
                sendMessage: function (message) {
                    console.log(message);
                }
            };
        }

        document.addEventListener("online", toggleConnection, false);
        document.addEventListener("offline", toggleConnection, false);

        function toggleConnection() {
            if (navigator.network.connection.type == Connection.NONE) {
                app.constant('connection', 'offline');
            } else {
                app.constant('connection', 'Online');
            }
        }
    });

    $rootScope.baseUrl = 'http://' + ipAddr + ':3000';

    $rootScope.data = {};

    $rootScope.$on("$stateChangeSuccess", function(event, to, toParams, from, fromParams) {
        $rootScope.$previousState = from;
    });

    $rootScope.$on("$stateChangeError", function(event, to, toParams, from, fromParams) {
    });

    $rootScope.$on('$stateChangeStart', function(event, to, toParams, from, fromParams) {
    });

})

// 注册全局变量
.constant('settings', {
    'baseUrl': 'http://' + ipAddr + ':3000'
})

.config(['$httpProvider', function($httpProvider) {
    $httpProvider.defaults.withCredentials = true;
}])

// 注册路由
.config(function($stateProvider, $urlRouterProvider, $compileProvider, $locationProvider) {

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
            user: function(AuthService) {
                return AuthService.getUser();
            }
        }
    })

    // 安全管理抽象页，用于数据共享
    .state('manager', {
        url: '/manager',
        abstract: true,
        template: "<ui-view></ui-view>",
        resolve: {}
    })

    // 用户登录
    .state('manager.login', {
        url: '/login',
        templateUrl: 'templates/manager/login.html',
        controller: 'ManagerLoginCtrl',
        resolve: {
            projects: function(ProjectService) {
                return ProjectService.find();
            }
        }
    })

    // 用户主面板
    .state('manager.dashboard', {
        url: '/dashboard/:userId',
        templateUrl: 'templates/manager/dashboard.html',
        controller: 'ManagerDashboardCtrl',
        resolve: {
            resolveUser: function(AuthService) {
                return AuthService.getUser();
            }
        }
    })

    // 日常巡检抽象页，用于数据共享
    .state('check', {
        url: '/check',
        abstract: true,
        template: "<ui-view></ui-view>",
        resolve: {
            resolveUser: function(AuthService) {
                return AuthService.getUser();
            }
        }
    })

    // 创建日常巡检
    .state('check.create', {
        url: '/create',
        templateUrl: 'templates/check/create.html',
        controller: 'CheckCreateCtrl',
        resolve: {
            resolveProjects: function(ProjectService) {
                return ProjectService.find();
            },
        }
    })

    // 日常巡检列表
    .state('check.list', {
        url: '/list',
        templateUrl: 'templates/check/list.html',
        controller: 'CheckListCtrl'
    })

    // 日常巡检详情
    .state('check.detail', {
        url: '/:checkId',
        templateUrl: 'templates/check/detail.html',
        controller: 'CheckDetailCtrl'
    })

    // 日常巡检考核列表页
    .state('check.table', {
        url: "/table/:tableId",
        templateUrl: "templates/check/table.html",
        controller: 'CheckTableCtrl'
    })

    // 日常巡检考核单项页
    .state('check.review', {
        url: "/table/:tableId/:itemId/:subItemId",
        templateUrl: "templates/check/review.html",
        controller: 'CheckReviewCtrl'
    })

    // 日常巡查流程一体化
    .state('check.process', {
        url: '/:checkId/process',
        templateUrl: 'templates/check/process.html',
        controller: 'CheckProcessCtrl'
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
            resolveUser: function(AuthService) {
                return AuthService.getUser();
            }
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
        controller: 'EvaluationCreateCtrl',
        resolve: {
            resolveProjects: function(ProjectService) {
                return ProjectService.find();
            },
        }
    })

    // 创建建设单位选择页
    .state('evaluation.detail', {
        url: '/:evaluationId',
        templateUrl: 'templates/evaluation/detail.html',
        controller: 'EvaluationDetailCtrl'
    })

    // 创建评价数据同步页
    .state('evaluation.sync', {
        url: '/:evaluationId/sync',
        templateUrl: 'templates/evaluation/sync.html',
        controller: 'EvaluationSyncCtrl'
    })

    // 考核评价推荐内容
    .state('evaluation.customize', {
        url: '/:evaluationId/customize',
        templateUrl: 'templates/evaluation/customize.html',
        controller: 'EvaluationCustomizeCtrl'
    })

    // 考核评价表单
    .state('evaluation.table', {
        url: '/:evaluationId/table',
        templateUrl: 'templates/evaluation/table.html',
        controller: 'EvaluationTableCtrl'
    })

    // 考核评价单项页
    .state('evaluation.review', {
        url: "/:evaluationId/:tableId/:itemId/:subItemId",
        templateUrl: "templates/evaluation/review.html",
        controller: 'EvaluationReviewCtrl'
    })

    // 考核评价流程一体化
    .state('evaluation.process', {
        url: '/:evaluationId/process',
        templateUrl: 'templates/evaluation/process.html',
        controller: 'EvaluationProcessCtrl'
    })

    // 行业主管抽象页，用于数据共享
    .state('administrator', {
        url: '/administrator',
        abstract: true,
        template: "<ui-view></ui-view>",
        resolve: {}
    })

    // 用户登录
    .state('administrator.login', {
        url: '/login',
        templateUrl: 'templates/administrator/login.html',
        controller: 'AdministratorLoginCtrl',
        resolve: {
            projects: function(ProjectService) {
                return ProjectService.find();
            },
            units: function(UnitService) {
                return UnitService.find();
            }
        }
    })

    // 行业主管主面板
    .state('administrator.dashboard', {
        url: '/dashboard/:userId',
        templateUrl: 'templates/administrator/dashboard.html',
        controller: 'AdministratorDashboardCtrl',
        resolve: {
            resolveUser: function(AuthService) {
                return AuthService.getUser();
            }
        }
    })

    // 安全检查抽象页，用于数据共享
    .state('capture', {
        url: '/capture',
        abstract: true,
        template: "<ui-view></ui-view>",
        controller: 'CaptureAbstractCtrl',
        resolve: {
            resolveUser: function(AuthService) {
                return AuthService.getUser();
            }
        }
    })

    // 行业主管主面板
    .state('capture.map', {
        url: '/map/:userId',
        templateUrl: 'templates/capture/map.html',
        controller: 'CaptureMapCtrl',
        resolve: {
            resolveProjects: function(ProjectService) {
                return ProjectService.find();
            },
            resolveSegments: function(SegmentService) {
                return SegmentService.find();
            },
        }
    })

    // 创建安全检查
    .state('capture.create', {
        url: '/create',
        templateUrl: 'templates/capture/create.html',
        controller: 'CaptureCreateCtrl',
        resolve: {
            resolveProjects: function(ProjectService) {
                return ProjectService.find();
            },
        }
    })

    // 创建安全检查
    .state('capture.detail', {
        url: '/detail/:captureId',
        templateUrl: 'templates/capture/detail.html',
        controller: 'CaptureDetailCtrl'
    })

    // 安全检查列表
    .state('capture.list', {
        url: '/list',
        templateUrl: 'templates/capture/list.html',
        controller: 'CaptureListCtrl'
    })

    // 日常巡查流程一体化
    .state('capture.process', {
        url: '/:captureId/process',
        templateUrl: 'templates/capture/process.html',
        controller: 'CaptureProcessCtrl'
    })

    // 我要查询
    .state('rule', {
        url: '/rule',
        abstract: true,
        template: "<ui-view></ui-view>",
        resolve: {
            resolveUser: function(AuthService) {
                return AuthService.getUser();
            }
        }
    })

    // 首页
    .state('rule.index', {
        url: '/',
        templateUrl: 'templates/rule/index.html',
        controller: 'RuleIndexCtrl'
    })

    // 安全管理抽象页，用于数据共享
    .state('worker', {
        url: '/worker',
        abstract: true,
        template: "<ui-view></ui-view>",
        resolve: {}
    })

    // 用户登录
    .state('worker.login', {
        url: '/login',
        templateUrl: 'templates/worker/login.html',
        controller: 'WorkerLoginCtrl',
        resolve: {}
    })

    // 用户主面板
    .state('worker.dashboard', {
        url: '/dashboard/:userId',
        templateUrl: 'templates/worker/dashboard.html',
        controller: 'WorkerDashboardCtrl',
        resolve: {
            resolveUser: function(AuthService) {
                return AuthService.getUser();
            }
        }
    });

    // 设置image url白名单，否则AngularJS解析URL错误
    $compileProvider.imgSrcSanitizationWhitelist(/^\s*(https?|file|blob|cdvfile|content):|data:image\//);
    $compileProvider.aHrefSanitizationWhitelist(/^\s*(https?|file|blob|cdvfile|content|sms|smsto|tel|mailto):|data:image\//);
});
