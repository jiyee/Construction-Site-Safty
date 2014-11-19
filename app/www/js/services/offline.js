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

            var checkId = this.guid(),
                tableId = this.guid(),
                file = opts.file;

            if (!checkId || !file) {
                deferred.reject('参数错误');
                return deferred.promise;
            }

            var that = this,
                table, check;

            $http.get('data/table/' + file + '.json')
                .success(function(proto) {
                    table = _.extend({
                        _type_: 'table',
                        _id: tableId,
                        uuid: tableId,
                        checkId: checkId,
                        createAt: Date.now(),
                        file: file
                    }, proto);

                    // 单独保存table
                    that._save(table._id, table);

                    check = _.extend({
                        _type_: 'check',
                        _id: checkId,
                        uuid: checkId,
                        createAt: Date.now(),
                        date: Date.now(),
                        table: table._id
                    }, opts);

                    // 保存到localstorage
                    // 单独保存check
                    that._save(check._id, check);

                    deferred.resolve(check);
                })
                .error(function(err) {
                    deferred.reject(err);
                });

            return deferred.promise;
        },

        newCapture: function(opts) {
            var deferred = $q.defer();

            var captureId = opts.captureId || this.guid();

            if (!captureId) {
                deferred.reject('参数错误');
                return deferred.promise;
            }

            var that = this,
                capture;

            capture = _.extend({
                _type_: 'capture',
                _id: captureId,
                uuid: captureId,
                createAt: Date.now(),
                check_date: Date.now()
            }, opts);

            that._save(capture._id, capture);

            deferred.resolve(capture);

            return deferred.promise;
        },

        newEvaluation: function(opts) {
            var deferred = $q.defer();

            var evaluationId = opts.evaluationId;
            var wbs = opts.wbs || "";

            if (!evaluationId) {
                deferred.reject('参数错误');
                return deferred.promise;
            }

            if (!wbs) {
                deferred.reject('参数错误');
                return deferred.promise;
            }

            var wbs_checked = wbs.split('|');

            var that = this,
                t = Date.now(),
                evaluation;
            var links = [],
                tables = [];
            var files = ['SGJC', 'SGXCTY', 'SGXCGL', 'SGXCSY'];

            $http.get('data/table/wbs.json')
                .success(function(wbs_names) {
                    var check_files = [];
                    _.each(wbs_checked, function(name) {
                        var wbs_item = _.find(wbs_names, {
                            "name": name
                        });
                        check_files = check_files.concat(wbs_item.files);
                    });

                    _.each(check_files, function(file) {
                        $http.get('data/table/' + file + '.json')
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
                    $http.get('data/table/' + file + '.json')
                        .success(function(proto) {
                            table = _.extend({
                                _type_: 'table',
                                _id: that.guid(),
                                evaluationId: evaluationId,
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
                            that._save(table._id, table);

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
                    _id: evaluationId,
                    uuid: evaluationId,
                    createAt: Date.now(),
                    wbs: wbs,
                    evaluation_date: Date.now(),
                    tables: _.pluck(tables, '_id')
                };

                // 保存到localstorage
                // 单独保存evaluation
                that._save(evaluation._id, evaluation);

                deferred.resolve(evaluation);
            });

            return deferred.promise;
        },

        update: function(uuid, object) {
            var deferred = $q.defer();
            if (!uuid) {
                deferred.reject('参数错误');
                return deferred.promise;
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
                return deferred.promise;
            }

            var that = this;
            var item = this._restore(uuid);
            if (item) {
                _.each(item, function(value) {
                    if (that.isOffline(value)) {
                        that._remove(value);
                    }
                });
            }

            this._remove(uuid);
            deferred.resolve();

            return deferred.promise;
        },

        findById: function(uuid) {
            var deferred = $q.defer();
            if (!uuid) {
                deferred.reject('参数错误');
                return deferred.promise;
            }

            var that = this;
            var item = this._restore(uuid);
            if (item) {
                _.each(item, function(value, key) {
                    if (that.isOffline(value) && key != 'uuid' && key != '_id') {
                       item[key] = that._restore(value);
                    }
                });
                deferred.resolve(item);
            } else {
                deferred.reject();
            }

            return deferred.promise;
        },

        list: function(type) {
            var deferred = $q.defer();

            var list = [];
            var len = $window.localStorage.length;
            var key;
            var item;
            for (var i = 0; i < len; i++) {
                key = $window.localStorage.key(i);
                if ($window.localStorage[key].match(/"_type_":"capture"/) ||
                    $window.localStorage[key].match(/"_type_":"check"/) ||
                    $window.localStorage[key].match(/"_type_":"evaluation"/)) {

                    item = this._restore(key);
                    if (!type || item['_type_'] === type) {
                        list.push(item);
                    }
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
        },

        isOffline: function(uuid) {
            if (!uuid) return false;
            return /o_[0-9a-zA-Z]+/.test(uuid);
        }
    };
});
