// pages/me/index.ts
import { userBehavior } from "../../behaviors/user-behavior";
import parkPayApi from "../../api/park-pay";
import parkVipApi from "../../api/park-vip";
const CONSTANT = require("../../utils/constant");
const app = getApp();
// const computedBehavior = require('miniprogram-computed').behavior
Page({
  // behaviors: [userBehavior, computedBehavior],
  behaviors: [userBehavior],
  /**
   * 页面的初始数据
   */
  data: {
    phone: "18668232809",
    // desensitiveMobile: ''
    deposit: 0,
    discountInfoCount: 0,
  },
  // 获取优惠券
  getDiscount() {
    let userInfoStroage = wx.getStorageSync("user");
    if (!userInfoStroage) {
      wx.hideLoading();
      wx.showToast({
        title: "用户信息有误",
        duration: 1000,
      });
      return;
    }
    let params = {
      unionId: userInfoStroage.unionId,
    };
    parkPayApi
      .getDiscountInfoCount(params)
      .then((res) => {
        let { data } = res.data;
        if (res.data.code === CONSTANT.REQUEST_SUCCESS) {
          this.setData({
            discountInfoCount: data.length,
          });
        }
      })
      .catch((err) => {
        wx.showToast({
          title: `获取优惠券失败,${err}`,
          icon: "none",
          duration: 1000,
        });
      });
  },
  onLoad() {
    this.getDiscount();
  },
  // 我的优惠券点击事件
  discountTap() {
    wx.navigateTo({
      url: "/pages/park-discount/index",
    });
  },
  // computed: {
  //     desensitiveMobile(data) {
  //         let mobile = data.user.phoneNumber;
  //         if (mobile) {
  //             return mobile.replace(/^(\d{3})\d{4}(\d+)/, '$1****$2')
  //         }
  //         return mobile;
  //     }
  // },
  getUserProfile() {
    const user = wx.getStorageSync("user");
    if (user && !user.avatarUrl) {
      wx.getUserProfile({
        desc: "完善数停车用户信息",
        success: (res) => {
          const user = wx.getStorageSync("user");
          user.avatarUrl = res.userInfo.avatarUrl;
          wx.setStorageSync("user", user);
          this.updateAvatarUrl();
        },
      });
    }
  },
  /**
   * 跳转修改手机号码
   */
  onEditPhone() {
    wx.navigateTo({
      url: "/pages/me-change-phone/index",
    });
  },
  // 暂未开放提示
  tips() {
    wx.showToast({
      title: "暂未开放",
      icon: "none",
      duration: 2000,
    });
  },
  /**
   * 拨打客服电话
   * @param {} e
   */
  call(e) {
    this.tips();
    return;
    const { phone } = e.currentTarget.dataset;
    wx.makePhoneCall({
      phoneNumber: phone,
    });
  },
  /**
   * 登录.
   */
  login() {
    app
      .checkUser()
      .then((res) => {
        wx.setStorageSync("user", res);
        this.updatePhoneNumber();
        this.updateLocation();
        this.updateUserId();
        this.updateAvatarUrl();
      })
      .catch((reason) => {
        wx.navigateTo({
          url: reason,
        });
      });
  },
  /**
   * 退出登录
   */
  onLogout() {
    wx.showLoading({
      title: "正在退出...",
      mask: true,
    });
    setTimeout(() => {
      wx.removeStorageSync("user");
      this.updatePhoneNumber();
      this.updateLocation();
      this.updateUserId();
      this.updateAvatarUrl();
      wx.hideLoading();
      wx.showToast({
        title: "退出成功",
        icon: "none",
        duration: 3000,
      });
    }, 3000);
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onShow() {
    this.getDiscount();
  },
  // 查看用户当前是否存在合约
  getUserProtocol() {
    return new Promise((resolve, reject) => {
      let { userId } = this.data.user;
      let params = {
        userId: userId,
      };
      parkVipApi
        .getUserProtocol(params)
        .then((res) => {
          let { data } = res;
          if (data.code == CONSTANT.REQUEST_SUCCESS) {
            let dataObj = data.data;
            if (!dataObj || dataObj.length <= 0) {
              wx.showToast({
                title: "暂无合约",
                icon: "none",
                duration: 2000,
              });
            } else {
              resolve("success");
            }
          } else {
            wx.showToast({
              title: `${data.message}`,
              icon: "none",
              duration: 2000,
            });
            reject("faild")
          }
        })
        .catch((err) => {
          wx.showToast({
            title: "暂无合约",
            icon: "none",
            duration: 2000,
          });
          reject("faild");
        });
    });
  },
  /**
   * 跳转到特定页面
   * @param {data} e
   */
  gotoCustomPage(e) {
    const { code } = e.currentTarget.dataset;
    let url = "";
    if (code === "privacy") {
      url = `/pages/user-privacy/index?code=${code}`;
    } else if (code === "protocol") {
      url = `/pages/user-protocol/index?code=${code}`;
    } else if (code === "park") {
      this.tips();
      return;
      url = `/pages/user-park/index?code=${code}`;
    } else if (code === "money") {
      this.tips();
      return;
      url = `/pages/user-money/index?code=${code}`;
    } else if (code === "invoice") {
      url = `/pages/user-invoice/index?code=${code}`;
    } else if (code === "vip") {
      this.getUserProtocol().then((res) => {
        url = `/pages/user-vip/index?code=${code}`;
      });
    } else {
      this.tips();
      return;
      url = `/pages/user-car/index?code=${code}`;
    }
    if (url !== "") {
      wx.navigateTo({
        url,
      });
    }
  },
});
