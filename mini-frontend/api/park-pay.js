const CONSTANT = require('../utils/constant');
const CONTEXTPATH = "/park-api";
import signUtil from "../utils/signUtils";
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
export default {
    projectInfoByDeviceNo,
    scanCodeQueryFee,
    miniToPay,
    queryOrder,
    closeOrder,
    clearParkCache
}