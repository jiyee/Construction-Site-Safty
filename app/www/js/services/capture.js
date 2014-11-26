app.factory('CaptureService', function($http, $q, settings) {
    return {
        find: function() {
            var deferred = $q.defer();

            $http.get(settings.baseUrl + '/captures/all')
                .success(function(data) {
                    deferred.resolve(data.captures);
                })
                .error(function(err) {
                    deferred.reject(err);
                });

            return deferred.promise;
        },
        findById: function(captureId) {
            var deferred = $q.defer();

            $http.get(settings.baseUrl + '/capture/' + captureId)
                .success(function(data) {
                    deferred.resolve(data.capture);
                })
                .error(function(err) {
                    deferred.reject(err);
                });

            return deferred.promise;
        },
        findByUserId: function(userId) {
            var deferred = $q.defer();

            $http.get(settings.baseUrl + '/user/' + userId + '/captures')
                .success(function(data) {
                    deferred.resolve(data.captures);
                })
                .error(function(err) {
                    deferred.reject(err);
                });

            return deferred.promise;
        },
        findByProcessCurrentUserId: function(userId) {
            var deferred = $q.defer();

            $http.get(settings.baseUrl + '/process/' + userId + '/captures')
                .success(function(data) {
                    deferred.resolve(data.captures);
                })
                .error(function(err) {
                    deferred.reject(err);
                });

            return deferred.promise;
        },
        create: function(form) {
            var deferred = $q.defer();

            $http.post(settings.baseUrl + '/capture/create', form)
                .success(function(data) {
                    if (data.code > 0) {
                        deferred.reject(data.message);
                    } else {
                        deferred.resolve(data.capture);
                    }
                })
                .error(function(err) {
                    deferred.reject(err);
                });

            return deferred.promise;
        },
        forward: function(captureId, opts) {
            var deferred = $q.defer();

            $http.post(settings.baseUrl + '/capture/' + captureId + '/forward', opts)
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
        backward: function (captureId, opts) {
            var deferred = $q.defer();

            $http.post(settings.baseUrl + '/capture/' + captureId + '/backward', opts)
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
        revert: function (captureId, opts) {
            var deferred = $q.defer();

            $http.post(settings.baseUrl + '/capture/' + captureId + '/revert', opts)
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
        restore: function (captureId, opts) {
            var deferred = $q.defer();

            $http.post(settings.baseUrl + '/capture/' + captureId + '/restore', opts)
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
        end: function (captureId, opts) {
            var deferred = $q.defer();

            $http.post(settings.baseUrl + '/capture/' + captureId + '/end', opts)
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

            $http.get(settings.baseUrl + '/captures/list/' + projectId + '/' + segmentId + '/' + startDate + '/' + endDate)
                .success(function(data) {
                    deferred.resolve(data.captures);
                })
                .error(function(err) {
                    deferred.reject(err);
                });

            return deferred.promise;
        },
    };
});