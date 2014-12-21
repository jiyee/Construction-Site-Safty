app.controller('EvaluationCustomizeCtrl', function($scope, $rootScope, $state, $stateParams, settings, ProjectService, SegmentService, UserService, UnitService, CheckService, EvaluationService, OfflineService, AuthService, resolveUser) {
    $scope.data = {};
    $scope.data.user = resolveUser;
    $scope.data.evaluation = {};
    $scope.data.evaluationId = $stateParams.evaluationId;
    $scope.data.syncData = $rootScope.data.evaluation ? $rootScope.data.evaluation[$scope.data.evaluationId] : {};

    if ($scope.data.syncData) {
        if ($scope.data.syncData.checks) {
            $scope.allowSyncChecks = $scope.data.syncData.checks.length > 0;
        }

        if ($scope.data.syncData.captures) {
            $scope.allowSyncCaptures = $scope.data.syncData.captures.length > 0;
        }
    }

    OfflineService.findById($scope.data.evaluationId).then(function(evaluation) {
        $scope.data.evaluation = evaluation;
    });

    function find(collections, condition) {
        if (collections.length === 0) return;

        var found;
        _.each(collections, function(item) {
            if (item[condition.key] === condition.value) {
                found = item;
                return found;
            }
        });

        return found;
    }

    $scope.syncChecks = function(bool) {
        if (bool) {
            var reLink = /(SGJC|SGXCTY|SGXCGL|SGXCSY)-([A-Z])-([A-Z][0-9]+)-([0-9])+/;
            var table, matches, file, level1, level2, level3;
            var checked_items = _.flatten(_.pluck($scope.data.syncData.checks, 'checked_items'));

            // 挂接所有的日常巡查到对应表单的level3
            _.each(checked_items, function(item) {
                if (!item.link) return;

                matches = item.link.match(reLink);

                if (!matches || matches.length === 0) return;

                item._link = {};
                item._link.file = matches[1];
                item._link.level1 = matches[2];
                item._link.level2 = matches[3];
                item._link.level3 = matches[4];

                table = find($scope.data.evaluation.tables, {
                    key: 'file',
                    value: item._link.file
                });

                if (!table) return;

                level1 = find(table.items, {
                    key: 'index',
                    value: item._link.level1
                });

                if (!level1) return;

                level2 = find(level1.items, {
                    key: 'index',
                    value: item._link.level2
                });

                if (!level2) return;

                level3 = find(level2.items, {
                    key: 'index',
                    value: item._link.level3
                });

                if (!level3) return;

                delete item._link;

                item._type = 'check';

                level3.is_checked = true;
                level3.linked = true; // 是否属于关联结果，走流程时去除
                level3.checked_items = level3.checked_items || [];
                level3.checked_items.push(item);
            });
        } else {
            _.each($scope.data.evaluation.tables, function(table) {
                _.each(table.items, function(level1) {
                    _.each(level1.items, function(level2) {
                        _.each(level2.items, function(level3) {
                            _.each(level3.checked_items, function(item) {
                                if (item._type === 'capture') {
                                    item.is_checked = false;
                                    level3.linked = false;
                                    item.score = null;
                                    item.status = 'UNCHECK';
                                }
                            });

                            level3.checked_items = _.filter(level3.checked_items, function(item) {
                                return !item._type || item._type !== 'check';
                            });
                        });
                    });
                });
            });
        }

        calculateSyncScore();
    };

    $scope.syncCaptures = function (bool) {
        if (bool) {
            var archives = _.flatten(_.pluck($scope.data.syncData.captures, 'archives'));

            var reLink = /(SGJC|SGXCTY|SGXCGL|SGXCSY)-([A-Z])-([A-Z][0-9]+)-([0-9])+/;
            var table, file, level1, level2, level3;

            // 挂接所有的安全检查到对应表单的level3
            _.each(archives, function(item) {
                if (!item.level3) return;

                _.each($scope.data.evaluation.tables, function(table) {
                    _.each(table.items, function(level1) {
                        _.each(level1.items, function(level2) {
                            _.each(level2.items, function(level3) {
                                if (!!~level3.name.indexOf(item.level3)) {
                                    level3.is_checked = true;
                                    level3.linked = true;
                                    level3.checked_items = level3.checked_items || [];
                                    level3.checked_items.push({
                                        status: 'FAIL',
                                        date: item.date,
                                        _type: 'capture'
                                    });
                                }
                            });
                        });
                    });
                });
            });
        } else {
            _.each($scope.data.evaluation.tables, function(table) {
                _.each(table.items, function(level1) {
                    _.each(level1.items, function(level2) {
                        _.each(level2.items, function(level3) {
                            _.each(level3.checked_items, function(item) {
                                if (item._type === 'capture') {
                                    item.is_checked = false;
                                    level3.linked = false;
                                    item.score = null;
                                    item.status = 'UNCHECK';
                                }
                            });

                            level3.checked_items = _.filter(level3.checked_items, function(item) {
                                return !item._type || item._type !== 'capture';
                            });
                        });
                    });
                });
            });
        }

        calculateSyncScore();
    };

    // 同步计算得分
    function calculateSyncScore() {
        _.each($scope.data.evaluation.tables, function(table) {
            _.each(table.items, function(level1) {
                _.each(level1.items, function(level2) {
                    _.each(level2.items, function(level3) {
                        if (level3.is_checked && !_.isEmpty(level3.checked_items)) {
                            level3.checked_items.sort(function compareDate(a, b) {
                                return a.date - b.date;
                            });

                            var steps = 0;
                            _.each(level3.checked_items, function(item) {
                                if (item.status === 'UNCHECK') {
                                    return;
                                }

                                if (item._type === 'check') {
                                    steps += 1;
                                }

                                if (item._type === 'capture') {
                                    steps += 1;
                                }
                            });

                            if (steps > 0) {
                                steps = Math.min(steps, level3.range.length - 1);
                                level3.score = level3.range[steps];

                                if (level3.score === 0) {
                                    level3.status = 'PASS';
                                } else {
                                    level3.status = 'FAIL';
                                }
                            }

                            console.log(level3.range);
                            console.log(level3.score);
                            console.log(level3.status);
                        }
                    });
                });
            });
        });
    }

    $scope.toTable = function() {
        var counter = 0,
            length = $scope.data.evaluation.tables.length;
        _.each($scope.data.evaluation.tables, function(table) {
            OfflineService.update(table._id, table).then(function(table) {
                counter++;
                if (counter === length) {
                    alert('确认成功');
                    $state.go('^.table', {
                        evaluationId: $scope.data.evaluation._id
                    });
                }
            }, function(err) {
                alert(err);
            });
        });
    };

    $scope.toBack = function() {
        $state.go('^.list');
    };
});
