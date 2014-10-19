app.factory('EvaluationService', function($http, $q, settings) {
    return {
        find: function() {
            var deferred = $q.defer();

            $http.get(settings.baseUrl + '/evaluations')
                .success(function(data) {
                    deferred.resolve(data.evaluations);
                })
                .error(function(err) {
                    deferred.reject(err);
                });

            return deferred.promise;
        },
        findById: function(evaluationId) {
            var deferred = $q.defer();

            $http.get(settings.baseUrl + '/evaluation/' + evaluationId)
                .success(function(data) {
                    deferred.resolve(data.evaluation);
                })
                .error(function(err) {
                    deferred.reject(err);
                });

            return deferred.promise;
        },
        findByUserId: function(userId) {
            var deferred = $q.defer();

            $http.get(settings.baseUrl + '/user/' + userId + '/evaluations')
                .success(function(data) {
                    deferred.resolve(data.evaluations);
                })
                .error(function(err) {
                    deferred.reject(err);
                });

            return deferred.promise;
        },
        create: function(form) {
            var deferred = $q.defer();

            $http.post(settings.baseUrl + '/evaluation/create', form)
                .success(function(data) {
                    if (data.code > 0) {
                        deferred.reject(data.message);
                    } else {
                        deferred.resolve(data.evaluation);
                    }
                })
                .error(function(err) {
                    deferred.reject(err);
                });

            return deferred.promise;
        },
        update: function(evaluationId, evaluation) {
            var deferred = $q.defer();

            $http.post(settings.baseUrl + '/evaluation/' + evaluationId + '/update', {
                    evaluation_id: evaluationId,
                    evaluation: JSON.stringify(evaluation)
                })
                .success(function(data) {
                    if (data.code > 0) {
                        deferred.reject(data.message);
                    } else {
                        deferred.resolve(data.evaluation);
                    }
                })
                .error(function(err) {
                    deferred.reject(err);
                });

            return deferred.promise;
        }
    };
});