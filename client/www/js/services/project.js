app.factory('ProjectService', function($http, $q, settings) {
    return {
        find: function() {
            var deferred = $q.defer();

            $http.get(settings.baseUrl + '/projects/all')
                .success(function(data) {
                    deferred.resolve(data.projects);
                })
                .error(function(err) {
                    deferred.reject(err);
                });

            return deferred.promise;
        }
    };
});
