app.factory('UnitService', function($http, $q, settings, WebSQLService) {
    return {
        find: function() {
            var deferred = $q.defer();

            WebSQLService.get('unit').then(function(units) {
                deferred.resolve(units);
            }, function() {
                $http.get(settings.baseUrl + '/units/all')
                    .success(function(data) {
                        WebSQLService.set('unit', data.units);
                        deferred.resolve(data.units);
                    })
                    .error(function(err) {
                        deferred.reject(err);
                    });
            });

            return deferred.promise;
        },
        findById: function(unitId) {
            var deferred = $q.defer();

            WebSQLService.get('unit').then(function(units) {
                var unit = _.find(units, {'_id': unitId});
                deferred.resolve(unit);
            }, function() {
                $http.get(settings.baseUrl + '/unit/' + unitId)
                    .success(function(data) {
                        deferred.resolve(data.unit);
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
                deferred.resolve(project.units);
            }, function() {
                $http.get(settings.baseUrl + '/project/' + projectId + '/units')
                    .success(function(data) {
                        deferred.resolve(data.units);
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
                deferred.resolve(segment.units);
            }, function() {
                $http.get(settings.baseUrl + '/segment/' + segmentId + '/units')
                    .success(function(data) {
                        deferred.resolve(data.units);
                    })
                    .error(function(err) {
                        deferred.reject(err);
                    });
            });

            return deferred.promise;
        }
    };
});
