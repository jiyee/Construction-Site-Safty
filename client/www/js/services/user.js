app.factory('UserService', function($http, $q, settings) {
    return {
        find: function() {
            var deferred = $q.defer();

            $http.get(settings.baseUrl + '/users')
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
        findByPartId: function(partId) {
            var deferred = $q.defer();

            $http.get(settings.baseUrl + '/part/' + partId + '/users')
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
