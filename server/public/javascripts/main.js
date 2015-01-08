var app = angular.module('app', ['ui.router']);

var ipAddr = 'localhost';
// var ipAddr = '121.40.202.109';

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