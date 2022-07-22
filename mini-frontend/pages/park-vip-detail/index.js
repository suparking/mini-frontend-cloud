// pages/order/index.ts
import { userBehavior } from "../../behaviors/user-behavior";
const CONSTANT = require("../../utils/constant");
import parkVipApi from "../../api/park-vip";
import moment from "moment";
import dateUtil from "../../utils/dateUtil";

Page({
  behaviors: [userBehavior],
  /**
   * 页面的初始数据
   */
  data: {
    isRefresh: false,
    currentTab: 0,
    parkName: "",
    address: "",
    projectNo: "",
    vipCardTypeList: [],
    // 不同中合约的有效期
    vipExpireTime: "",
    vipCardPrice: "暂无",
    vipCardDesc: "暂无",
    btnPayStatus: false,
    vipSelectIndex: 0,
    // 购买合约份数
    dict: {
      0: 1,
      1: 3,
      2: 6,
      3: 12,
    },
    carTypeDict: {
      DAY: "日",
      MONTH: "月",
      YEAR: "年",
    },
    // 下单所需要的参数
    vipPayDTO: {},
    // 下单返回
    payOrder: {},
  },
  //立即购买发起支付.
  /**
   * 支付下单.
   */
  toPay() {
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
    let {
      projectNo,
      dict,
      parkName,
      vipExpireTime,
      vipCardTypeList,
      currentTab,
      vipSelectIndex,
    } = this.data;
    // 组织下单参数
    let vipPayDTO = {
      projectNo: projectNo,
      projectName: parkName,
      beginDate: vipExpireTime.split(" ~ ")[0],
      endDate: vipExpireTime.split(" ~ ")[1],
      userId: userInfoStroage.id,
      phone: userInfoStroage.phoneNumber,
      miniOpenId: userInfoStroage.miniOpenId,
      stockId: vipCardTypeList[currentTab].stockId,
      protocolId: vipCardTypeList[currentTab].protocolId,
      protocolName: vipCardTypeList[currentTab].protocolName,
      quantity: dict[vipSelectIndex],
      dueAmount: vipCardTypeList[currentTab].price * dict[vipSelectIndex],
    };
    // 存储下单数据到 缓存区
    this.setData({
      vipPayDTO,
    });
    parkVipApi
      .vipOrderToPay(vipPayDTO)
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
              this.toPaySuccess(payOrder.outTradeNo);
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
                      orderNo: outTradeNo,
                      stockKey: vipPayDTO.stockId + "_" + vipPayDTO.userId,
                    };
                    parkVipApi
                      .queryOrder(queryOrderObj)
                      .then((res) => {
                        let { data } = res.data;
                        if (
                          res.data.code === CONSTANT.REQUEST_SUCCESS &&
                          data.query_code === "0"
                        ) {
                          clearInterval(queryInterval);
                          // 跳转到支付成功页面
                          this.toPaySuccess(outTradeNo);
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
                    projectNo: vipPayDTO.projectNo,
                    orderNo: outTradeNo,
                    stockKey: vipPayDTO.stockId + "_" + vipPayDTO.userId,
                  };
                  parkVipApi
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
              title: "下单异常",
              icon: "none",
              duration: 2000,
              success: (res) => {
                // 如果存在扫码则清除缓存
                this.removeStockInfoRedis(
                  vipPayDTO.stockId + "_" + vipPayDTO.userId
                );
                this.setData({
                  btnPayStatus: false,
                });
              },
            });
          }
        } else {
          wx.showToast({
            title: `${data.message}`,
            icon: "none",
            duration: 3000,
            success: (res) => {
              // 如果存在扫码则清除缓存
              this.removeStockInfoRedis(
                vipPayDTO.stockId + "_" + vipPayDTO.userId
              );
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
   * 释放库存.
   * @param {库存ID}stockId
   */
  removeStockInfoRedis(stockKey) {
    parkVipApi.clearStockInfoCache({ stockKey: stockKey });
  },
  // 支付成功通知.
  toPaySuccess(orderNo) {
    let { vipPayDTO } = this.data;
    let payInfo = {
      projectName: vipPayDTO.projectName,
      protocolName: vipPayDTO.protocolName,
      beginDate: vipPayDTO.beginDate,
      endDate: vipPayDTO.endDate,
      quantity: vipPayDTO.quantity,
      dueAmount: vipPayDTO.dueAmount,
      orderNo: orderNo.substring(17, orderNo.length),
      userId: vipPayDTO.userId,
    };
    wx.reLaunch({
      url: "/pages/vip-pay-success/index?payInfo=" + JSON.stringify(payInfo),
    });
  },
  // 弹出查看说明
  handleCardDetail() {
    let { vipCardTypeList, currentTab } = this.data;
    if (vipCardTypeList[currentTab].protocolDesc) {
      let page = {
        title: "合约协议说明",
        content: vipCardTypeList[currentTab].protocolDesc,
      };
      let url =
        "/pages/car-protocol/index?page=" +
        encodeURIComponent(JSON.stringify(page));
      wx.navigateTo({
        url,
      });
    }
  },
  // 点击月卡种类触发.
  handleContent(e) {
    let index = 0;
    if (!e) {
      this.setData({
        vipSelectIndex: index,
      });
    } else {
      index = e.currentTarget.dataset.index;
      this.setData({
        vipSelectIndex: index,
      });
    }
    // 计算有效期
    let { currentTab, vipCardTypeList, dict, carTypeDict } = this.data;
    let beginDate = moment(new Date().getTime()).format("YYYY-MM-DD");
    let carType = vipCardTypeList[currentTab];
    let params = {
      beginDate: beginDate,
      durationType: carType.durationType,
      quantity: carType.quantity,
      number: dict[index + ""],
    };
    let endDate = dateUtil.getEndDate(params);
    this.setData({
      vipExpireTime: beginDate + " ~ " + endDate,
      vipCardPrice:
        vipCardTypeList[currentTab].quantity +
        " " +
        carTypeDict[vipCardTypeList[currentTab].durationType],
    });
  },
  // 首次加载页面查询地锁停车
  onLoad(e) {
    let { project } = e;
    let projectObj = JSON.parse(project);
    this.setData({
      parkName: projectObj.projectName,
      address: projectObj.address,
      projectNo: projectObj.projectNo,
    });
    let params = {
      projectNo: this.data.projectNo,
    };
    // 根据项目编号获取合约信息
    let { dict } = this.data;
    parkVipApi
      .getProtocolVipCarList(params)
      .then((res) => {
        if (res.data.code === CONSTANT.REQUEST_SUCCESS) {
          let { data } = res.data;
          for (let i = 0; i < data.length; i++) {
            // 根据单价组织四个套餐
            let priceList = [];
            for (let j = 0; j < 4; j++) {
              let priceItem = {
                name: (data[i].price / 100) * dict[j] + "元/" + dict[j] + "份",
                price: (data[i].price / 100) * dict[j],
              };
              priceList.push(priceItem);
            }
            data[i].priceList = priceList;
          }
          this.setData({
            vipCardTypeList: data,
          });
          this.handleContent(null);
        }
      })
      .catch((err) => {
        wx.showToast({
          title: `获取合约失败${err}`,
          icon: "error",
          duration: 3000,
        });
      });
  },
  // 显示加载
  onShow() {},
  /**
   * 滑动swiper
   * @param {} e
   */
  handleSwiper(e) {
    let { current, source } = e.detail;
    if (source === "touch") {
      const currentTab = current;
      this.setData({
        currentTab: currentTab,
      });
      this.handleContent(null);
    }
  },
});
