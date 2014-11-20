app.factory('CheckService', function($http, $q, settings) {
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
        start: function(checkId, opts) {
            var deferred = $q.defer();

            $http.post(settings.baseUrl + '/check/' + checkId + '/start', opts)
                .success(function(data) {
                    if (data.code > 0) {
                        deferred.reject(data.message);
                    } else {
                        deferred.resolve();
                    }
                })
                .error(function(err) {
                    deferred.reject(err);
                });

            return deferred.promise;
        },
        forward: function(checkId, opts) {
            var deferred = $q.defer();

            $http.post(settings.baseUrl + '/check/' + checkId + '/forward', opts)
                .success(function(data) {
                    if (data.code > 0) {
                        deferred.reject(data.message);
                    } else {
                        deferred.resolve();
                    }
                })
                .error(function(err) {
                    deferred.reject(err);
                });

            return deferred.promise;
        },
        backward: function (checkId, opts) {
            var deferred = $q.defer();

            $http.post(settings.baseUrl + '/check/' + checkId + '/backward', opts)
                .success(function(data) {
                    if (data.code > 0) {
                        deferred.reject(data.message);
                    } else {
                        deferred.resolve();
                    }
                })
                .error(function(err) {
                    deferred.reject(err);
                });

            return deferred.promise;
        },
        end: function (checkId, opts) {
            var deferred = $q.defer();

            $http.post(settings.baseUrl + '/check/' + checkId + '/end', opts)
                .success(function(data) {
                    if (data.code > 0) {
                        deferred.reject(data.message);
                    } else {
                        deferred.resolve();
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
});
