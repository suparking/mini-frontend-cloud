const CONSTANT = require('../utils/constant');
const CONTEXTPATH = "/park-api";
import signUtil from "../utils/signUtils"

/**
 * 根据用户UnionId 获取优惠券信息. 
 * @param {用户ID} params 
 */
// 根据用户ID 获取用户名下的优惠券种类个数
const getDiscountInfo = params  => {
    return new Promise((resolve, reject) => {
        wx.request({
            url: CONSTANT.MINI_BASEURL + CONTEXTPATH + "/getDiscountInfo?unionId=" + params.unionId,
            method: 'GET',
            header: {
                'content-type': 'application/json',
                'sign': signUtil.sign(params.unionId)+''
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
    getDiscountInfo
}