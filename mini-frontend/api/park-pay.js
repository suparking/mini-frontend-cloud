const CONSTANT = require('../utils/constant');
const CONTEXTPATH = "/park-api";
import signUtil from "../utils/signUtils";

/**
 * 根据项目编号,车位号获取设备编号. 
 * @param {项目编号,车位号} params 
 */
const getDeviceNo = params => {
    return new Promise((resolve, reject) => {
        wx.request({
            url: CONSTANT.MINI_BASEURL + CONTEXTPATH + "/getDeviceNo",
            method: 'POST',
            header: {
                'content-type': 'application/json',
                'sign': signUtil.sign(params.parkNo)+''
            },
            data: {
                projectNo:  params.projectNo,
                parkNo: params.parkNo
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

// 根据场库编号获取场库信息
const projectInfoByProjectNo = params => {
    return new Promise((resolve, reject) => {
        wx.request({
            url: CONSTANT.MINI_BASEURL + CONTEXTPATH + "/projectInfoByProjectNo",
            method: 'POST',
            header: {
                'content-type': 'application/json',
                'sign': signUtil.sign(params.projectNo)+''
            },
            data: {
                projectNo:  params.projectNo
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

// 获取根据设备号获取场库信息
const projectInfoByDeviceNo = params  => {
    return new Promise((resolve, reject) => {
        wx.request({
            url: CONSTANT.MINI_BASEURL + CONTEXTPATH + "/projectInfoByDeviceNo",
            method: 'POST',
            header: {
                'content-type': 'application/json',
                'sign': signUtil.sign(params.deviceNo)+''
            },
            data: {
                deviceNo:  params.deviceNo
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

// 费用查询
const scanCodeQueryFee = params  => {
    return new Promise((resolve, reject) => {
        wx.request({
            url: CONSTANT.MINI_BASEURL + CONTEXTPATH + "/scanCodeQueryFee",
            method: 'POST',
            header: {
                'content-type': 'application/json',
                'sign': signUtil.sign(params.deviceNo)+''
            },
            data: {
                deviceNo:  params.deviceNo,
                phone: params.phone,
                miniOpenId: params.miniOpenId,
                unionId: params.unionId,
                userId: params.userId,
                discountInfo: params.discountInfo,
                discountNo: params.discountNo
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

// 下单操作 
const miniToPay = params  => {
    return new Promise((resolve, reject) => {
        wx.request({
            url: CONSTANT.MINI_BASEURL + CONTEXTPATH + "/miniToPay",
            method: 'POST',
            header: {
                'content-type': 'application/json',
                'sign': signUtil.sign(params.tmpOrderNo)+''
            },
            data: params,
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

// 订单查询操作 
const queryOrder = params  => {
    return new Promise((resolve, reject) => {
        wx.request({
            url: CONSTANT.MINI_BASEURL + CONTEXTPATH + "/queryOrder",
            method: 'POST',
            header: {
                'content-type': 'application/json',
                'sign': signUtil.sign(params.orderNo)+''
            },
            data: params,
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

// 订单关闭操作 
const closeOrder = params  => {
    return new Promise((resolve, reject) => {
        wx.request({
            url: CONSTANT.MINI_BASEURL + CONTEXTPATH + "/closeOrder",
            method: 'POST',
            header: {
                'content-type': 'application/json',
                'sign': signUtil.sign(params.orderNo)+''
            },
            data: params,
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

// 离开订单展示页面,清除Redis 缓存费用记录 
const clearParkCache = params  => {
    return new Promise((resolve, reject) => {
        wx.request({
            url: CONSTANT.MINI_BASEURL + CONTEXTPATH + "/clearParkCache",
            method: 'POST',
            header: {
                'content-type': 'application/json',
                'sign': signUtil.sign(params.parkingId)+''
            },
            data: params,
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

// 清除Redis中优惠券
const clearDiscountCache = params  => {
  return new Promise((resolve, reject) => {
      wx.request({
          url: CONSTANT.MINI_BASEURL + CONTEXTPATH + "/clearDiscountCache",
          method: 'POST',
          header: {
              'content-type': 'application/json',
              'sign': signUtil.sign(params.discountNo)+''
          },
          data: params,
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

// 根据用户ID 获取用户名下的优惠券种类个数
const getDiscountInfoCount = params  => {
    return new Promise((resolve, reject) => {
        wx.request({
            url: CONSTANT.MINI_BASEURL + CONTEXTPATH + "/getDiscountInfoCount?unionId=" + params.unionId,
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
    projectInfoByDeviceNo,
    projectInfoByProjectNo,
    scanCodeQueryFee,
    miniToPay,
    queryOrder,
    closeOrder,
    clearParkCache,
    getDeviceNo,
    clearDiscountCache,
    getDiscountInfoCount 
}