app.factory('SegmentService', function($http, $q, settings) {
    return {
        find: function() {
            var deferred = $q.defer();

            $http.get(settings.baseUrl + '/segments/all')
                .success(function(data) {
                    deferred.resolve(data.segments);
                })
                .error(function(err) {
                    deferred.reject(err);
                });

            return deferred.promise;
        },
        findById: function(segmentId) {
            var deferred = $q.defer();

            $http.get(settings.baseUrl + '/segment/' + segmentId)
                .success(function(data) {
                    deferred.resolve(data.segment);
                })
                .error(function(err) {
                    deferred.reject(err);
                });

            return deferred.promise;
        },
        findByProjectId: function(projectId) {
            var deferred = $q.defer();

            $http.get(settings.baseUrl + '/project/' + projectId + '/segments')
                .success(function(data) {
                    deferred.resolve(data.segments);
                })
                .error(function(err) {
                    deferred.reject(err);
                });

            return deferred.promise;
        },
        findByUnitId: function(unitId) {
            var deferred = $q.defer();

            $http.get(settings.baseUrl + '/unit/' + unitId + '/segments')
                .success(function(data) {
                    deferred.resolve(data.segments);
                })
                .error(function(err) {
                    deferred.reject(err);
                });

            return deferred.promise;
        }
    };
});
