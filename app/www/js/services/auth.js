app.factory('AuthService', function($rootScope, $http, $q, $window, settings) {
    var user;

    if ($window.localStorage.getItem('current_user')) {
        try {
            user = JSON.parse($window.localStorage.getItem('current_user'));
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
                        $window.localStorage.setItem('current_user', JSON.stringify(data.user));
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
                        $window.localStorage.setItem('current_user', JSON.stringify(data.user));
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
            $window.localStorage.removeItem('current_user');

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
        changePassword: function(username, old_password, new_password) {
            var deferred = $q.defer();

            if (!username) {
                deferred.reject('用户信息错误');
                return deferred.promise;
            }

            if (!old_password) {
                deferred.reject('原密码为空');
                return deferred.promise;
            }

            if (!new_password) {
                deferred.reject('新密码为空');
                return deferred.promise;
            }

            $http.post(settings.baseUrl + '/password', {
                    username: username,
                    old_password: old_password,
                    new_password: new_password
                })
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

            return deferred.promise;
        },
        getUser: function () {
            return user;
        }
    };
});