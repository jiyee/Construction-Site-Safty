app.factory('TableService', function($http, $q, settings) {
    return {
        findById: function(tableId) {
            var deferred = $q.defer();

            $http.get(settings.baseUrl + '/table/' + tableId)
                .success(function(data) {
                    deferred.resolve(data.table);
                })
                .error(function(err) {
                    deferred.reject(err);
                });

            return deferred.promise;
        },
        update: function(tableId, table) {
            var deferred = $q.defer();

            $http.post(settings.baseUrl + '/table/' + tableId + '/update', {
                    table_id: tableId,
                    table: JSON.stringify(table)
                })
                .success(function(data) {
                    if (data.code > 0) {
                        deferred.reject(data.message);
                    } else {
                        deferred.resolve(data.table);
                    }
                })
                .error(function(err) {
                    deferred.reject(err);
                });

            return deferred.promise;
        },
    };
});