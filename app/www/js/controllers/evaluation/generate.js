app.controller('EvaluationGenerateCtrl', function($scope, $rootScope, $state, $stateParams, settings, ProjectService, SegmentService, UserService, UnitService, CheckService, EvaluationService, AuthService, resolveUser) {
    $scope.data = {};
    $scope.data.user = resolveUser;
    $scope.data.evaluation = {};
    $scope.data.evaluationId = $stateParams.evaluationId;

    EvaluationService.findById($scope.data.evaluationId).then(function(evaluation) {
        $scope.data.evaluation = evaluation;

        var project = evaluation.project._id,
            section = evaluation.section._id,
            today = new Date(),
            start_date = evaluation.evaluation_date_before ? new Date(evaluation.evaluation_date_before) : new Date(today.setMonth(today.getMonth() - 1)),
            end_date = new Date();
            end_date.setDate(end_date.getDate() + 1);

            start_date = [start_date.getFullYear(), start_date.getMonth() + 1, start_date.getDate()].join('-');
            end_date = [end_date.getFullYear(), end_date.getMonth() + 1, end_date.getDate()].join('-');

        var current_unit = $scope.data.user.unit,
            checked_items = [],
            reLink = /(SGJC|SGXCTY|SGXCGL|SGXCSY)-([A-Z])-([A-Z][0-9]+)-([0-9])+/,
            matches = null;
            // TODO 这里原取标段或分部
        CheckService.list(project, section, start_date, end_date).then(function (checks) {
            $scope.data.checks = checks;

            _.each(checks, function (check) {
                if (check.checked_items && check.check_user.unit._id === current_unit._id) {
                    _.each(check.checked_items, function (item) {
                        if (item.status !== 'UNCHECK' && item.link !== '') {
                            matches = item.link.match(reLink);

                            item.link = {};
                            item.link.file = matches[1];
                            item.link.level1 = matches[2];
                            item.link.level2 = matches[3];
                            item.link.level3 = matches[4];

                            item.check_date = check.check_date;

                            checked_items.push(item);
                        }
                    });
                }
            });

            var table, level1, level2, level3;
            _.each(checked_items, function (item) {
                table = find($scope.data.evaluation.tables, {
                    key: 'file',
                    value: item.link.file
                });

                if (!table) return;

                level1 = find(table.items, {
                    key: 'index',
                    value: item.link.level1
                });

                if (!level1) return;

                level2 = find(level1.items, {
                    key: 'index',
                    value: item.link.level2
                });

                if (!level2) return;

                level3 = find(level2.items, {
                    key: 'index',
                    value: item.link.level3
                });

                if (!level3) return;

                level2.is_checked = true; // 标识是否已检查过
                level2.is_selected = true; // 标识是否选中
                level3.is_checked = true;
                level3.checked_items = level3.checked_items || [];
                level3.checked_items.push(item);
            });

            // console.log(checked_items);
        });
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

    $scope.toggleLinkScore = function(linkScore) {
        toggleLinkScore(linkScore);
    };

    $scope.toBack = function () {
        $state.go([settings.roles[$scope.data.user.role.name], 'dashboard'].join('.'), {
            userId: $scope.data.user._id
        });
    };

    $scope.toTable = function () {
        EvaluationService.update($scope.data.evaluation._id, $scope.data.evaluation).then(function(table) {
            alert('确认成功');
            $state.go('^.table', {
                evaluationId: $scope.data.evaluation._id
            });
        }, function(err) {
            alert(err);
        });

    };

    function toggleLinkScore (bool) {
        if (bool) {
            _.each($scope.data.evaluation.tables, function (table) {
                _.each(table.items, function(level1) {
                    _.each(level1.items, function(level2) {
                        _.each(level2.items, function(level3) {
                            var pass = 0,
                                fail = 0,
                                last_pass = true;

                            if (level3.is_checked && level3.checked_items) {
                                level3.checked_items.sort(function compareDate(a, b) {
                                    return a.check_date - b.check_date;
                                });

                                if (level3.checked_items[0]['score'] === '0') { // 最近一次合格
                                    last_pass = true;
                                } else if (level3.checked_items[0]['score'] === '1') { // 最近一次不合格
                                    last_pass = false;
                                }

                                _.each(level3.checked_items, function (item) {
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

                                // console.log(last_pass, pass, fail);
                                // console.log(level3.range);
                                // console.log(level3.score);
                            }
                        });
                    });
                });
            });
        } else {
            _.each($scope.data.evaluation.tables, function (table) {
                _.each(table.items, function(level1) {
                    _.each(level1.items, function(level2) {
                        _.each(level2.items, function(level3) {
                            level3.status = 'UNCHECK';
                            level3.score = null;
                        });
                    });
                });
            });
        }
    }
});