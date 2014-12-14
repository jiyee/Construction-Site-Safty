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
        console.log(evaluation);
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
            // console.log(checked_items);

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

                console.log(item);

                delete item._link;

                level2.is_checked = true; // 标识是否已检查过
                level2.is_selected = true; // 标识是否选中
                level3.is_checked = true;
                level3.checked_items = level3.checked_items || [];
                level3.checked_items.push(item);
            });

            // 同步计算得分
            _.each($scope.data.evaluation.tables, function(table) {
                _.each(table.items, function(level1) {
                    _.each(level1.items, function(level2) {
                        _.each(level2.items, function(level3) {
                            var pass = 0,
                                fail = 0,
                                last_pass = true;

                            if (level3.is_checked && level3.checked_items) {
                                level3.checked_items.sort(function compareDate(a, b) {
                                    return a.date - b.date;
                                });

                                if (level3.checked_items[0].score === '0') { // 最近一次合格
                                    last_pass = true;
                                } else if (level3.checked_items[0].score === '1') { // 最近一次不合格
                                    last_pass = false;
                                }

                                _.each(level3.checked_items, function(item) {
                                    if (item.score === '0') {
                                        pass += 1;
                                    } else if (item.score === '1') {
                                        fail += 1;
                                    }
                                });

                                if (last_pass) {
                                    level3.score = Math.floor(level3.range[level3.range.length - 1] * pass / (pass + fail));
                                } else {
                                    level3.score = level3.range[level3.range.length - 1];
                                }

                                if (level3.score === 0) {
                                    level3.status = 'PASS';
                                } else {
                                    level3.status = 'FAIL';
                                }

                                console.log(last_pass, pass, fail);
                                console.log(level3.range);
                                console.log(level3.score);
                            }
                        });
                    });
                });
            });
        } else {
            _.each($scope.data.evaluation.tables, function(table) {
                _.each(table.items, function(level1) {
                    _.each(level1.items, function(level2) {
                        _.each(level2.items, function(level3) {
                            level3.status = 'UNCHECK';
                            level3.score = null;
                            level3.checked_items = [];
                        });
                    });
                });
            });
        }
    };

    $scope.syncCaptures = function (bool) {
        if (bool) {
            var archives = _.flatten(_.pluck($scope.data.syncData.captures, 'archives'));
            console.log(archives);

            var reLink = /(SGJC|SGXCTY|SGXCGL|SGXCSY)-([A-Z])-([A-Z][0-9]+)-([0-9])+/;
            var table, file, level1, level2, level3;

            // 挂接所有的安全检查到对应表单的level3
            _.each(archives, function(item) {
                if (!item.comment) return;

                _.each($scope.data.evaluation.tables, function(table) {
                    _.each(table.items, function(level1) {
                        if (level1.name !== item.category) return;

                        _.each(level1.items, function(level2) {
                            _.each(level2.items, function(level3) {
                                if (!!~level3.name.indexOf(item.comment)) {
                                    level3.archives = level3.archives || [];
                                    level3.archives.push(item);
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
                            level3.archives = [];
                        });
                    });
                });
            });
        }
    };

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
