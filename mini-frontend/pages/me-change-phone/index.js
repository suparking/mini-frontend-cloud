// pages/me-change-phone/index.js
import { userBehavior } from '../../behaviors/user-behavior'
Page({
    behaviors: [ userBehavior ],
    /**
     * 页面的初始数据
     */
    data: {
        phoneNumber: '',
        phoneCode: '',
        secondFlag: false,
        sencond: 60,
        loadingTime: ''
    },

    /**
     * 获取输入数据 
     * @param {*} e 
     */    
    onPhoneNumber(e) {
        if (e.detail.cursor === 11) {
            const phoneNumber = e.detail.value;
            this.setData({
                phoneNumber: phoneNumber
            })
        }
    },

    /**
     * 获取输入code. 
     * @param {*} e 
     */
    onPhoneCode(e) {
        if (e.detail.cursor === 11) {
            const phoneCode = e.detail.value;
            this.setData({
                phoneCode: phoneCode 
            })
        }
    },

    /**
     * 发送接口请求短信
     */
    onGetCode() {
        if (!this.data.phoneNumber) {
            wx.showToast({
                title: '请输入正确的手机号',
                icon: 'none',
                duration: 2000
              })
        } else {
            var nsecond = 60;
            wx.showLoading({
              title: '发送中...',
            })
            this.setData({
                secondFlag: true,
                loadingTime: setInterval(() => {
                    this.setData({
                    second: nsecond
                    })
                    nsecond -= 1;
                    if (nsecond < 1) {
                        wx.hideLoading()
                        clearInterval(this.data.loadingTime);
                        this.setData({
                            secondFlag: false,
                            second: 60
                        })
                    }
                }, 1000)
            })
        }
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {

    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow() {
    },

    onUnload() {
        if (this.data.loadingTime) {
            console.log("清除短信定时器")
            clearInterval(this.data.loadingTime);
        }
    }
})