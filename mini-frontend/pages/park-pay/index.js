// pages/park-pay/index.js
import { userBehavior } from "../../behaviors/user-behavior";
const CONSTANT = require('../../utils/constant');
import parkPayApi from "../../api/park-pay";
;
Page({
    behaviors: [ userBehavior ],
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

        // 计费规则查看custom model
        chargeShowModal: false,

        // 查询费用前的场库开放时间默认显示
        parkInfo: {
            parkName: "停车场库名称",
            openTime: '开放时间',
            freeMinutes: '-',
            perCharge: '-',
            chargeContent: '暂无'
        }
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
        if (!userStore) {
            wx.showToast({
              title: '用户信息有误',
              icon: 'none'
            })
            return;
        }
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
                // 将场库名称,开放时间,具体的订单信息发送到订单展示页面.
                let { parkInfo } = this.data;
                let orderDisplay = {
                    parkName: parkInfo.parkName,
                    openTime: parkInfo.openTime,
                    parkFeeQueryVO: data.data
                }
                // 拿着查询到的数据跳转到,支付前查看页面
                if (orderDisplay) {
                    let url = `/pages/order-display/index?orderDisplay=${JSON.stringify(orderDisplay)}`;
                    wx.navigateTo({
                        url
                    })
                }

            } else {
                wx.showToast({
                    title: `${data.message}`,
                    icon: 'error',
                    duration: 3000
                })
            } 
        }).catch(err => {
            console.log(err)
            wx.showToast({
                title: '查询费用失败',
                icon: 'error',
                duration: 3000
              })
        }) 
    },
    // 查看计费规则简单描述
    watchCharge() {
        this.setData({
            chargeShowModal: true
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
        const q = decodeURIComponent(options.q);
        if (q) {
            const scancode_time = parseInt(options.scancode_time)
            if (q.indexOf("http://signaling.suparking.cn/device/qrcode&type=lock") >= 0) {
                let deviceNo = q.split("no=")[1];
                if (deviceNo) {
                    this.setData({
                        plate: deviceNo.split(''),
                        scanCodeTime: scancode_time,
                        current: deviceNo.length - 1
                    })
                    this.projectInfoByDeviceNo(deviceNo);
                }
            }
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