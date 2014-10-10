app.factory('PartService', function($http, $q, settings) {
    return {
        find: function() {
            var deferred = $q.defer();

            $http.get(settings.baseUrl + '/parts')
                .success(function(data) {
                    deferred.resolve(data.parts);
                })
                .error(function(err) {
                    deferred.reject(err);
                });

            return deferred.promise;
        },
        findById: function(partId) {
            var deferred = $q.defer();

            $http.get(settings.baseUrl + '/part/' + partId)
                .success(function(data) {
                    deferred.resolve(data.part);
                })
                .error(function(err) {
                    deferred.reject(err);
                });

            return deferred.promise;
        },
        findByProjectId: function(projectId) {
            var deferred = $q.defer();

            $http.get(settings.baseUrl + '/project/' + projectId + '/parts')
                .success(function(data) {
                    deferred.resolve(data.parts);
                })
                .error(function(err) {
                    deferred.reject(err);
                });

            return deferred.promise;
        }
    };
});
