// pages/order/index.ts
const QQMapWX = require("../../utils/qqmap-wx-jssdk.min")
import { userBehavior } from "../../behaviors/user-behavior";
const CONSTANT = require("../../utils/constant");
import parkVipApi from "../../api/park-vip";
const app = getApp();
Page({
  behaviors: [userBehavior],
  /**
   * 页面的初始数据
   */
  data: {
    projectList: [],
    dict: {
      OPENING: "开放中",
      CLOSED: "已关闭",
    },
  },
  // 点击场库之后,跳转到合约页面选择合约
  popupVipDetail(e) {
    const project = e.currentTarget.dataset.project;
    wx.navigateTo({
      url: "/pages/park-vip-detail/index?project=" + JSON.stringify(project),
    });
  },
  // 获取所有场库信息
  projectShow() {
    return new Promise((resolve, reject) => {
      let params = {
        projectNo: "all",
      };
      parkVipApi.getProjectVipList(params).then((res) => {
        if (res.data.code === CONSTANT.REQUEST_SUCCESS) {
          let { data } = res.data;
          for (let i = 0; i < data.length; i++) {
            let openTime = data[i].openTime.join('~');
            data[i].openTime = openTime;
            let address = data[i].address.split('-').join(' ');
            data[i].address = address;
          }
          this.setData({
            projectList: data,
          });
          this.makeProjectList(this.data.projectList)
          resolve("success");
        } else {
          reject("fail");
        }
      });
    }).catch((err) => {
      wx.showToast({
        title: `查询场库信息错误${err}`,
        icon: "error",
        duration: 3000,
      });
    });
  },
   /**
     * 初始化Map Sdk.
     */
    initMapSdk() {
      if (!app.globalData.mapSdk) {
        app.globalData.mapSdk = new QQMapWX({
              key: CONSTANT.tencentAK
          });
      }
  },
  /**
   * 重新构造场库列表数据.
   * @param {原始场库列表数据} data
   */
  makeProjectList(data) {
    // 过滤 经纬度
    const locationList = data.map((item) => {
      return {
        latitude: item.latitude,
        longitude: item.longitude,
      };
    });
    const projectList = this.data.projectList;
    // 计算距离
    app.globalData.mapSdk.calculateDistance({
      to: locationList,
      success: (res) => {
        projectList.forEach((item, key) => {
          projectList[key]["distance"] = (
            res.result.elements[key].distance / 1000
          ).toFixed(2);
        });
        this.setData({
          projectList,
        });
      },
    });
  },
  // 首次加载页面查询地锁停车
  onLoad(e) {
    this.initMapSdk();
    // 查询地锁场库信息
    this.projectShow()
      .then((res) => {
        wx.showToast({
          title: "获取场库信息成功",
          icon: "none",
          duration: 2000,
        });
      })
      .catch((err) => {
        wx.showToast({
          title: "获取场库信息失败",
          icon: "error",
          duration: 2000,
        });
      });
  },
  // 显示加载
  onShow() {
    // 查询地锁场库信息
    this.projectShow()
      .then((res) => {
        wx.showToast({
          title: "获取场库信息成功",
          icon: "none",
          duration: 2000,
        });
      })
      .catch((err) => {
        wx.showToast({
          title: "获取场库信息失败",
          icon: "error",
          duration: 2000,
        });
      });
  },
  /**
   * 点击tab.
   * @param {*} e
   */
  handleClick(e) {},
  /**
   * 滑动swiper
   * @param {} e
   */
  handleSwiper(e) {},
  /**
   * 滑动到底
   * @param {*} e
   */
  handleTolower(e) {},
  /**
   * 往下拉刷新场库信息.
   */
  refresherpulling() {
  },
});
