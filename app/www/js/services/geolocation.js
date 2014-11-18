app.factory('GeolocationService', function($rootScope, $http, $q, $window, settings) {
    var deferred;

    var geolocation = new ol.Geolocation({
        projection: 'EPSG:4326'
    });

    geolocation.on('change', function() {
        deferred.resolve(geolocation.getPosition());
    });

    geolocation.on('error', function(error) {
        console.log(error);
        deferred.reject(error);
    });

    return {
        getGeolocation: function() {
            deferred = $q.defer();
            geolocation.setTracking(true);
            return deferred.promise;
        },

        stop: function() {
            geolocation.setTracking(false);
        }
    };
});