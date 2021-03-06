const CONSTANT = require('../utils/constant');
const CONTEXTPATH = "/park-api";

// 获取常去场库
const regularStore = params => {
    return new Promise((resolve, reject) => {
        wx.request({
            url: CONSTANT.MINI_BASEURL + CONTEXTPATH + "/regularLocations",
            data: {
                userId: params.userId 
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

// 获取附近场库
const nearbyStore = location => {
    return new Promise((resolve, reject) => {
        wx.request({
            url: CONSTANT.MINI_BASEURL + CONTEXTPATH + "/nearLocation",
            data: {
                latitude: location.latitude,
                longitude: location.longitude,
                number: location.number,
                radius: location.radius
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
// 获取marks
const allMarks = ()  => {
    return new Promise((resolve, reject) => {
        wx.request({
            url: CONSTANT.MINI_BASEURL + CONTEXTPATH + "/allLocation",
            method: 'GET',
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
    nearbyStore,
    allMarks,
    regularStore
}