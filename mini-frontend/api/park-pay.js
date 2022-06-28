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
                'content-type': 'application/json'
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

export default {
    projectInfoByDeviceNo,
    scanCodeQueryFee
}