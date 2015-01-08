app.factory('UsedCarService', ['$http', '$q', '$log',
    function($http, $q, $log) {
        return {
            query: function(params) {
                var query_url = "/index.php?c=used_car&type=get_cars";
                var d = $q.defer();

                $http.get(query_url, {
                    params: params
                }).success(function(data) {
                    if (data.status === 0) {
                        d.resolve(data.data);
                    } else {
                        d.reject(data);
                    }
                }).error(function(data, status, headers, config) {
                    d.reject(data);
                });

                return d.promise;
            },

            getBrandAndSeries: function() {
                var query_url = "/index.php?c=used_car&type=get_brand_and_series";
                var d = $q.defer();

                $http.get(query_url).success(function(data) {
                    if (data.status === 0) {
                        d.resolve(data.data);
                    } else {
                        d.reject(data);
                    }
                }).error(function(data, status, headers, config) {
                    d.reject(data);
                });

                return d.promise;
            }
        };
    }
]);