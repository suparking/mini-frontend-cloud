// pages/car-protocol/index.js
import Base64 from "../../utils/base64";
Page({
  /**
   * 页面的初始数据
   */
  data: {
    vipCarDesc: '暂无'
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    const { page } = options;
    let params = decodeURIComponent(page);
    let obj = JSON.parse(params);
    console.log()
    this.setData({
        vipCardDesc: Base64.decode(obj.content)
    })
    wx.setNavigationBarTitle({
      title: obj.title,
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
  onHide() {},

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {},

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {},

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {},

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {},
});
