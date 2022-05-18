// pages/login/index.js
import { userBehavior } from '../../behaviors/user-behavior'
import loginApi from '../../api/login'
import CONSTANT from '../../utils/constant'
Page({
    behaviors: [ userBehavior ],
    /**
     * 页面的初始数据
     */
    data: {
        code: '',
        phone: '0571-87983999' 
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {
        const { code } = options;
        this.setData({
            code
        })
    },

    /**
     * 拨打电话.
     * @param {*} e 
     */
    call(e) {
        const { phone } = e.currentTarget.dataset;
        wx.makePhoneCall({
          phoneNumber: phone,
        }) 
    },
    /**
     * 登录.
     * @param {*} e 
     */
    login(e) {
        // 手机号码信息
        const { errMsg } = e.detail
        if (errMsg.indexOf("fail") > 0) {
            wx.showToast({
                title: '您选择了拒绝,将无法使用小程序',
                icon: 'none',
                duration: 3000
            })
        } else {
            // register 与手机号一起获取
            var { code } = this.data;
            const phoneCode = e.detail.code;
            loginApi.register({ code, phoneCode: phoneCode }).then(res => {
                console.log(res)
                if (res.statusCode === CONSTANT.REQUEST_SUCCESS && res.data.code === CONSTANT.REQUEST_SUCCESS && res.data.data !== null) {
                    const { data } = res.data;
                    var user = {
                        id: data.id,
                        phoneNumber: data.iphone,
                        miniOpenId: data.miniOpenId,
                        registerType: data.registerType,
                        unionId: data.unionId,
                        enabled: data.enabled,
                        avatarUrl: ''
                    }
                    wx.setStorageSync('user', user);
                    this.updatePhoneNumber();
                    this.updateUserId();
                    wx.navigateBack({
                        delta: 0
                    })
                } else {
                    wx.showToast({
                        title: `注册失败 ${res.data.data.message}`,
                        icon: 'none',
                        duration: 3000
                    })
                }
            }).catch(err => {
                wx.showToast({
                  title: '登录异常',
                  icon: 'error',
                  duration: 3000
                })
                // 下面跳转到 异常呼叫页面
            })
        }
    }
})