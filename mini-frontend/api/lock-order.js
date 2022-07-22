const CONSTANT = require('../utils/constant');
const CONTEXTPATH = "/park-order-api";
import signUtil from "../utils/signUtils"

/**
 * 根据用户ID,获取三个月内的订单数据. 
 * @param {用户ID} params 
 */
const getLockOrder = params => {
    return new Promise((resolve, reject) => {
        wx.request({
            url: CONSTANT.MINI_BASEURL + CONTEXTPATH + "/getLockOrder",
            method: 'POST',
            header: {
                'content-type': 'application/json',
                'sign': signUtil.sign(params.userId)+''
            },
            data: {
                userId:  params.userId,
            },
            timeout: CONSTANT.REQUEST_TIMEOUT,
            success: (res) => {
                resolve(res)
            },
            fail: (err) => {
                reject(err)
            }
        })
    })  
}
export default {
    getLockOrder
}