// pages/login/index.js
Page({

    /**
     * 页面的初始数据
     */
    data: {
        phoneNumber: '18668232809'
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {
    },

    login(e) {
        console.log(e)
        wx.setStorageSync('phoneNumber', this.data.phoneNumber);
        wx.navigateBack({
          delta: 0,
        })
    }
})