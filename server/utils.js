/**
 * 工具方法
 */
var constants = require('./constants');

exports.getError = function(code) {
    if (constants.ERROR_CODES[code]) {
        return {
            'code': code,
            'message': constants.ERROR_CODES[code] 
        };
    }

    return {
        'raw': code,
        'code': 100,
        'message': '未知错误'
    };
};