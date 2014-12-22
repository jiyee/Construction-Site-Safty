app.controller('CaptureMapCtrl', function($scope, $rootScope, $state, $stateParams, $timeout, $ionicModal, settings, ProjectService, SegmentService, CaptureService, AuthService, resolveUser, resolveProjects) {
    $scope.data = {};
    $scope.location = {};
    $scope.data.user = resolveUser;
    $scope.data.properties = $scope.$parent.properties;

    // 用户登录状态异常控制
    if (!$scope.data.user) {
        alert('用户登录状态异常');
        AuthService.logout().then(function() {
            $state.go('welcome');
        });
    }

    $scope.data.map = {
        latlng: [29.996487271664, 112.71543299448],
        zoom: 10
    };

    // var elMap = document.getElementById("map");
    // var headerHeight = 44;
    // var footerHeight = 0;
    // elMap.style.height = (window.innerHeight - headerHeight - footerHeight) + 'px';
    // setTimeout(function() {
    //    elMap.style.height = (window.innerHeight - headerHeight - footerHeight) + 'px';
    // }, 1000);

    var map = L.map('map', {
        attributionControl: false
    });

    var locateMarker, locateCircle;

    if ($scope.$parent.location && $scope.$parent.location.latlng && $scope.$parent.location.accuracy) {
        var latlng = $scope.$parent.location.latlng,
            radius = $scope.$parent.location.accuracy / 2;
        locateMarker = L.marker(latlng).addTo(map)
            .bindPopup("定位成功，定位半径" + radius + "米").openPopup();
        locateCircle = L.circle(latlng, radius).addTo(map);
        map.setView($scope.$parent.location.latlng, $scope.$parent.location.zoom || 16);
    } else {
        $scope.$parent.location = {};
        map.setView($scope.data.map.latlng, $scope.data.map.zoom);
        map.locate({setView: true, maxZoom: 16});
    }

    map.on('click', function(e) {
        if (e.originalEvent.target.id === 'mocklocation') {
            $scope.mocklocation();
            e.originalEvent.preventDefault();
            e.originalEvent.stopPropagation();
        }

        if (e.originalEvent.target.id === 'geolocation') {
            $scope.geolocation();
            e.originalEvent.preventDefault();
            e.originalEvent.stopPropagation();
        }
    });

    map.on('moveend', function() {
        $scope.$parent.location.latlng = map.getCenter();
    });

    map.on('zoomend', function() {
        $scope.$parent.location.zoom = map.getZoom();
    });

    var satellite = 'data/map/tianditu/satellite/{z}/{x}/{y}.jpg';
    var satellite_online = 'http://t{s}.tianditu.cn/img_w/wmts?SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=img&STYLE=default&TILEMATRIXSET=w&FORMAT=tiles&TILECOL={x}&TILEROW={y}&TILEMATRIX={z}';

    var overlay_s = 'data/map/tianditu/overlay_s/{z}/{x}/{y}.png';
    var overlay_s_online = 'http://t{s}.tianditu.cn/cia_w/wmts?SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=cia&STYLE=default&TILEMATRIXSET=w&FORMAT=tiles&TILECOL={x}&TILEROW={y}&TILEMATRIX={z}';

    if (navigator.network &&
        navigator.network.connection &&
        (navigator.network.connection.type === Connection.WIFI ||
         navigator.network.connection.type === Connection.CELL_2G ||
         navigator.network.connection.type === Connection.CELL_3G)) {
    L.tileLayer(satellite_online, {
        subdomains: [0, 1, 2, 3, 4, 5],
        maxZoom: 16,
        id: 'map.satellite_online'
    }).addTo(map);
    }

    L.tileLayer(satellite, {
        maxZoom: 16,
        id: 'map.satellite'
    }).addTo(map);

    if (navigator.network &&
        navigator.network.connection &&
        (navigator.network.connection.type === Connection.WIFI ||
         navigator.network.connection.type === Connection.CELL_2G ||
         navigator.network.connection.type === Connection.CELL_3G)) {
    L.tileLayer(overlay_s_online, {
        subdomains: [0, 1, 2, 3, 4, 5],
        maxZoom: 16,
        id: 'map.overlay_s_online'
    }).addTo(map);
    }

    L.tileLayer(overlay_s, {
        maxZoom: 16,
        id: 'map.overlay_s'
    }).addTo(map);


    L.tileLayer('data/map/tms/{z}/{x}/{y}.png', {
        maxZoom: 16,
        id: 'map.tms'
    }).addTo(map);

    function onLocationFound(location) {
        location.zoom = 16;

        $scope.$apply(function() {
            $scope.$parent.location = $scope.location = location;
        });

        var radius = location.accuracy / 2;

        if (locateMarker) {
             map.removeLayer(locateMarker);
        }
        if (locateCircle) {
            map.removeLayer(locateCircle);
        }

        locateMarker = L.marker(location.latlng).addTo(map)
            .bindPopup("定位成功，定位半径" + radius + "米").openPopup();
        locateCircle = L.circle(location.latlng, radius).addTo(map);
    }

    function onLocationError(err) {
        // alert("定位失败");
    }

    map.on('locationfound', onLocationFound);
    map.on('locationerror', onLocationError);

    var ROADS = {}, POINTS = {};
    L.Util.ajax("data/geojson/JB-ROAD.geojson").then(function(data) {
        ROADS.JB = data;
        ROADS.JB.project = '湖北监利至江陵高速公路';
    });
    L.Util.ajax("data/geojson/YZ-ROAD.geojson").then(function(data) {
        ROADS.YZ = data;
        ROADS.YZ.project = '宜张高速公路宜都至五峰段';
    });
    L.Util.ajax("data/geojson/JB-POINT.geojson").then(function(data) {
        POINTS.JB = data;
    });
    L.Util.ajax("data/geojson/YZ-POINT.geojson").then(function(data) {
        POINTS.YZ = data;
    });

    $scope.$watch('location', function(location) {
        if (_.isEmpty(location)) return;

        var feature, properties, tolerance = 1000, delta = Number.POSITIVE_INFINITY;

        _.each(ROADS, function(layer, key) {
            _.each(layer.features, function(_feature) {
                latlons = [];
                if (_.isEmpty(_feature.geometry)) return;
                _.each(_feature.geometry.coordinates[0], function(coord) {
                    latlons.push(L.latLng(coord[1], coord[0]));
                    var distance = L.GeometryUtil.closest(map, latlons, location.latlng, true).distance;
                    if (distance < delta) {
                        delta = distance;
                        feature = _feature;
                        feature.properties.project = layer.project;
                    }
                });
            });
        });

        if (!feature || delta > tolerance) return;

        $scope.data.properties = feature.properties;
        $scope.data.properties.project = feature.properties.project;
        if ($scope.data.properties && $scope.data.properties.name) {
            $scope.data.properties.name = $scope.data.properties.name;

            if (!~$scope.data.properties.name.indexOf('路基')) {
                $scope.data.properties.object = $scope.data.properties.name;
            } else {
                feature = null;
                delta = Number.POSITIVE_INFINITY;
                _.each(POINTS, function(layer, key) {
                    _.each(layer.features, function(_feature) {
                        latlons = [];
                        if (_.isEmpty(_feature.geometry)) return;
                        latlons.push(L.latLng(_feature.geometry.coordinates[0][1], _feature.geometry.coordinates[0][0]));
                        var distance = L.GeometryUtil.closest(map, latlons, location.latlng, true).distance;
                        if (distance < delta) {
                            delta = distance;
                            feature = _feature;
                            feature.properties.project = layer.project;
                        }
                    });
                });

                if (feature && delta < tolerance) {
                    $scope.data.properties.name += feature.properties.name;
                    $scope.data.properties.object += feature.properties.name;
                }
            }
        }

        $scope.$parent.properties = $scope.data.properties;

        if ($scope.data.properties.project) {
            ProjectService.find().then(function(projects) {
                $scope.$parent.data.project = _.find(projects, {
                    name: $scope.data.properties.project
                });
                $scope.$parent.data.section = $scope.$parent.data.branch = null;

                if ($scope.data.properties.section) {
                    SegmentService.findByProjectId($scope.$parent.data.project._id).then(function(segments) {
                        $scope.$parent.data.section = _.find(segments, {
                            name: $scope.data.properties.section + '段'
                        });

                        if ($scope.data.properties.branch) {
                            SegmentService.findById($scope.$parent.data.section._id).then(function(segment) {
                                $scope.$parent.data.branch = _.find(segment.segments, {
                                    name: $scope.data.properties.branch
                                });
                            });
                        }
                    });
                }
            });
        }
    });

    $scope.mocklocation = function() {
        var location = {
            latlng: map.getCenter(),
            accuracy: 0,
            zoom: 16
        };
        map.setView(location.latlng, location.zoom);

        $scope.$apply(function() {
            $scope.$parent.location = $scope.location = location;
        });

        if (locateMarker) {
             map.removeLayer(locateMarker);
        }
        if (locateCircle) {
            map.removeLayer(locateCircle);
        }

        var radius = location.accuracy / 2;
        locateMarker = L.marker(location.latlng).addTo(map)
            .bindPopup("模拟定位成功").openPopup();
        locateCircle = L.circle(location.latlng, radius).addTo(map);
    };

    $scope.geolocation = function() {
        map.stopLocate();
        map.locate({
            enableHighAccuracy: true,
            setView: true,
            maxZoom: 16
        });
    };

    $scope.toCaptureCreate = function(item) {
        $state.go('^.create');
    };

    $scope.toCaptureList = function(item) {
        $state.go('^.list');
    };

    $scope.toBack = function() {
        $state.go([$scope.data.user.role, 'dashboard'].join('.'), {
            userId: $scope.data.user._id
        });
    };

    $scope.$on('$destroy', function() {
        map.stopLocate();
        map.remove();
    });

    $ionicModal.fromTemplateUrl('setup-modal.html', {
        scope: $scope,
    }).then(function(modal) {
        $scope.modal = modal;

        $scope.data.projects = resolveProjects;

        // 自动选中默认项目、标段
        // if ($scope.data.user.project) {
        //     $scope.data.project = _.find($scope.data.projects, {
        //         _id: $scope.data.user.project._id
        //     });
        // }

        // if ($scope.data.project) {
        //     SegmentService.findByProjectId($scope.data.project._id).then(function(segments) {
        //         $scope.data.sections = segments;

        //         if ($scope.data.user.section && !$scope.data.section) {
        //             // BUG 只有延时才能解决默认选中问题
        //             $timeout(function() {
        //                 $scope.data.section = _.find($scope.data.sections, {
        //                     _id: $scope.data.user.section._id
        //                 });
        //             }, 100);
        //         }
        //     });
        // }

        $scope.$watch('data.project', function(project) {
            if (!project) return;

            SegmentService.findByProjectId(project._id).then(function(segments) {
                $scope.data.sections = segments;

                if ($scope.data.section) {
                    // BUG 只有延时才能解决默认选中问题
                    $timeout(function() {
                        $scope.data.section = _.find($scope.data.sections, {
                            _id: $scope.data.section._id
                        });
                    }, 100);
                }
            });
        });

        $scope.$watch('data.section', function(section) {
            if (!section) return;

            SegmentService.findById(section._id).then(function(segment) {
                $scope.data.branches = segment.segments;

                if ($scope.data.branch) {
                    // BUG 只有延时才能解决默认选中问题
                    $timeout(function() {
                        $scope.data.branch = _.find($scope.data.branches, {
                            _id: $scope.data.branch._id
                        });
                    }, 100);
                }
            });
        });
    });
    $scope.openModal = function($event) {
        $scope.modal.show($event);
    };
    $scope.closeModal = function() {
        $scope.modal.hide();
    };
    $scope.submit = function() {
        $scope.$parent.data.project = $scope.data.project;
        $scope.$parent.data.section = $scope.data.section;
        $scope.$parent.data.branch = $scope.data.branch;

        alert('保存成功');
        $scope.closeModal();
    };
});
