app.filter('rotate', function() {
    return function(input) {
        if (input) {
            return '0deg';
        }

        return '90deg';
    };
});