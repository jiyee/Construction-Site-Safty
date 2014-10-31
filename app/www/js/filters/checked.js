app.filter('checked', function() {
    return function(input) {
        var filter = [];
        _.each(input, function (item) {
            if (item.checked) filter.push(item.name || "");
        });

        return filter.join(", ");
    };
});