// pages/user-money/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },
/**
   * 跳转到特定页面
   * @param {data} e
   */
  gotoCustomPage(e) {
    const { code } = e.currentTarget.dataset;
    let url = "";
    if (code === "order-record") {
      url = `/pages/invoice-order/index?code=${code}`;
    } else if (code === "invoice-history") {
      url = `/pages/invoice-record/index?code=${code}`;
    } else {
      url = `/pages/invoice-desc/index?code=${code}`;
    } 
    if (url !== "") {
      wx.navigateTo({
        url,
      });
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {

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