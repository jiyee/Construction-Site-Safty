app.controller('AdministratorDashboardCtrl', function($scope, $rootScope, $state, $stateParams, settings, UserService, CheckService, AuthService, resolveUser) {
    $scope.data = {};
    $scope.data.user = resolveUser;
    $scope.data.project = $rootScope._data_.project;

    // var extent = ol.proj.transform([111.56067, 30.50430, 111.24344, 30.29702],
    //     'EPSG:4326', 'EPSG:900913');
    // var center = ol.proj.transform([111.40068, 30.39583],
    //     'EPSG:4326', 'EPSG:900913');

    $scope.data.map = {
        center: $scope.data.project.center,
        extent: $scope.data.project.extent,
        zoom: 12
    };

    var extent = ol.proj.transform($scope.data.map.extent,
        'EPSG:4326', 'EPSG:900913');
    var center = ol.proj.transform($scope.data.map.center,
        'EPSG:4326', 'EPSG:900913');

    var elMap = document.getElementById("map");
    var headerHeight = 44;
    var footerHeight = 0;
    elMap.style.height = (window.innerHeight - headerHeight - footerHeight) + 'px';

    var view = new ol.View({
        projection: 'EPSG:900913',
        center: center,
        minZoom: 10,
        maxZoom: 16,
        zoom: 10
    });

    var server = "";
    // var server = "http://121.40.202.109:8080/";

    var map = new ol.Map({
        layers: [
            new ol.layer.Tile({
                // crossOrigin: 'anonymous',
                // url: '//{a-c}.tile.openstreetmap.org/{z}/{x}/{y}.png'
                source: new ol.source.XYZ({
                    tileUrlFunction: function(coordinate) {
                        if (coordinate === null) {
                            return "";
                        }

                        var z = coordinate[0];
                        var x = coordinate[1];
                        var y = coordinate[2];

                        return server + 'data/' + 'tianditu' + '/' + 'satellite' + '/' + z + '/' + x + '/' + y + '.jpg';
                    },
                    extent: extent,
                    minZoom: 10,
                    maxZoom: 16,
                    wrapx: false
                })
            }),
            new ol.layer.Tile({
                source: new ol.source.XYZ({
                    tileUrlFunction: function(coordinate) {
                        if (coordinate === null) {
                            return "";
                        }

                        var z = coordinate[0];
                        var x = coordinate[1];
                        var y = coordinate[2];

                        return server + 'data/' + 'tianditu' + '/' + 'overlay_s' + '/' + z + '/' + x + '/' + y + '.png';
                    },
                    extent: extent,
                    minZoom: 10,
                    maxZoom: 16,
                    wrapx: false
                })
            }),
            // new ol.layer.Vector({
            //     source: new ol.source.KML({
            //         projection: 'EPSG:4326',
            //         url: 'data/geojson/yzgs.kml'
            //     }),
            //     style: function(feature, resolution) {
            //         var style = new ol.style.Style({
            //             stroke: new ol.style.Stroke({
            //                 color: 'blue',
            //                 width: 4
            //             }),
            //             text: ""
            //         });
            //         return [style];
            //     }
            // }),

            new ol.layer.Tile({
                source: new ol.source.TileWMS({
                    url: 'http://121.40.202.109:8080/geoserver/wms',
                    params: {
                        'LAYERS': 'css:YZGS'
                    },
                    serverType: 'geoserver'
                })
            })
        ],
        renderer: 'dom', // Android手机性能不行，只能采用DOM方式渲染
        target: 'map',
        logo: false,
        view: view
    });

    var geolocation = new ol.Geolocation({
        projection: view.getProjection()
    });

    // update the HTML page when the position changes.
    geolocation.on('change', function() {
        console.log(geolocation.getPosition());
        map.getView().setCenter(geolocation.getPosition());
        map.getView().setZoom(16);
    });

    // handle geolocation error.
    geolocation.on('error', function(error) {
        console.log(error);
    });

    var accuracyFeature = new ol.Feature();
    accuracyFeature.bindTo('geometry', geolocation, 'accuracyGeometry');

    var positionFeature = new ol.Feature();
    positionFeature.bindTo('geometry', geolocation, 'position')
        .transform(function() {}, function(coordinates) {
            return coordinates ? new ol.geom.Point(coordinates) : null;
        });

    var featuresOverlay = new ol.FeatureOverlay({
        map: map,
        features: [accuracyFeature, positionFeature]
    });

    geolocation.setTracking(true);

    $scope.toCapture = function () {
        $state.go('capture.create', {
        });
    };

    $scope.toCaptureList = function () {
        $state.go('capture.list', {
        });
    };

    $scope.toEvaluationList = function () {
        // $state.go('evaluation.list', {
        // });
    };

    $scope.logout = function () {
        AuthService.logout().then(function () {
            $state.go('welcome');
        }, function (err) {
            alert(err);
            $state.go('welcome');
        });
    };
});
