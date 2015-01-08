app.controller('DashboardController', function($scope, $state, $stateParams, settings, CaptureService, CheckService, EvaluationService, resolveUser) {
    $scope.data = {};
    $scope.data.user = resolveUser;
    $scope.data.files = [];

    CaptureService.findByUserId($scope.data.user._id).then(function(captures) {
        $scope.data.files = _.sortBy(_.union($scope.data.files, _.each(captures, function(capture) {
            capture.type = '安全检查';
            if (capture.process && capture.process.status === 'END') {
                capture.status = '已整改';
            } else {
                capture.status = '处理中';
            }
        })), ['type', 'status', 'createAt']);
    });

    CheckService.findByUserId($scope.data.user._id).then(function(checks) {
        $scope.data.files = _.sortBy(_.union($scope.data.files, _.each(checks, function(check) {
            check.type = '日常巡检';
            if (check.process && check.process.status === 'END') {
                check.status = '已整改';
            } else {
                check.status = '处理中';
            }
        })), ['type', 'status', 'createAt']);
    });

    EvaluationService.findByUserId($scope.data.user._id).then(function(evaluations) {
        $scope.data.files = _.sortBy(_.union($scope.data.files, _.each(evaluations, function(evaluation) {
            evaluation.type = '考核评价';
            if (evaluation.process && evaluation.process.status === 'END') {
                evaluation.status = '已整改';
            } else {
                evaluation.status = '处理中';
            }
        })), ['type', 'status', 'createAt']);
    });

    $scope.docxgen = function(item) {
        var service;
        if (item.type === '安全检查') {
            service = CaptureService;
        } else if (item.type === '日常巡检') {
            service = CheckService;
        } else if (item.type === '考核评价') {
            service = EvaluationService;
        } else {
            return;
        }

        service.docxgen(item._id).then(function(files) {
            var refs = [];
            _.each(files, function(file) {
                refs.push({
                    url: settings.baseUrl + '/docx/' + item._id + '_' + file + '.docx'
                });
            });

            $scope.data.refs = refs;

            $("#docxModal").modal('show');

        }, function(err) {
            alert(err);
        });
    };

});