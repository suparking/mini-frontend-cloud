// pages/lock-park/index.js
const CONSTANT = require('../../utils/constant');
import parkPayApi from "../../api/park-pay"
import { REQUEST_SUCCESS } from "../../utils/constant";
import { userBehavior } from "../../behaviors/user-behavior"
const app = getApp()
Page({
    behaviors: [ userBehavior ],
    /**
     * 页面的初始数据
     */
    data: {
        isShowKeyboard: true, // 是否显示车牌
        number: 3,
        plate: [],
        current: 0,
        parkStatus: false, // 0 扫码停车  1 输入停车,
        // 查询费用前的场库开放时间默认显示
        parkInfo: {
            parkName: "停车场库名称",
            openTime: '开放时间',
            freeMinutes: '-',
            perCharge: '-',
            chargeContent: '暂无'
        },
        // 计费规则查看custom model
        chargeShowModal: false,
        single: true,
        // 记录当前页面查询的场库编号
        projectNo: ''
    },
    // 查看计费规则简单描述
    watchCharge() {
        this.setData({
            chargeShowModal: true
        })
    },
    /**
        * 未开放停车场库弹出modal 确定按钮回调 
        * @param {*} e 
        */
    modalConfirm: (e) => {
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {
        // const q = decodeURIComponent(options.q);
        const q = "http://signaling.suparking.cn/device/qrcode?type=pay&no=010000";
        if (q) {
            const scancode_time = parseInt(options.scancode_time)
            if (q.indexOf("http://signaling.suparking.cn/device/qrcode?type=pay") >= 0) {
                let projectNo = q.split("no=")[1];
                if (projectNo) {
                    this.setData({
                        projectNo
                    })
                    this.projectInfoByProjectNo();
                }
            }
        }
    },
    /**
     * 根据项目编号获取项目信息. 
     */
    projectInfoByProjectNo() {
        let { projectNo } = this.data;
        console.log("sdfsfsdfsd")
        parkPayApi.projectInfoByProjectNo({projectNo: projectNo}).then(res => {
            const { data } = res;
            if (data.code === CONSTANT.REQUEST_SUCCESS) {
                let parkInfo = data.data;
                this.setData({
                    parkInfo
                })
            }
        }).catch(err => {
            wx.showToast({
              title: `${JSON.stringify(err)}`,
              icon: 'none',
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
     * 输入车牌
     * @param {*} e 
     */
    onPlateKeyboardValueAddChange(e) {
        let { current } = this.data;
        if (current === 2) {
            this.setData({
                isShowKeyboard: false
            })
        }
        if (e.detail.length < 3) {
            current += 1;
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
    // 判断是否登录
    isLogin() {
        return new Promise((resolve, reject) => {
            if (!app.isLogin()) {
                app.checkUser().then(res => {
                    wx.setStorageSync('user', res);
                    this.updatePhoneNumber();
                    this.updateUserId();
                    this.updateAvatarUrl();
                    resolve('success')
                }).catch(reason => {
                    wx.showToast({
                      title: '获取用户失败,跳转到登录页',
                      icon: 'none'
                    });
                    // 为了区分用户进入小程序入口,此处需要增加定制化参数
                    wx.navigateTo({
                        url: reason,
                    })
                })
            } else {
                resolve('success')
            }
        })
    },
    /**
     * 停车,如果当前未输入车位号 支持 扫码停车,如果当前输入了编号,那么就是车位号停车
     */
    toPay() {
        let { plate } = this.data;
        if (plate.length != 3) {
            wx.showToast({
              title: '请输入正确的车位号',
              icon: 'none'
            });
            return;
        }
        // 判断是否登录
        this.isLogin().then(res => {
            let { projectNo } = this.data;
            let parkNo = plate.join('');
            // 拿着项目编号和车位号去查询费用.
            let params = {
                projectNo: projectNo,
                parkNo: parkNo
            }
            // 获取设备编号.
            parkPayApi.getDeviceNo(params).then(res => {
                let { data } = res;
                if (data.code === REQUEST_SUCCESS) {
                    let deviceNo = data.data.deviceNo;
                    if (deviceNo !== '') {
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
                    }
                } else {
                    wx.showToast({
                        title: `${data.message},重新输入正确车位号`,
                        icon: 'none'
                    }) 
                }
            }).catch(err => {
                wx.showToast({
                title: `获取设备信息异常 ${err}`,
                icon: 'none'
                })
                return;
            })
        }).catch(err => {
            wx.showToast({
                title: `登录状态检测异常 ${err}`,
                icon: 'none'
            })
            return;
        })
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
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady() {

    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow() {

    }
})