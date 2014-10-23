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
        }
    };
});
