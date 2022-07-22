// pages/order/index.ts
import { userBehavior } from "../../behaviors/user-behavior";
const CONSTANT = require('../../utils/constant');
import parkDiscountApi from "../../api/park-discount"
Page({
    behaviors: [userBehavior ],
    /**
     * 页面的初始数据
     */
    data: {
        isRefresh: false,
        couponNameList: [],
        dict: {
            'AMOUNT': 'blueGreen',
            'MINUTE': 'orange',
            'RATE': 'pink',
            'FREE': 'babyBlue'
        },
    },
    // 用优惠券去使用
    toParkPay() {
        wx.navigateTo({
          url: '/pages/park-pay/index',
        })
    },
    // 优惠券获取接口
    discountInfoShow() {
        return new Promise((resolve, reject) => {
            let userInfoStroage = wx.getStorageSync("user");
            if (!userInfoStroage) {
                wx.hideLoading();
                wx.showToast({
                title: '用户信息有误',
                duration: 1000
                })
                return;
            } 
            let params = {
                unionId: userInfoStroage.unionId
            }
            parkDiscountApi.getDiscountInfo(params).then(res => {
                if (res.data.code === CONSTANT.REQUEST_SUCCESS) {
                    let couponNameList = []
                    let { data } = res.data;
                    for (let i = 0; i < data.length; i++) {
                        let couponName = '';
                        let type = data[i].valueType;
                        let value = data[i].value;
                        if (type === 'AMOUNT') {
                            couponName = '现金券: ' + value / 100 + '元';
                        } else if (type === 'MINUTE') {
                            couponName = '时长劵: ' + value + '分钟';
                        } else if (type === 'RATE') {
                            couponName = '折扣劵: ' + value / 10 + '折';
                        } else if (type === 'FREE') {
                            couponName = '全免劵';
                        }
                        let projectNos = JSON.parse(data[i].projectNos);
                        let coupon = {
                            valueType: data[i].valueType,
                            couponName: couponName,
                            expireDate: data[i].expireDate,
                            quantity: data[i].quantity,
                            projectNos: projectNos.join(' ')
                        }
                        couponNameList.push(coupon);
                    }
                    this.setData({
                        couponNameList 
                    })
                    resolve("success");
                } else {
                    reject("fail");
                }
            })
        }).catch(err => {
            wx.showToast({
              title: `查询优惠券错误${err}`,
              icon: 'none',
              duration: 3000
            })
        })
    },
    // 首次加载页面查询地锁停车
    onLoad(e) {
        // 查询地锁订单
        this.discountInfoShow().then(res => {
            wx.showToast({
              title: '获取优惠券成功',
              icon: 'none',
              duration: 2000
            })
        }).catch(err => {
            wx.showToast({
              title: '获取优惠券失败',
              icon: 'error',
              duration: 2000
            })
        })
    },
    // 显示加载
    onShow() {
        // 查询地锁订单
        this.discountInfoShow().then(res => {
            wx.showToast({
              title: '获取优惠券成功',
              icon: 'none',
              duration: 2000
            })
        }).catch(err => {
            wx.showToast({
              title: '获取优惠券失败',
              icon: 'error',
              duration: 2000
            })
        })
    },
      /**
       * 滑动swiper
       * @param {} e 
       */
      handleSwiper(e) {
      },
      /**
       * 滑动到底
       * @param {*} e 
       */
      handleTolower(e){
      },
      /**
       * 往下拉刷新订单.
       */
      refresherpulling() {
        wx.showLoading({
          title: '刷新中'
        })
        // 查询地锁订单
        this.discountInfoShow().then(res => {
            wx.showToast({
              title: '获取优惠券成功',
              icon: 'none',
              duration: 2000
            })
        }).catch(err => {
            wx.showToast({
              title: '获取优惠券失败',
              icon: 'error',
              duration: 2000
            })
        })
        wx.hideLoading()
        this.setData({
            isRefresh: false
        })
    },
    /**
     * 点击去停车
     * @param {*} e 
     */
    onPark(e) {
        wx.switchTab({
          url: '/pages/park/index',
        })
    },
    onPay(e) {
        wx.showToast({
          title: '暂未开通',
          icon: 'none',
          duration: 3000
        })
    },
})