// pages/index/index.ts
import { userBehavior } from "../../behaviors/user-behavior"
import parkApi from "../../api/park"
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
        nearbyPark: null
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
        wx.switchTab({
          url: '/pages/park/index',
        })
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad() {
        if (wx.getStorageSync('user')) {
            this.updatePhoneNumber();
            this.updateLocation();
            this.updateUserId();
            this.updateAvatarUrl();
        }
        app.loadCurrentLocation().then(res => {
            if (res) { 
                this.updateLocation();
            }
        })
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
        parkApi.nearbyStore(location).then(res => {
            if (res.length) {
                this.setData({
                    nearbyPark: res[0]
                })
            }
        })
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