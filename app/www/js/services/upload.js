app.factory('UploadService', function($rootScope, $http, $q, settings) {

    return {
        upload: function(fileName, mimeType) {
            var deferred = $q.defer();

            var options = new FileUploadOptions();
            options.fileKey = "file";
            options.fileName = fileName.substr(fileName.lastIndexOf('/') + 1);
            options.mimeType = mimeType || "image/jpeg";
            options.chunkedMode = false;

            var ft = new FileTransfer();
            ft.upload(fileName, settings.baseUrl + '/upload', function(res) {
                    if (res && res.response) {
                        try {
                            var response = JSON.parse(res.response);
                            return deferred.resolve(response);
                        } catch (ex) {
                            return deferred.reject(ex);
                        }
                    }

                    return deferred.reject();
                },
                function(err) {
                    console.log('err upload');
                    return deferred.reject(err);
                }, options);

            return deferred.promise;
        }
    };
});
