const CONSTANT = require('../utils/constant');
// 获取用户信息
const getProjectInfo = params => {
    return new Promise((resolve, reject) => {
        wx.request({
            url: CONSTANT.BS_BASEURL + "/api/project/getParkInfo",
            data: {
                projectNo: params.projectNo,
                channelId: params.channelId
            },
            method: 'POST',
            header: {
                'content-type': 'application/json'
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

// 获取用户数据注册
const getUserIphoneInfo = params => {
    return new Promise((resolve, reject) => {
        wx.request({
            url: CONSTANT.BS_BASEURL + "/api/project/getUserIphone",
            data: {
                code: params.code,
                phoneCode: params.phoneCode
            },
            method: 'POST',
            header: {
                'content-type': 'application/json'
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

// 注册数据
const sendRegister = params => {
    return new Promise((resolve, reject) => {
        wx.request({
            url: CONSTANT.BS_BASEURL + "/api/project/sendParkInfo",
            data: {
                phone: params.phone,
                channelId: params.channelId,
                projectNo: params.projectNo,
                openId: params.openId,
                tmpId: params.tmpId
            },
            method: 'POST',
            header: {
                'content-type': 'application/json'
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
    getProjectInfo,
    getUserIphoneInfo,
    sendRegister
}