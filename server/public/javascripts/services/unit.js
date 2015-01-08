app.factory('UnitService', function($http, $q, settings) {
    return {
        find: function() {
            var deferred = $q.defer();

            $http.get(settings.baseUrl + '/units/all')
                .success(function(data) {
                    deferred.resolve(data.units);
                })
                .error(function(err) {
                    deferred.reject(err);
                });

            return deferred.promise;
        },
        findById: function(unitId) {
            var deferred = $q.defer();


            $http.get(settings.baseUrl + '/unit/' + unitId)
                .success(function(data) {
                    deferred.resolve(data.unit);
                })
                .error(function(err) {
                    deferred.reject(err);
                });

            return deferred.promise;
        },
        findByProjectId: function(projectId) {
            var deferred = $q.defer();

            $http.get(settings.baseUrl + '/project/' + projectId + '/units')
                .success(function(data) {
                    deferred.resolve(data.units);
                })
                .error(function(err) {
                    deferred.reject(err);
                });

            return deferred.promise;
        },
        findBySegmentId: function(segmentId) {
            var deferred = $q.defer();

            $http.get(settings.baseUrl + '/segment/' + segmentId + '/units')
                .success(function(data) {
                    deferred.resolve(data.units);
                })
                .error(function(err) {
                    deferred.reject(err);
                });

            return deferred.promise;
        }
    };
});
