app.factory('UserService', function($http, $q, settings, WebSQLService) {
    return {
        find: function() {
            var deferred = $q.defer();

            WebSQLService.get('user').then(function(users) {
                deferred.resolve(users);
            }, function() {
                $http.get(settings.baseUrl + '/users/all')
                    .success(function(data) {
                        WebSQLService.set('user', data.users);
                        deferred.resolve(data.users);
                    })
                    .error(function(err) {
                        deferred.reject(err);
                    });
            });

            return deferred.promise;
        },
        findById: function(userId) {
            var deferred = $q.defer();

            WebSQLService.get('user').then(function(users) {
                var user = _.find(users, {'_id': userId});
                deferred.resolve(user);
            }, function() {
                $http.get(settings.baseUrl + '/user/' + userId)
                    .success(function(data) {
                        deferred.resolve(data.user);
                    })
                    .error(function(err) {
                        deferred.reject(err);
                    });
            });

            return deferred.promise;
        },
        findBySegmentId: function(segmentId) {
            var deferred = $q.defer();

            WebSQLService.get('segment').then(function(segments) {
                var segment = _.find(segments, {'_id': segmentId});
                deferred.resolve(segment.users);
            }, function() {
                $http.get(settings.baseUrl + '/segment/' + segmentId + '/users')
                    .success(function(data) {
                        deferred.resolve(data.users);
                    })
                    .error(function(err) {
                        deferred.reject(err);
                    });
            });

            return deferred.promise;
        },
        findByUnitId: function(unitId) {
            var deferred = $q.defer();

            WebSQLService.get('user').then(function(users) {
                users = _.filter(users, function(user) {
                    return user.unit && user.unit._id === unitId;
                });
                deferred.resolve(users);
            }, function() {
                $http.get(settings.baseUrl + '/unit/' + unitId + '/users')
                    .success(function(data) {
                        deferred.resolve(data.users);
                    })
                    .error(function(err) {
                        deferred.reject(err);
                    });
            });

            return deferred.promise;
        }
    };
});
