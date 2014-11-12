app.factory('SyncService', function($rootScope, $http, $window, $q, settings, ProjectService, SegmentService, UnitService, UserService) {
    var localStorage = $window.localStorage;

    return {
        getVersion: function() {

        },
        fullUpgrade: function() {
            // TODO 控制同步数据范围
            var promise1 = this.project();
            var promise2 = this.segment();
            var promise3 = this.unit();
            var promise4 = this.user();
            var promise = $q.all([promise1, promise2, promise3, promise4]);
            return promise;
        },
        project: function() {
            var deferred = $q.defer();
            localStorage.removeItem('projects');
            ProjectService.find().then(function(projects) {
                localStorage.setItem('projects', JSON.stringify(projects));
                deferred.resolve(projects);
            }, function(err) {
                deferred.reject(err);
            });
            return deferred.promise;
        },
        segment: function() {
            var deferred = $q.defer();
            localStorage.removeItem('segments');
            SegmentService.find().then(function(segments) {
                localStorage.setItem('segments', JSON.stringify(segments));
                deferred.resolve(segments);
            }, function(err) {
                deferred.reject(err);
            });
            return deferred.promise;
        },
        unit: function() {
            var deferred = $q.defer();
            localStorage.removeItem('units');
            UnitService.find().then(function(units) {
                localStorage.setItem('units', JSON.stringify(units));
                deferred.resolve(units);
            }, function(err) {
                deferred.reject(err);
            });
            return deferred.promise;
        },
        user: function() {
            var deferred = $q.defer();
            localStorage.removeItem('users');
            UserService.find().then(function(users) {
                localStorage.setItem('users', JSON.stringify(users));
                deferred.resolve(users);
            }, function(err) {
                deferred.reject(err);
            });
            return deferred.promise;
        }
    };
});