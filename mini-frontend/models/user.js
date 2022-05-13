import { observable, action } from 'mobx-miniprogram'

const userInStore = wx.getStorageSync('user')

const locationInStore = wx.getStorageSync('location')

export const user = observable({
    // 属性值
    phoneNumber: (userInStore ?  userInStore.phoneNumber : null),
    location: (locationInStore ? locationInStore : null),
    userId: (userInStore ? userInStore.id : null),
    avatarUrl: (userInStore ? userInStore.avatarUrl : null),

    // action
    updatePhoneNumber: action(function() {
        let userInStore = wx.getStorageSync('user');
        this.phoneNumber = (userInStore ?  userInStore.phoneNumber : null);
    }),

    updateLocation: action(function() {
        let locationInStore = wx.getStorageSync('location');
        this.location = (locationInStore ? locationInStore : null);
    }),

    updateUserId: action(function() {
        let userInStore = wx.getStorageSync('user');
        this.userId = (userInStore ?  userInStore.id : null);
    }),

    updateAvatarUrl: action(function() {
        let userInStore = wx.getStorageSync('user');
        this.avatarUrl = (userInStore ?  userInStore.avatarUrl : null);
    }),

    // 计算属性
    get desensitiveMobile() {
        let mobile = this.phoneNumber;
        if (mobile) {
            return mobile.replace(/^(\d{3})\d{6}(\d+)/, '$1******$2')
        }
        return mobile;
    },
    get isLogin() {
        return Boolean(this.phoneNumber);
    },
});