// pages/index/index.ts
import { userBehavior } from "../../behaviors/user-behavior"
import parkApi from "../../api/park"
const CONSTANT = require('../../utils/constant')
const app = getApp();
Page({
    behaviors: [ userBehavior ],
    /**
     * 页面的初始数据
     */
    data: {
        swiperList: [
            {
                imageUrl: "../../assets/images/swiper.png",
                type: 'url',
                target: 'https://www.baidu.com'
            },
            {
                imageUrl: "../../assets/images/swiper.png",
                type: "product",
                target: 'reverse'
            },
            {
                imageUrl: "../../assets/images/swiper.png",
                type: 'product',
                target: 'pay'
            },
            {
                imageUrl: "../../assets/images/swiper.png",
                type: 'product',
                target: 'vip'
            }

        ],
        current: 0,
        isLogin: false,
        // 最近场库
        nearByPark: null
    },

    /**
     * 首页菜单跳转. 
     * @param {*} e 
     */
    onBannerTab(e) {
        let type = e.currentTarget.dataset.type;
        if (type === 'pay') {
            wx.navigateTo({
                url: `/pages/park-pay/index`,
            })
        } else if(type === 'vip') {
            wx.navigateTo({
                url: `/pages/park-vip/index`,
            })
        } else if(type === 'discount') {
            wx.navigateTo({
                url: `/pages/park-discount/index`,
            })
        } else if(type === 'arrears') {
            wx.navigateTo({
                url: `/pages/park-arrears/index`,
            })
        } else if(type === 'reverse') {
            wx.navigateTo({
                url: `/pages/park-reverse/index`,
            })
        }
    },
    /**
     * 轮播图跳转 
     * @param {*} e 
     */
    onSwiperTab(e) {
        console.log(e);
        const { item } = e.currentTarget.dataset;
        if (item.type === 'url') {
            wx.navigateTo({
                url: `/pages/web-view/index?url=${item.target}`,
            })
        } else {
            if (item.target === 'reverse') {
                wx.navigateTo({
                    url: `/pages/park-reverse/index`,
                })
            } else if (item.target === 'pay') {
                wx.navigateTo({
                    url: `/pages/park-pay/index`,
                })
            } else if (item.target === 'vip') {
                wx.navigateTo({
                    url: `/pages/park-vip/index`,
                })
            }
        }
    },
    /**
     * 点击更换车牌.
     */
    onChangeLicense() {
        wx.navigateTo({
          url: '/pages/login/index',
        })
    },
    /** 
     * swiper change event.
     * @param e 
     */
    onSwiperChange(e) {
        const { current } = e.detail
        this.setData({
            current
        })
    },

    /**
     * 点击立即停车.
     */
    onMenuCardClick() {
        const { location } = this.data.user;
        if (!location) {
            app.loadCurrentLocation().then(res => {
                if (res) { 
                    this.updateLocation();
                }
            }).catch(err => {
                wx.showToast({
                  title: '获取位置失败',
                  icon: 'error',
                  duration: 3000
                })
            })
        } else {
            wx.switchTab({
              url: '/pages/park/index',
            })
        }
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad() {
        if (!app.isLogin()) {
            app.checkUser().then(res => {
                wx.setStorageSync('user', res);
                app.loadCurrentLocation().then(res => {
                    if (res) { 
                        this.updateLocation();
                    }
                })
                this.updatePhoneNumber();
                this.updateUserId();
                this.updateAvatarUrl();
            }).catch(reason => {
                wx.navigateTo({
                    url: reason,
                })
            })
        }
    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady() {

    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow() {
        //通过获取用户信息,如果存在则赋值
        let { location } = this.data.user
        var currentLocation = null;
        if (location) {
            currentLocation = {
                latitude: location.latitude,
                longitude: location.longitude,
                number: 1,
                radius: CONSTANT.DEFAULT_RADIUS
            }
        } else {
            app.loadCurrentLocation().then(res => {
                if (res) { 
                    this.updateLocation();
                    currentLocation = {
                        latitude: location.latitude,
                        longitude: location.longitude,
                        number: 1,
                        radius: CONSTANT.DEFAULT_RADIUS 
                    }
                }
            }).catch(err => {
                wx.showToast({
                  title: '重新刷新获取位置微信',
                  icon: 'none',
                  duration: 3000
                })
            })
        }
        // 拿到定位获取最近场库,如果未拿到定位信息,则提示错误
        if (currentLocation) {
            parkApi.nearbyStore(currentLocation).then(res => {
                const { data } = res;
                if (data.code === CONSTANT.REQUEST_SUCCESS) {
                    if (data.data) {
                        const park = data.data[0];
                        let nearByPark = {
                            id: park.id,
                            name: '数停车' + ' (' + park.projectName + ')',
                            address:park.addressSelect.split('-')[park.addressSelect.split('-').length - 1],
                            location: park.location,
                            phone: park.helpLine,
                            openTime: park.openTime,
                            status: park.status ? 'OPENING' : 'CLOSED',
                            distance: park.value / 1000 + 'km',
                            perCharge: ''
                        }
                        this.setData({
                            nearByPark
                        })
                    }
                }
            })
        } else {
            wx.showToast({
              title: '获取位置失败',
              icon: 'error',
              duration: 3000
            })
        }
    },

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide() {

    },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload() {
    },

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh() {

    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom() {

    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage() {

    }
})