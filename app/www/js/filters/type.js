app.filter('type', function() {
    return function(input) {
        if (input === 'capture') {
            return '监督抽查';
        } else if (input === 'check') {
            return '安全检查';
        } else if (input === 'evaluation') {
            return '考核评价';
        }

        return '';
    };
});