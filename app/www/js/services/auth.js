app.factory('AuthService', function($rootScope, $http, $q, $window, settings) {
    var user;

    if ($window.sessionStorage["user"]) {
        try {
            user = JSON.parse($window.sessionStorage["user"]);
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
            return user;
        }
    };
});