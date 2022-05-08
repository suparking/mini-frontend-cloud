// pages/me/index.ts
import { behavior } from 'miniprogram-computed'
Page({
    behaviors: [behavior],
    /**
     * 页面的初始数据
     */
    data: {
        mobile: '',
        desensitiveMobile: ''
    },

    computed: {
        desensitiveMobile(data) {
            let mobile = data.mobile;
            if (mobile.length !== 0) {
                return mobile.replace(/^(\d{3})\d{4}(\d+)/, '$1****$2')
            }
            return mobile;
        }
    },
    /**
     * 登录.
     */
    login() {
        wx.navigateTo({
          url: '/pages/login/index',
        })
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onShow() {
        const mobile = wx.getStorageSync('phoneNumber')
        this.setData({
            mobile
        })
    },

    /**
     * 跳转到特定页面
     * @param {data} e 
     */
    gotoCustomPage(e) {
        const { code } = e.currentTarget.dataset;
        let url = '';
        if (code === 'privacy') {
            url = `/pages/user-privacy/index?code=${code}`;
        } else if (code === 'protocol') {
            url = `/pages/user-protocol/index?code=${code}`;
        }
        wx.navigateTo({
            url
        })
    }
})