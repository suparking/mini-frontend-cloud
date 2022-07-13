// pages/order-display/index.js
import { userBehavior } from '../../behaviors/user-behavior'
import parkPayApi from "../../api/park-pay";
const CONSTANT = require('../../utils/constant')
Page({
    behaviors: [userBehavior ],
    /**
     * 页面的初始数据
     */
    data: {
        // 设备码跳转参数
        scanCodeTime: '',
        // 输入键盘相关的字段
        number: 10,
        isShowKeyboard: false, // 是否显示车牌
        plate: [],
        current: 0,
        parkPayInputType: false, // 0 扫码停车  1 输入停车

        // 开锁帮助提示
        showModal: false,
        single: true,
        phone: "400-021-1990",
        btnPayStatus: false,
        // 查询费用前的场库开放时间默认显示
        parkInfo: {
            parkName: "停车场库名称",
            openTime: '开放时间',
        },
        // 订单显示对象字段
        parkFeeQueryVO: {
            dueAmount: '',
            totalAmount: '',
            parkingId: '',
            projectNo: '',
            userId: '' ,
            parkNo: '',
            deviceNo: '',
            tmpOrderNo: '',
            beginTime: '',
            endTime: '',
            parkingMinutes: '',
            expireTime: '',
            bestBefore: '',
            expireTimeL: '',
            discountInfoList: [],
        },
        // 进入订单展示时间
        orderDisplayTime: null,
        // 下单返回
        payOrder: {
            discountDelayTime: '',
            needQuery: false,
            outTradeNo: '',
            payInfo: '',
            platForm: '',
            retCode: '',
            type: ''
        }
    },
    // 扫优惠券
    scanQrcode() {

    },
    // 支付成功通知.
    toPaySuccess() {
        let { parkFeeQueryVO } = this.data;
        let payInfo = {
            dueAmount: parkFeeQueryVO.dueAmount,
            parkingMinutes: parkFeeQueryVO.parkingMinutes,
            deviceNo: parkFeeQueryVO.deviceNo,
            beginTime: parkFeeQueryVO.beginTime,
            endTime: parkFeeQueryVO.endTime,
            userId: parkFeeQueryVO.userId,
            expireTime: parkFeeQueryVO.expireTime,
            discountInfo: parkFeeQueryVO.discountInfo,
            bestBefore: parkFeeQueryVO.bestBefore
        }
        wx.reLaunch({
            url: '/pages/pay-success/index?payInfo=' + JSON.stringify(payInfo)
        })
    },
    /**
     * 支付下单.
     */
    toPay() {
        const { orderDisplayTime } = this.data;
        let { parkFeeQueryVO } = this.data;
        const expireTime = parkFeeQueryVO.expireTimeL;
        if (orderDisplayTime > expireTime) {
            wx.showToast({
              title: '页面信息已失效,请下拉页面刷新',
              icon: 'warning',
              duration: 5000
            });
            return;
        }
        const timestamp = new Date().getTime() / 1000;
        const timeBetween = timestamp - orderDisplayTime;
        if (timeBetween > 2*60) {
            wx.showToast({
              title: '页面信息已失效,请下拉页面刷新',
              icon: 'warning',
              duration: 5000
            });
            return;
        }

        this.setData({
            btnPayStatus: true
        });
        wx.showLoading({
          title: '订单生成中,请稍后...',
          mask: true
        });

        let userInfoStroage = wx.getStorageSync("user");
        if (!userInfoStroage) {
            wx.hideLoading();
            wx.showToast({
              title: '用户信息有误',
            })
        } 
        // 组织下单参数
        let parkPayDTO = {
            tmpOrderNo: parkFeeQueryVO.tmpOrderNo,
            parkingId: parkFeeQueryVO.parkingId,
            projectNo: parkFeeQueryVO.projectNo,
            userId: parkFeeQueryVO.userId,
            miniOpenId: userInfoStroage.miniOpenId
        }
        parkPayApi.miniToPay(parkPayDTO).then(res => {
            let { data } = res.data;
            this.setData({
                payOrder: data
            })
            let { payOrder } = this.data;
            if (res.data.code === CONSTANT.REQUEST_SUCCESS) {
                wx.hideLoading();
                wx.showLoading({
                  title: '支付中...',
                  mask: false
                });
                if (payOrder.needQuery !== null && payOrder.needQuery === false) {
                    // 直接跳转到 支付成功页面.
                    wx.hideLoading();
                    this.toPaySuccess()
                } else {
                    let payInfo = JSON.parse(payOrder.payInfo);
                    const outTradeNo = payOrder.outTradeNo;
                    wx.requestPayment({
                        timeStamp: payInfo.timeStamp,
                        nonceStr: payInfo.nonceStr,
                        package: payInfo.package,
                        signType: payInfo.signType,
                        paySign: payInfo.paySign,
                        success: (res) => {
                            // 调 查询订单状态
                            var queryInterval = setInterval(() => {
                                // 查询订单状态
                                let queryOrderObj = {
                                    orderNo: outTradeNo
                                }
                                parkPayApi.queryOrder(queryOrderObj).then(res => {
                                    let { data } = res.data;
                                    if (res.data.code === CONSTANT.REQUEST_SUCCESS  && data.query_code === '0') {
                                        clearInterval(queryInterval);
                                        // 跳转到支付成功页面
                                        this.toPaySuccess();
                                    }
                                }).catch(err => {
                                    wx.showToast({
                                        title: '订单查询失败',
                                        icon: 'error',
                                        duration: 3000
                                      }) 
                                })
                            }, 1000)
                        },
                        fail: (err) => {
                            wx.hideLoading();
                            wx.showLoading({
                                title: "您已取消支付,正在关单...",
                                mask: false
                            })
                            let closeObj = {
                                projectNo: parkFeeQueryVO.projectNo,
                                orderNo: outTradeNo 
                            }
                            parkPayApi.closeOrder(closeObj).then(res => {
                                let { data } = res.data;
                                if (res.data.code === CONSTANT.REQUEST_SUCCESS && (data.code === "0" || data.code === "AB")) {
                                    wx.showToast({
                                      title: '订单已关闭',
                                      icon: 'none',
                                      duration: 3000
                                    });
                                    this.setData({
                                        btnPayStatus: false
                                    })
                                } else {
                                    wx.showToast({
                                      title: '订单关闭失败',
                                    })
                                }
                            }).catch(err => {
                                wx.showToast({
                                    title: '关单失败',
                                    icon: 'error',
                                    duration: 3000
                                  })
                            })
                        }
                    })
                }
            }
        }).catch(err => {
            wx.showToast({
                title: '下单失败',
                icon: 'error',
                duration: 3000
              })
        })

    },
    /**
     * 计费查询
     */
    parkQuery() {
        let deviceNo = this.data.plate.join('');
        if (deviceNo.length > 0) {
            if (deviceNo.length !== 10) {
                wx.showToast({
                  title: '设备号不正确',
                  icon: 'error',
                  duration: 3000
                })
                return;
            }
        } else {
            wx.scanCode({
                onlyFromCamera: false,
                success: res => {
                    if (res.errMsg.indexOf("ok") > 0) {
                        let qrCode = res.result;
                        if (qrCode) {
                            if (qrCode.indexOf("http://signaling.suparking.cn/device/qrcode") >= 0) {
                                let deviceNo = qrCode.split("no=")[1];
                                if (deviceNo) {
                                    this.setData({
                                        plate: deviceNo.split(''),
                                        current: deviceNo.length - 1
                                    })
                                    this.projectInfoByDeviceNo(deviceNo);
                                }
                            } else {
                                wx.showToast({
                                    title: '扫码失败',
                                    icon: 'error',
                                    duration: 3000
                                })
                                return;
                            }
                        } else {
                            wx.showToast({
                                title: '扫码失败',
                                icon: 'error',
                                duration: 3000
                            })
                            return;
                        }
                    } else {
                        wx.showToast({
                            title: '扫码失败',
                            icon: 'error',
                            duration: 3000
                        })
                        return;
                    }
                },
                fail: err => {
                    wx.showToast({
                        title: '扫码失败',
                        icon: 'error',
                        duration: 3000
                    }) 
                    return;
                }
            }) 
        }
        
        const userStore = wx.getStorageSync('user');
        let parkQueryDTO = {
            deviceNo: deviceNo,
            phone: userStore.phoneNumber,
            miniOpenId: userStore.miniOpenId,
            unionId: userStore.unionId,
            userId: userStore.id
        }
        parkPayApi.scanCodeQueryFee(parkQueryDTO).then(res => {
            const { data } = res;
            if (data.code === CONSTANT.REQUEST_SUCCESS) {
                let parkFeeQueryVO = data.data
                // 拿着查询到的数据跳转到,支付前查看页面
                wx.showToast({
                  title: `查询费用￥${parkFeeQueryVO.dueAmount / 100}`,
                  duration: 3000
                })
                if (parkFeeQueryVO) {
                    let url = `/pages/order-display/index?parkFeeQueryVO=${parkFeeQueryVO}`;
                    wx.navigateTo({
                        url
                    })
                }

            } else {
                wx.showToast({
                    title: `失败 ${data.code}`,
                    icon: 'error',
                    duration: 3000
                })
            } 
        }).catch(err => {
            wx.showToast({
                title: '查询费用失败',
                icon: 'error',
                duration: 3000
              })
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
     * 弹出帮助说明
     */
    displayHelpModal() {
        this.setData({
            isShowKeyboard: false,
            showModal: true
        })
    },
    /**
    * 未开放停车场库弹出modal 确定按钮回调 
    * @param {*} e 
    */
   modalConfirm: (e) => {
   },
    /**
     * 跳转到用户协议.
     */
    goToProtocol() {
        wx.navigateTo({
            url: '/pages/user-protocol/index?code=protocol'
        })
    },
    /**
     * 跳转到免责声明
     */
    goToPrivacy() {
        wx.navigateTo({
            url: '/pages/user-privacy/index?code=privacy'
        })
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {
        const { orderDisplay } = options;
        if (orderDisplay) {
            let orderDisplayObj = JSON.parse(orderDisplay);
            let parkInfo = {};
            parkInfo.parkName = orderDisplayObj.parkName;
            parkInfo.openTime = orderDisplayObj.openTime;
            this.setData({
                parkInfo: parkInfo,
                parkFeeQueryVO: orderDisplayObj.parkFeeQueryVO
            })
            this.setData({
                orderDisplayTime: new Date().getTime() / 1000
            })
        }
    },
 /**
     * 根据设备编号获取项目信息. 
     * @param {设备编号} deviceNo 
     */
    projectInfoByDeviceNo(deviceNo) {
        parkPayApi.projectInfoByDeviceNo({deviceNo: deviceNo}).then(res => {
            const { data } = res;
            if (data.code === CONSTANT.REQUEST_SUCCESS) {
                let parkInfo = data.data;
                this.setData({
                    parkInfo
                })
            }
        }).catch(err => {
            wx.showToast({
              title: '查询信息有误',
              icon: 'error',
              duration: 3000
            })
        })
    },
    /**
     *  删除车牌
     * @param {*} e 
     */
    onPlateKeyboardValueDeleteChange(e) {
        let { current } = this.data;
        if (current === 0) {
            this.setData({
                isShowKeyboard: false
            })
        }
        if (e.detail.length >= 0 && current > 0) {
            current -= 1;
        }
        this.setData({
            plate: e.detail,
            current: current
        })
    },
    /**
     * 输入设备编号
     * @param {*} e 
     */
    onPlateKeyboardValueAddChange(e) {
        let { current } = this.data;
        if (current === 9) {
            this.setData({
                isShowKeyboard: false
            })
        }
        if (e.detail.length < 10) {
            current += 1;
        }
        if (e.detail.length === 10) {
            this.projectInfoByDeviceNo(this.data.plate.join(''))
        }
        this.setData({
            plate: e.detail,
            current: current
        })
    },
     /**
     * 输入框被点击事件
     * @param {*} e 
     */
    onFocusTap(e){
        this.setData({
            isShowKeyboard: true,
            current: e.currentTarget.dataset.item
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
       let { parkFeeQueryVO }  = this.data;
       if (parkFeeQueryVO.parkingId && parkFeeQueryVO.userId) {
           let params = {
               parkingId: parkFeeQueryVO.parkingId,
               userId: parkFeeQueryVO.userId
           }
           parkPayApi.clearParkCache(params).then(res => {
               let { data } = res;
               if (data.code === CONSTANT.REQUEST_SUCCESS) {
                   wx.showToast({
                     title: '清除缓存成功',
                     icon: 'none',
                     duration: 3000
                   })
               }
           }).catch(err => {
                wx.showToast({
                    title: '清除缓存失败',
                    icon: 'error',
                    duration: 3000
                })
           })
       }
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