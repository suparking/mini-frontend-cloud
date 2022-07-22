Page({

    /**
     * 页面的初始数据
     */
    data: {
        dueAmount: '',
        parkingMinutes: '',
        deviceNo: '',
        discountName: '无',
        beginTime: '',
        endTime: '',
        userId: '',
        expireTime: '',
        bestBefore:''
    },
    /**
     * 去开票
     */
    handleClick () {
        wx.redirectTo({
            url: '/pages/user-invoice/index'
        })
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {
        let payInfo = JSON.parse(options.payInfo);
        let discountInfo = payInfo.discountInfo;
        if (discountInfo) {
            let discountName = '';
            let type = discountInfo.valueType;
            let value = discountInfo.value;
            if (type === 'AMOUNT') {
                discountName = "现金券 " + value / 100 + "元";
            } else if (type === 'MINUTE') {
                discountName = "时长券 " + value + "分钟";
            } else if (type === 'RATE') {
                discountName = "折扣劵 " + value / 10 + "折";
            } else {
                discountName = '全免劵';
            }
            this.setData({
                discountName
            })
        }
        this.setData({
            dueAmount: payInfo.dueAmount,
            parkingMinutes: payInfo.parkingMinutes,
            deviceNo: payInfo.deviceNo,
            beginTime: payInfo.beginTime,
            endTime: payInfo.endTime,
            userId: payInfo.userId,
            expireTime: payInfo.expireTime,
            bestBefore: payInfo.bestBefore
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