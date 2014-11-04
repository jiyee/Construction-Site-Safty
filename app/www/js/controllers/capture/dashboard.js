app.controller('CaptureDashboardCtrl', function($scope, $rootScope, $state, $stateParams, settings, ProjectService, SegmentService, UserService, CaptureService, AuthService, categories, resolveUser) {
    $scope.data = {};
    $scope.data.user = resolveUser;

    // 用户登录状态异常控制
    if (!$scope.data.user) {
        alert('用户登录状态异常');
        AuthService.logout().then(function() {
            $state.go('welcome');
        });
    }

    $scope.data.project = {
        extent: [111.56067, 30.50430, 111.24344, 30.29702],
        center: [111.40068, 30.39583]
    };

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
    setTimeout(function() {
        elMap.style.height = (window.innerHeight - headerHeight - footerHeight) + 'px';
    }, 1000);

    var view = new ol.View({
        projection: 'EPSG:900913',
        center: center,
        minZoom: 2,
        maxZoom: 17,
        zoom: 10
    });

    // var server = "http://121.40.202.109:8080/";
    // var server = "";
    var map = new ol.Map({
        layers: [
            new ol.layer.Tile({
                source: new ol.source.XYZ({
                    url: 'http://t{0-5}.tianditu.cn/img_w/wmts?SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=img&STYLE=default&TILEMATRIXSET=w&FORMAT=tiles&TILECOL={x}&TILEROW={y}&TILEMATRIX={z}'
                        //     tileUrlFunction: function(coordinate) {
                        //         if (coordinate === null) {
                        //             return "";
                        //         }

                    //         var z = coordinate[0];
                    //         var x = coordinate[1];
                    //         var y = coordinate[2];

                    //         return "http://t0.tianditu.cn/img_w/wmts?SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=img&STYLE=default&TILEMATRIXSET=w&FORMAT=tiles&TILECOL=" + x + "&TILEROW=" + y + "&TILEMATRIX=" + z;
                    //         // return server + 'data/' + 'tianditu' + '/' + 'satellite' + '/' + z + '/' + x + '/' + y + '.jpg';
                    //     },
                    //     extent: extent,
                    //     minZoom: 10,
                    //     maxZoom: 16,
                    //     wrapx: false
                })
            }),
            new ol.layer.Tile({
                source: new ol.source.XYZ({
                    url: 'http://t{0-5}.tianditu.cn/cia_w/wmts?SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=cia&STYLE=default&TILEMATRIXSET=w&FORMAT=tiles&TILECOL={x}&TILEROW={y}&TILEMATRIX={z}'
                        // tileUrlFunction: function(coordinate) {
                        //     if (coordinate === null) {
                        //         return "";
                        //     }

                    //     var z = coordinate[0];
                    //     var x = coordinate[1];
                    //     var y = coordinate[2];

                    //     return "http://t1.tianditu.com/cia_w/wmts?SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=cia&STYLE=default&TILEMATRIXSET=w&FORMAT=tiles&TILECOL=" + x + "&TILEROW=" + y + "&TILEMATRIX=" + z;
                    //     // return server + 'data/' + 'tianditu' + '/' + 'overlay_s' + '/' + z + '/' + x + '/' + y + '.png';
                    // },
                    // extent: extent,
                    // minZoom: 10,
                    // maxZoom: 16,
                    // wrapx: false
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
        // console.log(geolocation.getPosition());
        map.getView().setCenter(geolocation.getPosition());
        // map.getView().setZoom(16);
    });

    // handle geolocation error.
    geolocation.on('error', function(error) {
        console.log(error);
    });

    // var accuracyFeature = new ol.Feature();
    // accuracyFeature.bindTo('geometry', geolocation, 'accuracyGeometry');

    var positionFeature = new ol.Feature({
        geometry: new ol.geom.Point([13358338.89519283, 3503549.843504374]),
        style: new ol.style.Style({
            image: new ol.style.Circle({
                fill: new ol.style.Fill({
                    color: 'rgba(255,255,0,0.5)'
                }),
                radius: 5,
                stroke: new ol.style.Stroke({
                    color: '#ff0',
                    width: 1
                })
            })
        })
    });
    // positionFeature.bindTo('geometry', geolocation, 'position')
    // .transform(function() {}, function(coordinates) {
    // return coordinates ? new ol.geom.Point(coordinates) : null;
    // });

    var defaultStyle = {
        'Point': [new ol.style.Style({
            image: new ol.style.Circle({
                fill: new ol.style.Fill({
                    color: 'rgba(255,255,0,0.5)'
                }),
                radius: 5,
                stroke: new ol.style.Stroke({
                    color: '#ff0',
                    width: 1
                })
            })
        })],
        'LineString': [new ol.style.Style({
            stroke: new ol.style.Stroke({
                color: '#f00',
                width: 3
            })
        })],
        'Polygon': [new ol.style.Style({
            fill: new ol.style.Fill({
                color: 'rgba(0,255,255,0.5)'
            }),
            stroke: new ol.style.Stroke({
                color: '#0ff',
                width: 1
            })
        })],
        'MultiPoint': [new ol.style.Style({
            image: new ol.style.Circle({
                fill: new ol.style.Fill({
                    color: 'rgba(255,0,255,0.5)'
                }),
                radius: 5,
                stroke: new ol.style.Stroke({
                    color: '#f0f',
                    width: 1
                })
            })
        })],
        'MultiLineString': [new ol.style.Style({
            stroke: new ol.style.Stroke({
                color: '#0f0',
                width: 3
            })
        })],
        'MultiPolygon': [new ol.style.Style({
            fill: new ol.style.Fill({
                color: 'rgba(0,0,255,0.5)'
            }),
            stroke: new ol.style.Stroke({
                color: '#00f',
                width: 1
            })
        })]
    };

    var styleFunction = function(feature, resolution) {
        var featureStyleFunction = feature.getStyleFunction();
        if (featureStyleFunction) {
            return featureStyleFunction.call(feature, resolution);
        } else {
            return defaultStyle[feature.getGeometry().getType()];
        }
    };
    var featureLayer = new ol.layer.Image({
        source: new ol.source.ImageVector({
            source: new ol.source.Vector({
                // projection: view.getProjection(),
                features: [positionFeature]
                    // style: styleFunction
            })
        })
    });
    // map.addLayer(featureLayer);

    $scope.geolocation = function() {
        geolocation.setTracking(true);
    };

    $scope.toBack = function () {
        $state.go([settings.roles[$scope.data.user.role.name], 'dashboard'].join('.'), {
            userId: $scope.data.user._id
        });
    };
});
