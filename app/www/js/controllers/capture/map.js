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
        center: [112.71543299448, 29.996487271664],
        zoom: 12
    };


    var center = ol.proj.transform($scope.$parent.location ? $scope.$parent.location : $scope.data.map.center,
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
       maxZoom: 16,
       zoom: $scope.$parent.zoom ? $scope.$parent.zoom : 10
    });

    function zeroPad(num, len, radix) {
        var str = num.toString(radix || 10);
        while (str.length < len) {
            str = "0" + str;
        }
        return str;
    }

    var map = new ol.Map({
        layers: [
            new ol.layer.Tile({
                source: new ol.source.XYZ({
                    url: 'data/map/tianditu/satellite/{z}/{x}/{y}.jpg'
                    // url: 'http://t{0-5}.tianditu.cn/img_w/wmts?SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=img&STYLE=default&TILEMATRIXSET=w&FORMAT=tiles&TILECOL={x}&TILEROW={y}&TILEMATRIX={z}'
                })
            }),
            new ol.layer.Tile({
                source: new ol.source.XYZ({
                    url: 'data/map/tianditu/overlay_s/{z}/{x}/{y}.png'
                    // url: 'http://t{0-5}.tianditu.cn/cia_w/wmts?SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=cia&STYLE=default&TILEMATRIXSET=w&FORMAT=tiles&TILECOL={x}&TILEROW={y}&TILEMATRIX={z}'
                })
            }),
            new ol.layer.Tile({
                source: new ol.source.XYZ({
                    url: 'data/map/tms/{z}/{x}/{y}.png'
               })
            }),
        ],
        renderer: 'dom', // Android手机性能不行，只能采用DOM方式渲染
        target: 'map',
        logo: false,
        view: view
    });

    var hiddenMap = new ol.Map({
        layers: [
            new ol.layer.Vector({
                project: '宜张高速公路宜都至五峰段',
                source: new ol.source.GeoJSON({
                    projection : 'EPSG:4326',
                    url: 'data/geojson/YZ-ROAD.geojson'
                })
            }),
            new ol.layer.Vector({
                project: '湖北监利至江陵高速公路',
                source: new ol.source.GeoJSON({
                    projection : 'EPSG:4326',
                    url: 'data/geojson/JB-ROAD.geojson'
                })
            })
        ],
        // renderer: 'canvas',
        // target: 'map',
        logo: false,
        view: view
    });

    $scope.geolocation = function() {
        $scope.$parent.location = $scope.location = ol.proj.transform(map.getView().getCenter(),
       'EPSG:900913', 'EPSG:4326');
        $scope.$parent.zoom = map.getView().getZoom();
        // geolocation.setTracking(true);
    };

    $scope.$watch('location', function(location) {
        var feature, properties, delta = Number.POSITIVE_INFINITY;
        _.each(hiddenMap.getLayers().getArray(), function(layer) {
            if (!ol.extent.containsCoordinate(layer.getSource().getExtent(), location)) return;

            feature = layer.getSource().getClosestFeatureToCoordinate(location);

            if (!feature || !feature.getProperties()) return;

            $scope.data.properties = feature.getProperties();
            $scope.data.properties.project = layer.getProperties().project;
            if ($scope.data.properties && $scope.data.properties.name) {
                $scope.data.properties.name = $scope.data.properties.name.replace('；', ';');
                $scope.data.properties.object = $scope.data.properties.name.substr(0, $scope.data.properties.name.indexOf(';'));
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
    }, true);

    // var geolocation = new ol.Geolocation({
    //     projection: view.getProjection()
    // });

    // geolocation.on('change', function() {
    //     map.getView().setCenter(geolocation.getPosition());
    //     map.getView().setZoom(16);
    // });


    // function onLocationFound(e) {
    //     var radius = e.accuracy / 2;
    //     e.latlng = L.latLng(30.1855, 111.1790);
    //     map.setView([30.1855, 111.1790], 16);

    //     if (locateCircle) {
    //         map.removeLayer(locateCircle);
    //     }

    //     if (locateMarker) {
    //         map.removeLayer(locateMarker);
    //     }

    //     locateMarker = L.marker(e.latlng).addTo(map);

    //     locateCircle = L.circle(e.latlng, radius).addTo(map);


    //     var tolerance = 1000,
    //         latlons = [],
    //         minDistance = Number.POSITIVE_INFINITY,
    //         layers = YZGS_Polyline_Layer.getLayers(),
    //         feature;
    //     _.each(layers, function(layer) {
    //         latlons = [];
    //         _.each(layer.feature.geometry.coordinates[0], function(coord) {
    //             latlons.push(L.latLng(coord[1], coord[0]));
    //             var distance = L.GeometryUtil.closest(map, latlons, e.latlng, true).distance;
    //             if (distance < minDistance) {
    //                 minDistance = distance;
    //                 feature = layer.feature;
    //             }
    //         });
    //     });

    //     var project, section, branch;
    //     if (minDistance < tolerance) {
    //         project = _.find(resolveProjects, {name: '湖北监利至江陵高速公路'});
    //         if (project) {
    //             section = _.find(_.filter(project.segments, {type: '标段'}), {name: feature.properties.section + '段'});
    //             if (section) {
    //                 branch = _.find(section.segments, {name: feature.properties.branch});
    //             }
    //         }

    //         $scope.$apply(function() {
    //             $scope.data.project = project;
    //             $scope.data.section = section;
    //             $scope.data.branch = branch;
    //             $scope.$parent.data.project = project;
    //             $scope.$parent.data.section = section;
    //             $scope.$parent.data.branch = branch;
    //         });
    //     }
    // }

    // map.on('locationfound', onLocationFound);

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
