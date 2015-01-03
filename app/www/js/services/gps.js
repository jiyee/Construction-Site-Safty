app.factory('GpsService', function($rootScope, $http, $q, settings) {

    return {
        create: function(gps) {
            var deferred = $q.defer();

            $http.post(settings.baseUrl + '/gps/create', gps)
                .success(function(data) {
                    if (data.code > 0) {
                        deferred.reject(data.message);
                    } else {
                        deferred.resolve(data);
                    }
                })
                .error(function(err) {
                    deferred.reject(err);
                });

            return deferred.promise;
        }
    };
});
