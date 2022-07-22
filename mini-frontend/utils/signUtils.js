const CONSTANT = require('./constant');
const md5 = require('./md5');
import moment from 'moment';
/**
 * sign.
 * @param {签名字段内容} content 
 */
const sign = (content) => {
    let secret = CONSTANT.SECRET.toUpperCase();
    return  md5((secret + content + moment(new Date().getTime()).format("YYYY-MM-DD") + secret).toUpperCase()).toUpperCase();
}

export default {
    sign
}