// pages/login/index.js
import { userBehavior } from '../../behaviors/user-behavior'
import loginApi from '../../api/login'
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
        // const { code } = options;
        // this.setData({
        //     code
        // })
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
            // code2session 与手机号一起获取
            const { code } = this.data;
            const { encryptedData, iv } = e.detail
            loginApi.code2session({ code, encryptedData, iv}).then(res => {
                console.log(res);
                var user = {
                    phoneNumber: res.data.phoneNumber,
                    openId: res.data.openId,
                    id: res.data.id,
                    unionId: res.data.unionId,
                    avatarUrl: ''
                }
                wx.setStorageSync('user', user);
                this.updatePhoneNumber();
                this.updateUserId();
                wx.navigateBack({
                    delta: 0
                })
            })
        }
    }
})