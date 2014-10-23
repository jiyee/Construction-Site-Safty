app.filter('score', function() {
    return function(input) {
        input = parseFloat(input);

        if (input > 70) {
            return '达标';
        } else {
            return '不达标';
        }
    };
});