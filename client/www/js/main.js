var app = angular.module('app', ['ionic']);

// 加载ionic和cordova
app.run(function($rootScope, $ionicPlatform) {
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
})

// 注册全局变量
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
            user: function (AuthService) {
                return AuthService.getUser();
            }
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
            projects: function (ProjectService) {
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
            resolveUser: function (AuthService) {
                return AuthService.getUser();
            }
        }
    })

    // 安全检查抽象页，用于数据共享
    .state('check', {
        url: '/check',
        abstract: true,
        template: "<ui-view></ui-view>",
        resolve: {
            resolveUser: function (AuthService) {
                return AuthService.getUser();
            }
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
            resolveUser: function (AuthService) {
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
});
