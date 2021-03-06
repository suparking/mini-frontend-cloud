// pages/user-register/index.js
const CONSTANT = require('../../utils/constant');
import userRegisterApi from "../../api/user-register"
Page({

    /**
     * 页面的初始数据
     */
    data: {
        // 查询费用前的场库开放时间默认显示
        parkName: "停车场名称",
        channelName: "通道名称",
        registerTime: "-",
        registerStatus: false,
        btnStatus: true,
        adverContent: '-',
        signName: '-',
        tmpId: '-',
        userInfo: {
            phone: '',
            openId: ''
        },
        channelId: '',
        projectNo: '',
        plateNo: ''
    },
    // 点击获取手机号,授权登记
    register(e) {
        let channelId = this.data.channelId;
        let projectNo = this.data.projectNo;
        if (!channelId || channelId.length !== 24 || !projectNo || projectNo.length !== 6) {
            wx.showToast({
                title: '未产生登记事件,无需扫码',
                icon: 'none',
                duration: 3000
            }) 
            return;
        }
        const { errMsg } = e.detail
        if (errMsg.indexOf("fail") > 0) {
            wx.showToast({
                title: '您选择了拒绝,将无法进入小区',
                icon: 'none',
                duration: 3000
            })
        } else {
            wx.login({
                success: (res) => {
                    const { code } = res;
                    let params = {
                        code: code,
                        phoneCode: e.detail.code
                    }
                    userRegisterApi.getUserIphoneInfo(params).then(res => {
                        const { data } = res;
                        if (data.code === CONSTANT.BS_REQUEST_SUCCESS) { 
                            let userInfo = {
                                phone: data.phoneInfo.phoneNumber,
                                openId: data.openid
                            }
                            this.setData({
                                userInfo
                            })
                            let { tmpId } = this.data;
                            if (tmpId && tmpId !== '-') {
                                wx.showModal({
                                    title: '提示',
                                    content: '获取成功,确认登记',
                                    success: (res) => {
                                      if (res.confirm) {
                                        let tmpIds = [];
                                        tmpIds.push(tmpId);
                                        wx.requestSubscribeMessage({
                                            tmplIds: tmpIds,
                                            success: (res) => {
                                                if (res[this.data.tmpId] === 'reject') {
                                                    wx.showToast({
                                                        title: '您选择了拒绝,将无法进入小区',
                                                        icon: 'none',
                                                        duration: 3000
                                                    }) 
                                                    return;
                                                }
                                                let sendRegister = {
                                                    phone: this.data.userInfo.phone,
                                                    openId: this.data.userInfo.openId,
                                                    channelId: this.data.channelId,
                                                    projectNo: this.data.projectNo,
                                                    tmpId: this.data.tmpId
                                                }
                                                userRegisterApi.sendRegister(sendRegister).then((res) => {
                                                    const { data } = res; 
                                                    if (data.code === CONSTANT.BS_REQUEST_SUCCESS) {
                                                        this.setData({
                                                            registerTime: data.registerTime,
                                                            registerStatus: data.registerStatus,
                                                            plateNo: data.plateNo,
                                                            btnStatus: true
                                                        })
                                                        wx.showToast({
                                                          title: '登记成功,感谢配合',
                                                          icon: 'success',
                                                          duration: 3000
                                                        })
                                                    } else {
                                                        wx.showToast({
                                                            title: `登记异常: ${data.code}`,
                                                            duration: 3000
                                                        }) 
                                                    }
                                                })
                                            },
                                            fail: (err) => {
                                                wx.showToast({
                                                    title: '您选择了拒绝,将无法进入小区',
                                                    icon: 'none',
                                                    duration: 3000
                                                }) 
                                            }
                                        })
                                      } else if (res.cancel) {
                                        wx.showToast({
                                            title: '您选择了拒绝,将无法进入小区',
                                            icon: 'none',
                                            duration: 3000
                                        }) 
                                      }
                                    }
                                })
                            } else {
                                let sendRegister = {
                                    phone: this.data.userInfo.phone,
                                    openId: this.data.userInfo.openId,
                                    channelId: this.data.channelId,
                                    projectNo: this.data.projectNo,
                                    tmpId: this.data.tmpId
                                }
                                userRegisterApi.sendRegister(sendRegister).then((res) => {
                                    const { data } = res; 
                                    if (data.code === CONSTANT.BS_REQUEST_SUCCESS) {
                                        this.setData({
                                            registerTime: data.registerTime,
                                            registerStatus: data.registerStatus,
                                            plateNo: data.plateNo,
                                            btnStatus: true,
                                        })
                                        wx.showToast({
                                          title: '登记成功,感谢配合',
                                          icon: 'success',
                                          duration: 3000
                                        })
                                    } else {
                                        wx.showToast({
                                            title: `登记异常: ${data.code}`,
                                            duration: 3000
                                          }) 
                                    }
                                })
                            }
                        }
                    })
               },
               fail: (err) => {
                    wx.showToast({
                        title: `${err.errMsg}`,
                        duration: 3000
                    }) 
               }
            })
        }
    },
    resetValue() {
    this.setData({
            parkName: '停车场名称',
            channelName: '通道名称',
            registerTime: "-",
            registerStatus: false,
            btnStatus: true,
            adverContent: '-',
            signName: '-',
            tmpId: '-',
            userInfo: {
                phone: '',
                openId: ''
            },
            channelId: '',
            projectNo: '',
            plateNo: ''
        })
    },
    /**
     * 比较两个版本. 
     * @param {*} v1 
     * @param {*} v2 
     */
    compareVersion(version1, version2) {
        let v1 = version1.split('.');
        let v2 = version2.split('.');
        const len = Math.max(v1.length, v2.length);
        while (v1.length < len) {
            v1.push('0')
        }
        while (v2.length < len) {
            v2.push('0')
        }
        for (let i = 0; i < len; i++) {
            const num1 = parseInt(v1[i])
            const num2 = parseInt(v2[i])
        
            if (num1 > num2) {
              return 1
            } else if (num1 < num2) {
              return -1
            }
        }
        return 0;
    },
    /**
     * 生命周期函数--监听页面加载
     * // 获取用户扫登记码拿到项目编号和通道编号.
     */
    onLoad(options) {
        this.resetValue()
        let version = wx.getSystemInfoSync().SDKVersion;
        if (this.compareVersion(version, '2.4.4') < 0) {
            // 如果希望用户在最新版本的客户端上体验您的小程序，可以这样子提示
            wx.showModal({
                title: '微信基础库版本低于2.4.4',
                content: `当前微信版本 ${version} 过低，无法使用该功能，请升级到最新微信版本后重试。`
              })
              this.setData({
                  btnStatus: true
              })
            return;
        } 
          
        const q = decodeURIComponent(options.q);
        // let q = "http://signaling.suparking.cn/device/qrcode?type=park&no=620f1afae64ada00018cb05a&projectNo=010000";
        if (q) {
            const scancode_time = parseInt(options.scancode_time);
            if (q.indexOf("http://signaling.suparking.cn/device/qrcode?type=park") >= 0) {
                let dataList = q.split("&");
                let params = [];
                for (let i = 1; i < dataList.length; i++) {
                    params.push(dataList[i].split("=")[1]);
                }
                let data = {
                    channelId: params[0],
                    projectNo: params[1]
                }

                this.setData({
                    projectNo: data.projectNo,
                    channelId: data.channelId
                })

                userRegisterApi.getProjectInfo(data).then(res => {
                    const { data }= res;
                    if (data.code === CONSTANT.BS_REQUEST_SUCCESS) {
                        this.setData({
                            parkName: data.projectName,
                            channelName: data.channelName,
                            adverContent: data.adverContent ? data.adverContent : '-',
                            signName: data.signName ? data.signName : '-',
                            tmpId: data.tmpId ? data.tmpId : '-'
                        })
                        this.setData({
                            registerStatus: false,
                            btnStatus: false
                        })

                    } else {
                        wx.showToast({
                            title: '获取项目信息有误',
                            icon: 'error',
                            duration: 3000
                          })
                    }
                }).catch(err => {
                    wx.showToast({
                        title: '获取项目信息有误',
                        icon: 'error',
                        duration: 3000
                      })
                }) 

            }
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
        // 隐藏主页按钮
        wx.hideHomeButton()
    },

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide() {
        this.resetValue();
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
        this.resetValue();
    }
})