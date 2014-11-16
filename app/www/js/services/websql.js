app.factory('WebSQLService', function($window, $q, settings) {
    var db = $window.openDatabase("app", "1.0", "app", 5 * 1024 * 1024);
    var that = this;

    function initialize() {
        db.transaction(
            function(tx) {
                var sql =
                    "CREATE TABLE IF NOT EXISTS offline ( " +
                    "name VARCHAR(50) PRIMARY KEY, " +
                    "data TEXT, " +
                    "lastModified VARCHAR(50))";
                tx.executeSql(sql);
            },
            function(err) {
                console.log(err);
            },
            function() {
            }
        );
    }

    initialize();

    return {
        get: function(name) {
            var deferred = $q.defer();

            db.transaction(
                function(tx) {
                    var sql = "SELECT data FROM offline WHERE name = '" + name + "'";
                    tx.executeSql(sql, [],
                        function(tx, results) {
                            if (results.rows.length === 0) {
                                deferred.reject('No Cache Found');
                                return;
                            }

                            var data = JSON.parse(results.rows.item(0).data);
                            deferred.resolve(data);
                        }
                    );
                }
            );

            return deferred.promise;
        },

        set: function(name, value) {
            var deferred = $q.defer();

            db.transaction(
                function(tx) {
                    var sql =
                        "INSERT OR REPLACE INTO offline (name, data, lastModified) " +
                        "VALUES (?, ?, ?)";
                    var params = [name, JSON.stringify(value), Date.now()];
                    tx.executeSql(sql, params);
                },
                function(err) {
                    console.log(err);
                    deferred.reject(err);
                },
                function(tx) {
                    deferred.resolve();
                }
            );

            return deferred.promise;
        },

        clear: function(name) {
            var deferred = $q.defer();

            db.transaction(
                function(tx) {
                    var sql = "DELETE FROM offline";
                    if (name) {
                        sql += " WHERE name = '" + name + "'";
                    }
                    tx.executeSql(sql, []);
                },
                function(err) {
                    console.log(err);
                    deferred.reject(err);
                },
                function(tx) {
                    deferred.resolve();
                }
            );

            return deferred.promise;
        }
    };
});
