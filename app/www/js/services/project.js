app.factory('ProjectService', function($http, $q, settings, WebSQLService) {
    return {
        find: function() {
            var deferred = $q.defer();

            WebSQLService.get('project').then(function(projects) {
                deferred.resolve(projects);
            }, function() {
                $http.get(settings.baseUrl + '/projects/all')
                    .success(function(data) {
                        WebSQLService.set('project', data.projects);
                        deferred.resolve(data.projects);
                    })
                    .error(function(err) {
                        deferred.reject(err);
                    });
            });

            return deferred.promise;
        },
        findById: function(projectId) {
            var deferred = $q.defer();

            WebSQLService.get('project').then(function(projects) {
                var project = _.find(projects, {'_id': projectId});
                deferred.resolve(project);
            }, function() {
                $http.get(settings.baseUrl + '/project/' + projectId)
                    .success(function(data) {
                        if (data.error) {
                            deferred.reject(data.error);
                        } else {
                            deferred.resolve(data.project);
                        }
                    })
                    .error(function(err) {
                        deferred.reject(err);
                    });
            });

            return deferred.promise;
        }
    };
});
