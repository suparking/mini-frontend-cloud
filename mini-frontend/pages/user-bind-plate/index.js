// pages/user-bind-plate/index.js
import { userBehavior } from '../../behaviors/user-behavior'
Page({

    behaviors: [ userBehavior ],
    /**
     * 页面的初始数据
     */
    data: {
        isShowKeyboard: true, // 是否显示车牌
        plate: [],
        current: 0
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {

    },

    /**
     *  删除车牌
     * @param {*} e 
     */
    onPlateKeyboardValueDeleteChange(e) {
        let { current } = this.data;
        if (e.detail.length >= 0) {
            current -= 1;
        }
        this.setData({
            plate: e.detail,
            current: current
        })
    },

    /**
     * 输入车牌
     * @param {*} e 
     */
    onPlateKeyboardValueAddChange(e) {
        let { current } = this.data;
        if (e.detail.length < 8) {
            current += 1;
        }
        this.setData({
            plate: e.detail,
            current: current
        })
    },
    /**
     * 车牌输入框被点击事件
     * @param {*} e 
     */
    onFocusTap(e){
        this.setData({
            isShowKeyboard: true,
            current: e.currentTarget.dataset.item
        })
    },
    /**
     * 绑定车牌
     */
    goToBind() {
        // 拿着用户信息,和车牌去关联
        if (!this.isVehicleNumber(this.data.plate.join(''))) {
            wx.showToast({
                title: '请输入合法车牌',
                icon: 'error',
                duration: 3000
            })
        } else {
            wx.navigateBack({
              delta: 0,
            })
        }
    },
    /**
     * 校验车牌
     * @param {*} vehicleNumber 
     */
    isVehicleNumber(vehicleNumber) {
        let express = /^[京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼使领A-Z]{1}[A-Z]{1}(([0-9]{5}[DABCEFGHJK]$)|([DABCEFGHJK][A-HJ-NP-Z0-9][0-9]{4}$))|[京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼使领A-Z]{1}[A-Z]{1}[A-HJ-NP-Z0-9]{4}[A-HJ-NP-Z0-9挂学警港澳]{1}$/;
        return express.test(vehicleNumber);
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