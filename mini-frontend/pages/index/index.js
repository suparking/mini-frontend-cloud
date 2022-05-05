// pages/index/index.ts
Page({

    /**
     * 页面的初始数据
     */
    data: {
        swiperList: [
            {
                imageUrl: "../../assets/images/swiper.png",
                type: 'url',
                target: 'http://baidu.com'
            },
            {
                imageUrl: "../../assets/images/swiper.png",
                type: "product",
                target: '1'
            },
            {
                imageUrl: "../../assets/images/swiper.png",
                type: 'url',
                target: 'http://baidu.com'
            }
        ],
        current: 0
    },

    /** 
     * swiper change event.
     * @param e 
     */
    onSwiperChange(e) {
        const { current } = e.detail
        this.setData({
            current
        })
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad() {

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