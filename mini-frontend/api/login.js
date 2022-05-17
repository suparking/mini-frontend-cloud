const CONSTANT = require('../utils/constant')
const CONTEXTPATH = "/user-api"
/**
 * 根据前端code,获取后端的 sessionKey. 
 * @param {wx.login 返回的code} code 
 */
const register = ({ code, encryptedData, iv, phoneCode }) => {
    return new Promise((resolve, reject) => {
        wx.request({
            url: CONSTANT.MINI_BASEURL + CONTEXTPATH + "/register",
            data: {
                code: code,
                encryptedData: encryptedData,
                iv: iv,
                phoneCode: phoneCode
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

const login = (code) => {
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
    register,
    login
}