app.factory('OfflineService', function($rootScope, $http, $q, $window, settings) {
    return {
        guid: (function() {
            var counter = 0;

            return function() {
                var guid = new Date().getTime().toString(32),
                    i;

                for (i = 0; i < 5; i++) {
                    guid += Math.floor(Math.random() * 65535).toString(32);
                }

                return 'o_' + guid + (counter++).toString(32);
            };
        }()),

        newCheck: function(opts) {
            var deferred = $q.defer();

            var checkId = opts.checkId,
                file = opts.file,
                check_target = opts.check_target;

            if (!checkId || !file) {
                deferred.reject('参数错误');
                return;
            }

            var that = this,
                table, check;

            $http.get('/data/table/' + file + '.json')
                .success(function(proto) {
                    table = _.extend({
                        _type_: 'table',
                        checkId: checkId,
                        uuid: that.guid(),
                        createAt: Date.now(),
                        file: file
                    }, proto);

                    // 单独保存table
                    that._save(table.uuid, table);

                    check = {
                        _type_: 'check',
                        uuid: checkId,
                        createAt: Date.now(),
                        check_date: Date.now(),
                        check_target: check_target,
                        file: file,
                        table: table.uuid
                    };

                    // 保存到localstorage
                    // 单独保存check
                    that._save(check.uuid, check);

                    deferred.resolve(check);
                })
                .error(function(err) {
                    deferred.reject(err);
                });

            return deferred.promise;
        },

        newCapture: function(opts) {
            var deferred = $q.defer();

            var captureId = opts.captureId;

            if (!captureId) {
                deferred.reject('参数错误');
                return;
            }

            var that = this,
                capture;

            capture = _.extend({
                _type_: 'capture',
                uuid: captureId,
                createAt: Date.now(),
                check_date: Date.now()
            }, opts);

            that._save(capture.uuid, capture);

            deferred.resolve(capture);

            return deferred.promise;
        },

        newEvaluation: function(opts) {
            var deferred = $q.defer();

            var evaluationId = opts.evaluationId;
            var wbs = opts.wbs;

            if (!evaluationId) {
                deferred.reject('参数错误');
                return;
            }

            var that = this,
                t = Date.now(),
                evaluation;
            var links = [],
                tables = [];
            var files = ['SGJC', 'SGXCTY', 'SGXCGL', 'SGXCSY'];

            $http.get('/data/table/wbs.json')
                .success(function(wbs_list) {
                    var wbs_item = _.find(wbs_list, {
                        "name": wbs
                    });
                    var check_files = wbs_item.files;

                    _.each(check_files, function(file) {
                        $http.get('/data/table/' + file + '.json')
                            .success(function(table) {
                                _.each(table.items, function(item1) {
                                    _.each(item1.items, function(item2) {
                                        _.each(item2.items, function(item3) {
                                            if (item3.link) {
                                                links = links.concat(item3.link.split(','));
                                            }
                                        });
                                    });
                                });

                                $rootScope.$emit('link' + t);
                            });
                    });

                    var times = 0;
                    $rootScope.$on('link' + t, function() {
                        times += 1;

                        if (times === check_files.length) {
                            links = _.uniq(_.map(links, function(link) {
                                return link.trim();
                            }));

                            $rootScope.$emit('links' + t, links);
                        }
                    });
                });


            $rootScope.$on('links' + t, function(evt, links) {
                _.each(files, function(file) {
                    $http.get('/data/table/' + file + '.json')
                        .success(function(proto) {
                            table = _.extend({
                                _type_: 'table',
                                evaluationId: evaluationId,
                                uuid: that.guid(),
                                createAt: Date.now(),
                                file: file
                            }, proto);

                            _.each(table.items, function(item1) {
                                _.each(item1.items, function(item2) {
                                    _.each(item2.items, function(item3) {
                                        var key = [file, item1.index, item2.index, item3.index].join('-');
                                        if (!!~links.indexOf(key)) {
                                            item2.is_selected = true;
                                        }
                                    });
                                });
                            });

                            // 单独保存table
                            that._save(table.uuid, table);

                            $rootScope.$emit('table' + t, table);
                        })
                        .error(function(err) {
                            deferred.reject(err);
                        });
                });
            });

            var times = 0;
            $rootScope.$on('table' + t, function(evt, table) {
                times += 1;
                tables.push(table);
                if (times === files.length) {
                    $rootScope.$emit('tables' + t, tables);
                }
            });

            $rootScope.$on('tables' + t, function(evt, tables) {
                evaluation = {
                    _type_: 'evaluation',
                    uuid: evaluationId,
                    createAt: Date.now(),
                    wbs: wbs,
                    evaluation_date: Date.now(),
                    tables: _.pluck(tables, 'uuid')
                };

                // 保存到localstorage
                // 单独保存evaluation
                that._save(evaluation.uuid, evaluation);

                deferred.resolve(evaluation);
            });

            return deferred.promise;
        },

        update: function(uuid, object) {
            var deferred = $q.defer();
            if (!uuid) {
                deferred.reject('参数错误');
                return;
            }

            var source = this._restore(uuid);
            var dest = _.extend(source, object);
            this._save(uuid, dest);

            deferred.resolve(dest);

            return deferred.promise;
        },

        remove: function(uuid) {
            var deferred = $q.defer();
            if (!uuid) {
                deferred.reject('参数错误');
                return;
            }

            this._remove(uuid);
            deferred.resolve();

            return deferred.promise;
        },

        findById: function(uuid) {
            var deferred = $q.defer();
            if (!uuid) {
                deferred.reject('参数错误');
                return;
            }

            if (this._restore(uuid)) {
                deferred.resolve(this._restore(uuid));
            } else {
                deferred.reject();
            }

            return deferred.promise;
        },

        list: function() {
            var deferred = $q.defer();

            var list = [];
            var len = $window.localStorage.length;
            var key;
            for (var i = 0; i < len; i++) {
                key = $window.localStorage.key(i);
                if ($window.localStorage[key].match(/"_type_":"capture"/) ||
                    $window.localStorage[key].match(/"_type_":"check"/) ||
                    $window.localStorage[key].match(/"_type_":"evaluation"/)) {
                    list.push(this._restore(key));
                }
            }

            deferred.resolve(list);

            return deferred.promise;
        },

        _save: function(uuid, object) {
            if (!uuid) return null;

            $window.localStorage[uuid] = JSON.stringify(object);
            return object;
        },

        _restore: function(uuid) {
            if (!uuid) return null;
            if (!$window.localStorage[uuid]) return null;

            var object;
            try {
                object = JSON.parse($window.localStorage[uuid]);
            } catch (ex) {
                return null;
            }

            return object;
        },

        _remove: function(uuid) {
            if (!uuid) return null;
            delete $window.localStorage[uuid];
        }
    };
});
