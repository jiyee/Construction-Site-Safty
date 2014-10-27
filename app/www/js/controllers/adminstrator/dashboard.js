app.controller('AdministratorDashboardCtrl', function($scope, $rootScope, $state, $stateParams, settings, UserService, CheckService, AuthService, resolveUser) {
    $scope.data = {};
    $scope.data.user = resolveUser;

    var extent = ol.proj.transform([111.56067, 30.50430, 111.24344, 30.29702],
        'EPSG:4326', 'EPSG:900913');
    var center = ol.proj.transform([111.40068, 30.39583],
        'EPSG:4326', 'EPSG:900913');

    var mousePositionControl = new ol.control.MousePosition({
        coordinateFormat: ol.coordinate.createStringXY(10),
        projection: 'EPSG:4326',
        className: 'ol-mouse-position',
        target: document.getElementById('mouse-position'),
        undefinedHTML: '&nbsp;'
    });

    var elMap = document.getElementById("map");
    var topBannerHeight = 44;
    elMap.style.height = (window.innerHeight - topBannerHeight) + 'px';

    var map = new ol.Map({
        controls: ol.control.defaults({
            attributionOptions: ({
                collapsible: false
            })
        }).extend([mousePositionControl]),
        layers: [
            new ol.layer.Tile({
                // crossOrigin: 'anonymous',
                // url: '//{a-c}.tile.openstreetmap.org/{z}/{x}/{y}.png'
                source: new ol.source.XYZ({
                    tileUrlFunction: function(coordinate) {
                        if (coordinate === undefined) {
                            return "";
                        }

                        var z = coordinate[0];
                        var x = coordinate[1];
                        var y = coordinate[2];

                        return 'http://121.40.202.109:8080/data/' + 'tianditu' + '/' + 'satellite' + '/' + z + '/' + x + '/' + y + '.jpg';
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
                        if (coordinate === undefined) {
                            return "";
                        }

                        var z = coordinate[0];
                        var x = coordinate[1];
                        var y = coordinate[2];

                        return 'http://121.40.202.109:8080/data/' + 'tianditu' + '/' + 'overlay_s' + '/' + z + '/' + x + '/' + y + '.png';
                    },
                    extent: extent,
                    minZoom: 10,
                    maxZoom: 16,
                    wrapx: false
                })
            }),
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
        renderer: 'canvas',
        target: 'map',
        logo: false,
        view: new ol.View({
            projection: 'EPSG:900913',
            center: center,
            zoom: 12
        })
    });

    // map.getView().fitExtent(extent, map.getSize());
});
