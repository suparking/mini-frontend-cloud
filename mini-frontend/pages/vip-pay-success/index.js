Page({
  /**
   * 页面的初始数据
   */
  data: {
    projectName: "",
    protocolName: "",
    beginDate: "",
    endDate: "",
    quantity: "",
    dueAmount: "",
    orderNo: "",
    userId: "",
  },
  /**
   * 去开票
   */
  handleClick() {
    wx.redirectTo({
      url: "/pages/user-invoice/index",
    });
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    let payInfo = JSON.parse(options.payInfo);
    this.setData({
      projectName: payInfo.projectName,
      protocolName: payInfo.protocolName,
      beginDate: payInfo.beginDate,
      endDate: payInfo.endDate,
      quantity: payInfo.quantity,
      dueAmount: payInfo.dueAmount,
      orderNo: payInfo.orderNo,
      userId: payInfo.userId,
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
