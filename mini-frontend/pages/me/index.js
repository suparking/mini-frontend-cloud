// pages/me/index.ts
import { userBehavior } from '../../behaviors/user-behavior'
const app = getApp();
// const computedBehavior = require('miniprogram-computed').behavior
Page({
    // behaviors: [userBehavior, computedBehavior],
    behaviors: [userBehavior ],
    /**
     * 页面的初始数据
     */
    data: {
        phone: '18668232809'
        // desensitiveMobile: ''
    },

    // computed: {
    //     desensitiveMobile(data) {
    //         let mobile = data.user.phoneNumber;
    //         if (mobile) {
    //             return mobile.replace(/^(\d{3})\d{4}(\d+)/, '$1****$2')
    //         }
    //         return mobile;
    //     }
    // },
    getUserProfile() {
        const user = wx.getStorageSync('user');
        if (user && !user.avatarUrl) {
        wx.getUserProfile({
                desc: '完善数停车用户信息',
                success: (res) => {
                    const user = wx.getStorageSync('user');
                    user.avatarUrl = res.userInfo.avatarUrl;
                    wx.setStorageSync('user', user);
                    this.updateAvatarUrl();
                }
            })
        }
        
    },
    /**
     * 跳转修改手机号码
     */
    onEditPhone() {
        wx.navigateTo({
          url: '/pages/me-change-phone/index',
        })
    },
    /**
     * 拨打客服电话
     * @param {} e 
     */
    call(e) {
        const { phone } = e.currentTarget.dataset;
        wx.makePhoneCall({
          phoneNumber: phone,
        })
    },
    /**
     * 登录.
     */
    login() {
        app.checkUser().then(res => {
            wx.setStorageSync('user', res);
            this.updatePhoneNumber();
            this.updateLocation();
            this.updateUserId();
            this.updateAvatarUrl();
        }).catch(reason => {
            wx.navigateTo({
                url: reason,
            })
        })
    },
    /**
     * 退出登录
     */
    onLogout() {
        wx.showLoading({
          title: '正在退出...',
          mask: true,
        })
        setTimeout(() => {
            wx.removeStorageSync('user');
            this.updatePhoneNumber();
            this.updateLocation();
            this.updateUserId();
            this.updateAvatarUrl()
            wx.hideLoading()
            wx.showToast({
              title: '退出成功',
              icon: 'none',
              duration: 3000
            })
          }, 3000)

        
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onShow() {
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
        } else if (code === 'park') {
            url = `/pages/user-park/index?code=${code}`;
        } else if (code === 'money') {
            url = `/pages/user-money/index?code=${code}`;
        } else if (code === 'invoice') {
            url = `/pages/user-invoice/index?code=${code}`;
        } else {
            url = `/pages/user-car/index?code=${code}`;
        }
        wx.navigateTo({
            url
        })
    }
})