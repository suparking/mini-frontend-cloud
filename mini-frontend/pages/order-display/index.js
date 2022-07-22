// pages/order-display/index.js
import { userBehavior } from "../../behaviors/user-behavior";
import parkPayApi from "../../api/park-pay";
const CONSTANT = require("../../utils/constant");
Page({
  behaviors: [userBehavior],
  /**
   * 页面的初始数据
   */
  data: {
    // 设备码跳转参数
    scanCodeTime: "",
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
      openTime: "开放时间",
    },
    // 前置端显示优惠券列表
    couponNameList: ["请选择"],
    scanDiscount: null,
    scanDiscountNo: "",
    scanCodeFlag: false,
    index: 0,
    // 订单显示对象字段
    parkFeeQueryVO: {
      dueAmount: "",
      totalAmount: "",
      parkingId: "",
      projectNo: "",
      userId: "",
      parkNo: "",
      deviceNo: "",
      tmpOrderNo: "",
      beginTime: "",
      endTime: "",
      parkingMinutes: "",
      expireTime: "",
      bestBefore: "",
      expireTimeL: "",
      discountInfo: {},
      discountInfoList: [],
    },
    // 进入订单展示时间
    orderDisplayTime: null,
    // 下单返回
    payOrder: {},
  },
  // 修改扫码状态
  setScanCodeStatus(flag) {
    this.setData({
      scanCodeFlag: flag,
    });
  },
  // 扫优惠券
  scanQrcode() {
    this.setScanCodeStatus(true);
    wx.scanCode({
      scanType: ["qrCode"],
      onlyFromCamera: false,
      success: (res) => {
        this.setScanCodeStatus(false);
        if (res.errMsg.indexOf("ok") > 0) {
          let qrCode = res.result;
          if (qrCode) {
            if (
              qrCode.indexOf("https://cs.suparking.cn/mini/api/scanMiniCode") >=
              0
            ) {
              let discountNo = qrCode.split("discountNo=")[1];
              if (discountNo) {
                let pre_discountNo = discountNo.substring(0, 3);
                if (pre_discountNo != "518" || discountNo.indexOf("@") <= 0) {
                  wx.showToast({
                    title: "二维码无效[518]/@",
                    icon: "none",
                    duration: 3000,
                  });
                  return;
                }
                // 将扫到的优惠券编号复制给Data 数据.
                this.setData({
                  scanDiscountNo: discountNo,
                  index: 0,
                });
                // 提示正在重新计费中.
                wx.showLoading({
                  title: "重新计费中,请稍等...",
                  mask: true,
                });
                //判断scanDiscount是否有值--如果有值则需要请求后台接口将原来的discountNo从redis中删除
                let { scanDiscount } = this.data;
                if (scanDiscount !== null) {
                  let discountNo = scanDiscount.discountNo;
                  // 发送请求,删除后台redis中对应的数据
                  this.removeDiscountRedis(discountNo);
                }
                this.recharge()
                  .then((res) => {
                    wx.hideLoading();
                    wx.showToast({
                      title: "重新计费成功",
                      icon: "none",
                      duration: 2000,
                    });

                    // 读取出 扫码的优惠券,赋值给展示
                    let { parkFeeQueryVO } = this.data;
                    if (parkFeeQueryVO.discountInfo) {
                      let { discountInfo } = parkFeeQueryVO;
                      let couponName = "";
                      let type = discountInfo.valueType;
                      let value = discountInfo.value;
                      if (type === "AMOUNT") {
                        couponName = "现金券: " + value / 100 + "元(扫码)";
                      } else if (type === "MINUTE") {
                        couponName = "时长劵: " + value + "分钟(扫码)";
                      } else if (type === "RATE") {
                        couponName = "折扣劵: " + value / 10 + "折(扫码)";
                      } else if (type === "FREE") {
                        couponName = "全免劵(扫码)";
                      }
                      this.setData({
                        scanDiscount: {
                          discountNo: discountInfo.discountNo,
                          discountName: couponName,
                        },
                      });
                    }
                  })
                  .catch((err) => {
                    wx.hideLoading();
                    wx.showToast({
                      title: "重新计费失败",
                      icon: "none",
                      duration: 2000,
                    });
                  });
              }
            } else {
              wx.showToast({
                title: "扫码失败",
                icon: "error",
                duration: 3000,
              });
              return;
            }
          } else {
            wx.showToast({
              title: "扫码失败",
              icon: "error",
              duration: 3000,
            });
            return;
          }
        } else {
          wx.showToast({
            title: "扫码失败",
            icon: "error",
            duration: 3000,
          });
          return;
        }
      },
      fail: (err) => {
        this.setScanCodeStatus(false);
        wx.showToast({
          title: "扫码失败",
          icon: "error",
          duration: 3000,
        });
        return;
      },
    });
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
      bestBefore: parkFeeQueryVO.bestBefore,
    };
    wx.reLaunch({
      url: "/pages/pay-success/index?payInfo=" + JSON.stringify(payInfo),
    });
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
        title: "页面信息已失效,请下拉页面刷新",
        icon: "warning",
        duration: 5000,
      });
      return;
    }
    const timestamp = new Date().getTime() / 1000;
    const timeBetween = timestamp - orderDisplayTime;
    if (timeBetween > 2 * 60) {
      wx.showToast({
        title: "页面信息已失效,请下拉页面刷新",
        icon: "warning",
        duration: 5000,
      });
      return;
    }

    this.setData({
      btnPayStatus: true,
    });
    wx.showLoading({
      title: "订单生成中,请稍后...",
      mask: true,
    });

    let userInfoStroage = wx.getStorageSync("user");
    if (!userInfoStroage) {
      wx.hideLoading();
      wx.showToast({
        title: "用户信息有误",
      });
    }
    // 组织下单参数
    let parkPayDTO = {
      tmpOrderNo: parkFeeQueryVO.tmpOrderNo,
      parkingId: parkFeeQueryVO.parkingId,
      projectNo: parkFeeQueryVO.projectNo,
      userId: parkFeeQueryVO.userId,
      miniOpenId: userInfoStroage.miniOpenId,
    };
    parkPayApi
      .miniToPay(parkPayDTO)
      .then((res) => {
        let { data } = res;
        if (data.code === CONSTANT.REQUEST_SUCCESS) {
          wx.hideLoading();
          wx.showLoading({
            title: "支付中...",
            mask: false,
          });
          this.setData({
            payOrder: data.data,
          });
          let { payOrder } = this.data;
          if (payOrder.needQuery !== null) {
            if (payOrder.needQuery === false) {
              // 直接跳转到 支付成功页面.
              wx.hideLoading();
              this.toPaySuccess();
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
                    let { scanDiscountNo } = this.data;
                    let queryOrderObj = {
                      orderNo: outTradeNo,
                      discountNo: scanDiscountNo,
                    };
                    parkPayApi
                      .queryOrder(queryOrderObj)
                      .then((res) => {
                        let { data } = res.data;
                        if (
                          res.data.code === CONSTANT.REQUEST_SUCCESS &&
                          data.query_code === "0"
                        ) {
                          clearInterval(queryInterval);
                          // 跳转到支付成功页面
                          this.toPaySuccess();
                        }
                      })
                      .catch((err) => {
                        wx.showToast({
                          title: "订单查询失败",
                          icon: "error",
                          duration: 3000,
                        });
                      });
                  }, 1000);
                },
                fail: (err) => {
                  wx.hideLoading();
                  wx.showLoading({
                    title: "您已取消支付,正在关单...",
                    mask: false,
                  });

                  let closeObj = {
                    projectNo: parkFeeQueryVO.projectNo,
                    orderNo: outTradeNo,
                    discountNo: this.data.scanDiscountNo,
                  };
                  parkPayApi
                    .closeOrder(closeObj)
                    .then((res) => {
                      let { data } = res.data;
                      if (
                        res.data.code === CONSTANT.REQUEST_SUCCESS &&
                        (data.code === "0" || data.code === "AB")
                      ) {
                        wx.showToast({
                          title: "订单已关闭",
                          icon: "none",
                          duration: 3000,
                        });
                        this.setData({
                          btnPayStatus: false,
                        });
                      } else {
                        wx.showToast({
                          title: "订单关闭失败",
                        });
                      }
                    })
                    .catch((err) => {
                      wx.showToast({
                        title: "关单失败",
                        icon: "error",
                        duration: 3000,
                      });
                    });
                },
              });
            }
          } else {
            wx.showToast({
              title: '下单异常',
              icon: 'none',
              duration: 2000,
              success: (res) => {
                // 如果存在纸质优惠券则清除
                let { scanDiscountNo } = this.data;
                this.removeDiscountRedis(scanDiscountNo)
                this.setData({
                  btnPayStatus: false,
                });
              }
            })
          }
        } else {
          wx.showToast({
            title: `${data.message}`,
            icon: "error",
            duration: 3000,
            success: (res) => {
              // 如果存在纸质优惠券则清除
              let { scanDiscountNo } = this.data;
              this.removeDiscountRedis(scanDiscountNo);
              this.setData({
                btnPayStatus: false,
              });
            },
          });
        }
      })
      .catch((err) => {
        wx.showToast({
          title: `下单失败${err}`,
          icon: "none",
          duration: 3000,
        });
      });
  },
  /**
   * 释放优惠券.
   * @param {优惠券编号} discountNo
   */
  removeDiscountRedis(discountNo) {
    parkPayApi.clearDiscountCache({ discountNo: discountNo });
  },
  // 重新计费.
  recharge() {
    return new Promise((resolve, reject) => {
      let { index } = this.data;
      let { parkFeeQueryVO } = this.data;
      let { scanDiscountNo } = this.data;
      let discountInfo =
        index === 0 ? null : parkFeeQueryVO.discountInfoList[index - 1];
      const userStore = wx.getStorageSync("user");
      if (!userStore) {
        wx.showToast({
          title: "用户信息有误",
          icon: "none",
        });
        return;
      }
      let parkQueryDTO = {
        deviceNo: parkFeeQueryVO.deviceNo,
        phone: userStore.phoneNumber,
        miniOpenId: userStore.miniOpenId,
        unionId: userStore.unionId,
        userId: userStore.id,
        discountInfo: discountInfo,
        discountNo: scanDiscountNo,
      };
      parkPayApi
        .scanCodeQueryFee(parkQueryDTO)
        .then((res) => {
          const { data } = res;
          if (data.code === CONSTANT.REQUEST_SUCCESS) {
            // 将场库名称,开放时间,具体的订单信息发送到订单展示页面.
            this.setData({
              parkFeeQueryVO: data.data,
              orderDisplayTime: new Date().getTime() / 1000,
            });
            resolve("success");
          } else {
            wx.showToast({
              title: `${data.message}`,
              icon: "error",
              duration: 3000,
            });
            reject("fail");
          }
        })
        .catch((err) => {
          wx.showToast({
            title: "查询费用失败",
            icon: "error",
            duration: 3000,
          });
          reject("fail");
        });
    });
  },
  /**
   * 选择优惠券查询
   * @param {} e
   */
  bindPickerChange(e) {
    // 选择完优惠券之后再次计费
    let index = e.detail.value;
    let { scanDiscount } = this.data;
    if (scanDiscount !== null) {
      let discountNo = scanDiscount.discountNo;
      // 发送请求,删除后台redis中对应的数据
      this.removeDiscountRedis(discountNo);
    }
    // 重置扫优惠劵
    this.setData({
      index: index,
      scanDiscount: null,
      scanDiscountNo: "",
      scanCodeFlag: false,
    });
    // 提示正在重新计费中.
    wx.showLoading({
      title: "重新计费中,请稍等...",
      mask: true,
    });
    this.recharge()
      .then((res) => {
        wx.hideLoading();
        wx.showToast({
          title: "重新计费成功",
          icon: "none",
          duration: 2000,
        });
      })
      .catch((err) => {
        wx.hideLoading();
        wx.showToast({
          title: "重新计费失败",
          icon: "none",
          duration: 2000,
        });
      });
  },
  /**
   * 计费查询
   */
  parkQuery() {
    let deviceNo = this.data.plate.join("");
    if (deviceNo.length > 0) {
      if (deviceNo.length !== 10) {
        wx.showToast({
          title: "设备号不正确",
          icon: "error",
          duration: 3000,
        });
        return;
      }
    } else {
      wx.scanCode({
        onlyFromCamera: false,
        success: (res) => {
          if (res.errMsg.indexOf("ok") > 0) {
            let qrCode = res.result;
            if (qrCode) {
              if (
                qrCode.indexOf("http://signaling.suparking.cn/device/qrcode") >=
                0
              ) {
                let deviceNo = qrCode.split("no=")[1];
                if (deviceNo) {
                  this.setData({
                    plate: deviceNo.split(""),
                    current: deviceNo.length - 1,
                  });
                  this.projectInfoByDeviceNo(deviceNo);
                }
              } else {
                wx.showToast({
                  title: "扫码失败",
                  icon: "error",
                  duration: 3000,
                });
                return;
              }
            } else {
              wx.showToast({
                title: "扫码失败",
                icon: "error",
                duration: 3000,
              });
              return;
            }
          } else {
            wx.showToast({
              title: "扫码失败",
              icon: "error",
              duration: 3000,
            });
            return;
          }
        },
        fail: (err) => {
          wx.showToast({
            title: "扫码失败",
            icon: "error",
            duration: 3000,
          });
          return;
        },
      });
    }

    const userStore = wx.getStorageSync("user");
    let parkQueryDTO = {
      deviceNo: deviceNo,
      phone: userStore.phoneNumber,
      miniOpenId: userStore.miniOpenId,
      unionId: userStore.unionId,
      userId: userStore.id,
    };
    parkPayApi
      .scanCodeQueryFee(parkQueryDTO)
      .then((res) => {
        const { data } = res;
        if (data.code === CONSTANT.REQUEST_SUCCESS) {
          let parkFeeQueryVO = data.data;
          // 拿着查询到的数据跳转到,支付前查看页面
          if (parkFeeQueryVO) {
            let url = `/pages/order-display/index?parkFeeQueryVO=${parkFeeQueryVO}`;
            wx.navigateTo({
              url,
            });
          }
        } else {
          wx.showToast({
            title: `失败 ${data.code}`,
            icon: "error",
            duration: 3000,
          });
        }
      })
      .catch((err) => {
        wx.showToast({
          title: "查询费用失败",
          icon: "error",
          duration: 3000,
        });
      });
  },
  /**
   * 拨打客服电话
   * @param {} e
   */
  call(e) {
    const { phone } = e.currentTarget.dataset;
    wx.makePhoneCall({
      phoneNumber: phone,
    });
  },
  /**
   * 弹出帮助说明
   */
  displayHelpModal() {
    this.setData({
      isShowKeyboard: false,
      showModal: true,
    });
  },
  /**
   * 未开放停车场库弹出modal 确定按钮回调
   * @param {*} e
   */
  modalConfirm: (e) => {},
  /**
   * 跳转到用户协议.
   */
  goToProtocol() {
    wx.navigateTo({
      url: "/pages/user-protocol/index?code=protocol",
    });
  },
  /**
   * 跳转到免责声明
   */
  goToPrivacy() {
    wx.navigateTo({
      url: "/pages/user-privacy/index?code=privacy",
    });
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
        parkFeeQueryVO: orderDisplayObj.parkFeeQueryVO,
      });
      this.setData({
        orderDisplayTime: new Date().getTime() / 1000,
      });
      let { discountInfoList } = this.data.parkFeeQueryVO;
      let { couponNameList } = this.data;
      // 根据优惠券列表把名称读取出来
      for (let i = 0; i < discountInfoList.length; i++) {
        let couponName = "";
        let type = discountInfoList[i].valueType;
        let value = discountInfoList[i].value;
        if (type === "AMOUNT") {
          couponName = "现金券:" + value / 100 + "元";
        } else if (type === "MINUTE") {
          couponName = "时长劵:" + value + "分钟";
        } else if (type === "RATE") {
          couponName = "折扣劵:" + value / 10 + "折";
        } else if (type === "FREE") {
          couponName = "全免劵";
        }
        couponNameList.push(couponName);
      }
      if (couponNameList.length > 0) {
        this.setData({
          couponNameList,
        });
      }
    }
  },
  /**
   * 根据设备编号获取项目信息.
   * @param {设备编号} deviceNo
   */
  projectInfoByDeviceNo(deviceNo) {
    parkPayApi
      .projectInfoByDeviceNo({ deviceNo: deviceNo })
      .then((res) => {
        const { data } = res;
        if (data.code === CONSTANT.REQUEST_SUCCESS) {
          let parkInfo = data.data;
          this.setData({
            parkInfo,
          });
        }
      })
      .catch((err) => {
        wx.showToast({
          title: "查询信息有误",
          icon: "error",
          duration: 3000,
        });
      });
  },
  /**
   *  删除车牌
   * @param {*} e
   */
  onPlateKeyboardValueDeleteChange(e) {
    let { current } = this.data;
    if (current === 0) {
      this.setData({
        isShowKeyboard: false,
      });
    }
    if (e.detail.length >= 0 && current > 0) {
      current -= 1;
    }
    this.setData({
      plate: e.detail,
      current: current,
    });
  },
  /**
   * 输入设备编号
   * @param {*} e
   */
  onPlateKeyboardValueAddChange(e) {
    let { current } = this.data;
    if (current === 9) {
      this.setData({
        isShowKeyboard: false,
      });
    }
    if (e.detail.length < 10) {
      current += 1;
    }
    if (e.detail.length === 10) {
      this.projectInfoByDeviceNo(this.data.plate.join(""));
    }
    this.setData({
      plate: e.detail,
      current: current,
    });
  },
  /**
   * 输入框被点击事件
   * @param {*} e
   */
  onFocusTap(e) {
    this.setData({
      isShowKeyboard: true,
      current: e.currentTarget.dataset.item,
    });
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {},

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {},

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {
    let { scanCodeFlag } = this.data;
    if (!scanCodeFlag) {
      this.clearCache();
      wx.navigateBack({
        delta: 0,
      });
    }
  },
  /**
   * 清除缓存.
   */
  clearCache() {
    let { parkFeeQueryVO } = this.data;
    if (parkFeeQueryVO.parkingId && parkFeeQueryVO.userId) {
      let params = {
        parkingId: parkFeeQueryVO.parkingId,
        userId: parkFeeQueryVO.userId,
      };
      parkPayApi
        .clearParkCache(params)
        .then((res) => {
          let { data } = res;
          if (data.code === CONSTANT.REQUEST_SUCCESS) {
            wx.showToast({
              title: "清除缓存成功",
              icon: "none",
              duration: 3000,
            });
          }
        })
        .catch((err) => {
          wx.showToast({
            title: "清除缓存失败",
            icon: "error",
            duration: 3000,
          });
        });
    }
  },
  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {
    this.clearCache();
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {
    wx.showNavigationBarLoading();
    let { scanDiscount } = this.data;
    if (scanDiscount !== null) {
      let discountNo = scanDiscount.discountNo;
      // 发送请求,删除后台redis中对应的数据
      this.removeDiscountRedis(discountNo);
    }
    // 赋值
    this.setData({
      index: 0,
      scanDiscount: null,
      scanDiscountNo: "",
      scanCodeFlag: false,
    });
    // 提示正在重新计费中.
    wx.showLoading({
      title: "重新计费中,请稍等...",
      mask: true,
    });
    this.recharge()
      .then((res) => {
        wx.hideNavigationBarLoading();
        wx.stopPullDownRefresh();
        wx.hideLoading();
        wx.showToast({
          title: "重新计费成功",
          icon: "none",
          duration: 2000,
        });
      })
      .catch((err) => {
        wx.hideNavigationBarLoading();
        wx.stopPullDownRefresh();
        wx.hideLoading();
        wx.showToast({
          title: "重新计费失败",
          icon: "none",
          duration: 2000,
        });
      });
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {},

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {},
});
