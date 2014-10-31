app.filter('type', function() {
    return function(input) {
        if (input === 'capture') {
            return '安全检查';
        } else if (input === 'check') {
            return '日常巡检';
        } else if (input === 'evaluation') {
            return '考核评价';
        }

        return '';
    };
});