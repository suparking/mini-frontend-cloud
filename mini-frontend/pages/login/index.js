// pages/login/index.js
import { userBehavior } from '../../behaviors/user-behavior'
Page({
    behaviors: [ userBehavior ],
    /**
     * 页面的初始数据
     */
    data: {
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {
    },

    login(e) {
        /** 通过接口获取 */
        let user = {
            phoneNumber: '18668232809',
            openId: '321321199010283417',
            _id: 'ni23sd3232sd2sds32ds'
        }
        wx.setStorageSync('user', user);
        // 立即更新全局 Store
        this.updatePhoneNumber();
        wx.navigateBack({
          delta: 0,
        })
    }
})