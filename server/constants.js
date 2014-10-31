/**
 * @name 系统常量
 * @author jiyee.sheng@gmail.com
 * @since 2014-10-07
 */

// 项目组成类型
exports.SEGMENT_TYPES = ['项目', '标段', '分部', '工区', '班组'];

// 单位类型
exports.UNIT_TYPES = ['部级主管部门', '厅级主管部门', '指挥部', '建设单位', '监理单位', '施工单位'];

// 错误参数
exports.ERROR_CODES = {
    101: '请求参数不完整',
    102: '请求对象不存在',
    103: '请求参数错误',
    104: '流程状态错误',
    105: '用户未登录'
};

exports.AUTHORITY_TYPES = ['日常巡检', '考核评价'];

exports.STATUS_TYPES = ['UNCHECK', 'PASS', 'FAIL'];
