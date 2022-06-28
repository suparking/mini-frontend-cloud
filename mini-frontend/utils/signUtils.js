const CONSTANT = require('./constant');
const md5 = require('./md5');
/**
 *  获取当前 yyyy-MM-dd.
 */
function getTimeFun(now){
   let year = now.getFullYear(); 
   let month = ((now.getMonth()+1)<10?"0":"") + (now.getMonth()+1);
   let day = (now.getDate()<10?"0":"")+now.getDate();
   return year+'-'+month+"-"+day;
}
/**
 * sign.
 * @param {签名字段内容} content 
 */
const sign = (content) => {
    let secret = CONSTANT.SECRET.toUpperCase();
    return  md5((secret + content + getTimeFun(new Date()) + secret).toUpperCase()).toUpperCase();
}

export default {
    sign
}