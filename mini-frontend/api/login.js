const CONSTANT = require('../utils/constant')
const CONTEXTPATH = "/user-api"
/**
 * 根据前端code,获取后端的 sessionKey. 
 * @param {wx.login 返回的code} code 
 */
const code2session = ({ code, encryptedData, iv }) => {
    return new Promise((resolve, reject) => {
        wx.request({
            url: CONSTANT.MINI_BASEURL + CONTEXTPATH + "/code2session",
            data: {
                code: code,
                encryptedData: encryptedData,
                iv: iv 
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

const getPhoneNumber = ({ encryptedData, iv, userId }) => {
    return new Promise((resolve, reject) => {
        wx.request({
            url: CONSTANT.MINI_BASEURL + CONTEXTPATH + "/getPhoneNumber",
            data: {
                userId: userId,
                encryptedData: encryptedData,
                iv: iv
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

const getUserInfo = ({ encryptedData, iv, userId}) => {
    return new Promise((resolve, reject) => {
        wx.request({
            url: CONSTANT.MINI_BASEURL + CONTEXTPATH + "/getUserInfo",
            data: {
                userId: userId,
                encryptedData: encryptedData,
                iv: iv
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

const login = ({code}) => {
    return new Promise((resolve, reject) => {
        wx.request({
            url: CONSTANT.MINI_BASEURL + CONTEXTPATH + "/login",
            data: {
                code: code,
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
    code2session,
    getPhoneNumber,
    getUserInfo,
    login
}