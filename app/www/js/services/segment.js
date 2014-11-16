app.factory('SegmentService', function($http, $q, settings, WebSQLService) {
    return {
        find: function() {
            var deferred = $q.defer();

            WebSQLService.get('segment').then(function(segments) {
                deferred.resolve(segments);
            }, function() {
                $http.get(settings.baseUrl + '/segments/all')
                    .success(function(data) {
                        WebSQLService.set('segment', data.segments);
                        deferred.resolve(data.segments);
                    })
                    .error(function(err) {
                        deferred.reject(err);
                    });
            });

            return deferred.promise;
        },
        findById: function(segmentId) {
            var deferred = $q.defer();

            WebSQLService.get('segment').then(function(segments) {
                var segment = _.find(segments, {'_id': segmentId});
                deferred.resolve(segment);
            }, function() {
                $http.get(settings.baseUrl + '/segment/' + segmentId)
                    .success(function(data) {
                        deferred.resolve(data.segment);
                    })
                    .error(function(err) {
                        deferred.reject(err);
                    });
            });

            return deferred.promise;
        },
        findByProjectId: function(projectId) {
            var deferred = $q.defer();

            WebSQLService.get('project').then(function(projects) {
                var project = _.find(projects, {'_id': projectId});
                deferred.resolve(project.segments);
            }, function() {
                $http.get(settings.baseUrl + '/project/' + projectId + '/segments')
                    .success(function(data) {
                        deferred.resolve(data.segments);
                    })
                    .error(function(err) {
                        deferred.reject(err);
                    });
            });

            return deferred.promise;
        },
        findByUnitId: function(unitId) {
            var deferred = $q.defer();

            WebSQLService.get('segment').then(function(segments) {
                segments = _.filter(segments, function(segment) {
                    return segment.units && _.where(segment.units, {_id: unitId}).length > 0;
                });
                deferred.resolve(segments);
            }, function() {
                $http.get(settings.baseUrl + '/unit/' + unitId + '/segments')
                    .success(function(data) {
                        deferred.resolve(data.segments);
                    })
                    .error(function(err) {
                        deferred.reject(err);
                    });
            });

            return deferred.promise;
        }
    };
});
