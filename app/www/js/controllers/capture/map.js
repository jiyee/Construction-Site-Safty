app.controller('CaptureMapCtrl', function($scope, $rootScope, $state, $stateParams, $timeout, $ionicModal, settings, SegmentService, CaptureService, AuthService, resolveUser, resolveProjects) {
    $scope.data = {};
    $scope.location = {};
    $scope.data.user = resolveUser;

    // 用户登录状态异常控制
    if (!$scope.data.user) {
        alert('用户登录状态异常');
        AuthService.logout().then(function() {
            $state.go('welcome');
        });
    }

    $scope.data.map = {
        center: [30.39583, 111.40068],
        zoom: 12
    };

    var map = L.map('map', {
        minZoom: 1,
        maxZoom: 16
    }).setView($scope.data.map.center, $scope.data.map.zoom);

    // 底图图层，采用天地图数据
    L.tileLayer('http://t{s}.tianditu.cn/img_w/wmts?SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=img&STYLE=default&TILEMATRIXSET=w&FORMAT=tiles&TILECOL={x}&TILEROW={y}&TILEMATRIX={z}', {
        subdomains: [0, 1, 2, 3, 4, 5],
        maxZoom: 16
    }).addTo(map);

    // 标注图层
    L.tileLayer('http://t{s}.tianditu.cn/cia_w/wmts?SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=cia&STYLE=default&TILEMATRIXSET=w&FORMAT=tiles&TILECOL={x}&TILEROW={y}&TILEMATRIX={z}', {
        subdomains: [0, 1, 2, 3, 4, 5],
        maxZoom: 16
    }).addTo(map);

    // 道路线图层
    var YZGS_Polyline_Layer;
    L.Util.ajax("data/geojson/YZ-Road.geojson").then(function(data) {
        function onEachFeature(feature, layer) {
            if (feature.properties) {
                layer.bindPopup([feature.properties.section, feature.properties.branch, feature.properties.name].join('-'));
            }
        }

        YZGS_Polyline_Layer = L.geoJson(data, {
            style: function (feature) {
                if (!feature.properties.RefName) {
                    return {
                        "color": "#FFFF00",
                        "weight": 5
                    };
                } else if (feature.properties.RefName === '路基') {
                    return {
                        "color": "#FFFF00",
                        "weight": 5
                    };
                } else if (!!~feature.properties.RefName.indexOf('桥')) {
                    return {
                        "color": "#FF0000",
                        "weight": 5
                    };
                } else if (!!~feature.properties.RefName.indexOf('隧道')) {
                    return {
                        "color": "#0000FF",
                        "weight": 5
                    };
                } else {
                    return {
                        "color": "#FFFF00",
                        "weight": 5
                    };
                }
            },
            onEachFeature: onEachFeature
        }).addTo(map);
    });

    L.Util.ajax("data/geojson/YZ-POINT.geojson").then(function(data) {
        L.geoJson(data, {
            pointToLayer: function(feature, latlng) {
                return L.circleMarker(latlng, {
                    radius: 4,
                    fillColor: "#FFFFFF",
                    color: "#000",
                    weight: 1,
                    opacity: 1,
                    fillOpacity: 0.8
                }).bindLabel(feature.properties.name, {
                    // noHide: true
                });
            }
        }).addTo(map);
    });

    // 道路线图层
    var JBGS_Polyline_Layer;
    L.Util.ajax("data/geojson/JB-Road.geojson").then(function(data) {
        function onEachFeature(feature, layer) {
            if (feature.properties) {
                layer.bindPopup([feature.properties.section, feature.properties.branch, feature.properties.name].join('-'));
            }
        }

        JBGS_Polyline_Layer = L.geoJson(data, {
            style: function (feature) {
                if (!feature.properties.RefName) {
                    return {
                        "color": "#FFFF00",
                        "weight": 5
                    };
                } else if (feature.properties.RefName === '路基') {
                    return {
                        "color": "#FFFF00",
                        "weight": 5
                    };
                } else if (!!~feature.properties.RefName.indexOf('桥')) {
                    return {
                        "color": "#FF0000",
                        "weight": 5
                    };
                } else if (!!~feature.properties.RefName.indexOf('隧道')) {
                    return {
                        "color": "#0000FF",
                        "weight": 5
                    };
                } else {
                    return {
                        "color": "#FFFF00",
                        "weight": 5
                    };
                }
            },
            onEachFeature: onEachFeature
        }).addTo(map);
    });

    L.Util.ajax("data/geojson/JB-POINT.geojson").then(function(data) {
        L.geoJson(data, {
            pointToLayer: function(feature, latlng) {
                return L.circleMarker(latlng, {
                    radius: 4,
                    fillColor: "#FFFFFF",
                    color: "#000",
                    weight: 1,
                    opacity: 1,
                    fillOpacity: 0.8
                }).bindLabel(feature.properties.name, {
                    // noHide: true
                });
            }
        }).addTo(map);
    });


    // 开启定位
    map.locate({setView: true, maxZoom: 16});

    var locateMarker, locateCircle;

    function onLocationFound(e) {
        var radius = e.accuracy / 2;
        e.latlng = L.latLng(30.1855, 111.1790);
        map.setView([30.1855, 111.1790], 16);

        if (locateCircle) {
            map.removeLayer(locateCircle);
        }

        if (locateMarker) {
            map.removeLayer(locateMarker);
        }

        locateMarker = L.marker(e.latlng).addTo(map);

        locateCircle = L.circle(e.latlng, radius).addTo(map);


        var tolerance = 1000,
            latlons = [],
            closestDistance = Number.POSITIVE_INFINITY,
            layers = YZGS_Polyline_Layer.getLayers(),
            feature;
        _.each(layers, function(layer) {
            latlons = [];
            _.each(layer.feature.geometry.coordinates[0], function(coord) {
                latlons.push(L.latLng(coord[1], coord[0]));
                var distance = L.GeometryUtil.closest(map, latlons, e.latlng, true).distance;
                if (distance < closestDistance) {
                    closestDistance = distance;
                    feature = layer.feature;
                }
            });
        });

        var project, section, branch;
        if (closestDistance < tolerance) {
            project = _.find(resolveProjects, {name: '湖北监利至江陵高速公路'});
            if (project) {
                section = _.find(_.filter(project.segments, {type: '标段'}), {name: feature.properties.section + '段'});
                if (section) {
                    branch = _.find(section.segments, {name: feature.properties.branch});
                }
            }

            $scope.$apply(function() {
                $scope.data.project = project;
                $scope.data.section = section;
                $scope.data.branch = branch;
                $scope.$parent.data.project = project;
                $scope.$parent.data.section = section;
                $scope.$parent.data.branch = branch;
                console.log(project, section, branch);
            });
        }
    }

    map.on('locationfound', onLocationFound);

    $scope.geolocation = function() {
        map.locate({
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
