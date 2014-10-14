var app = angular.module('app', ['ionic']);

// 加载ionic和cordova
app.run(function($ionicPlatform) {
    $ionicPlatform.ready(function() {
        if (window.cordova && window.cordova.plugins.Keyboard) {
            cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
        }
        if (window.StatusBar) {
            StatusBar.hide();
        }
    });
})

// 注册全局变量
.constant('settings', {
    'baseUrl': 'http://10.171.40.8:3000',
    'project': '监利至江陵高速公路'
})

.config(['$httpProvider',function ($httpProvider) {
    $httpProvider.defaults.withCredentials = true;
 }]) 

// 注册路由
.config(function($stateProvider, $urlRouterProvider, $compileProvider) {

    // 条件路由
    $stateProvider

    // 首页，用户类型
    .state('welcome', {
        url: '/welcome',
        templateUrl: 'templates/welcome.html',
        controller: 'WelcomeCtrl'
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
        }
    })

    // 创建监督检查，选择检查对象
    .state('manager.target', {
        url: '/dashboard/:userId/target',
        templateUrl: 'templates/manager/target.html',
        controller: 'ManagerTargetCtrl',
        resolve: {
        }
    })

    // 监督检查详情 
    .state('manager.check', {
        url: '/dashboard/:userId/check/:checkId',
        templateUrl: 'templates/manager/check.html',
        controller: 'ManagerCheckCtrl',
        resolve: {
        }
    })

    // 下达整改通知书 
    .state('manager.startup', {
        url: '/dashboard/:userId/check/:checkId/startup',
        templateUrl: 'templates/manager/startup.html',
        controller: 'ManagerStartUpCtrl',
        resolve: {
        }
    })

    // 整改提交 
    .state('manager.rectification', {
        url: '/dashboard/:userId/check/:checkId/rectification',
        templateUrl: 'templates/manager/rectification.html',
        controller: 'ManagerRectificationCtrl',
        resolve: {
        }
    })

    // 考核列表页
    .state('manager.table', {
        url: "/dashboard/:userId/table/:tableId",
        templateUrl: "templates/manager/table.html",
        controller: 'ManagerTableCtrl',
    })

    // 考核单项页
    .state('manager.review', {
        url: "/dashboard/:userId/table/:tableId/:itemId/:subItemId",
        templateUrl: "templates/manager/review.html",
        controller: 'ManagerReviewCtrl',
    })

    // 用户联系方式
    .state('contact', {
        url: "/contact/:userId",
        templateUrl: "templates/contact.html",
        controller: 'ContactCtrl',
    });

    // // 考核列表页
    // .state('review', {
    //     url: "/review/:reviewId",
    //     templateUrl: "templates/review.html",
    //     controller: 'ReviewCtrl',
    // })

    // // 考核卡片页
    // .state('review/item', {
    //     url: "/review/:itemId/:subItemId",
    //     templateUrl: "templates/review-item.html",
    //     controller: 'ReviewCardCtrl',
    // })

    // // 自评得分
    // .state('score', {
    //     url: "/score/:reviewId",
    //     templateUrl: "templates/score.html",
    //     controller: 'ScoreCtrl',
    // })

    // // 报送
    // .state('report', {
    //     url: "/report/:reviewId",
    //     templateUrl: "templates/report.html",
    //     controller: 'ReportCtrl',
    // })

    // // 施工单位抽象页，用于数据共享
    // .state('builder', {
    //     url: '/builder',
    //     abstract: true,
    //     template: "<ui-view></ui-view>",
    //     resolve: {
    //         userData: function(UserMgrService) {
    //             return UserMgrService.getUserData();
    //         }
    //     }
    // })

    // // 施工单位首页
    // .state('builder.dash', {
    //     url: '/dash',
    //     templateUrl: 'templates/builder/dash.html',
    //     controller: 'BuilderDashCtrl'
    // });

    // 设置默认路由
    // $urlRouterProvider.otherwise('welcome');

    // 设置image url白名单，否则AngularJS解析URL错误
    $compileProvider.imgSrcSanitizationWhitelist(/^\s*(https?|file|blob|cdvfile|content):|data:image\//);
    $compileProvider.aHrefSanitizationWhitelist(/^\s*(https?|file|blob|cdvfile|content|sms|smsto|tel|mailto):|data:image\//);
});
