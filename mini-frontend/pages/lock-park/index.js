// pages/lock-park/index.js
Page({

    /**
     * 页面的初始数据
     */
    data: {
        isShowKeyboard: true, // 是否显示车牌
        plate: [],
        current: 0,
        parkStatus: false // 0 扫码停车  1 输入停车
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
        if (current === 0) {
            this.setData({
                isShowKeyboard: false
            })
        }
        if (e.detail.length >= 0 && current > 0) {
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
        if (current === 2) {
            this.setData({
                isShowKeyboard: false
            })
        }
        if (e.detail.length < 3) {
            current += 1;
        }
        this.setData({
            plate: e.detail,
            current: current
        })
    },
    /**
     * 输入框被点击事件
     * @param {*} e 
     */
    onFocusTap(e){
        this.setData({
            isShowKeyboard: true,
            current: e.currentTarget.dataset.item
        })
    },
    /**
     * 停车,如果当前未输入车位号 支持 扫码停车,如果当前输入了编号,那么就是车位号停车
     */
    park() {
        if (this.data.plate.length > 0) {

        } else {
            wx.scanCode({
              onlyFromCamera: false,
              success: res => {
                  if (res.errMsg.indexOf("ok") > 0) {
                      console.log(res.result)
                      // 扫码成功之后,调用API 停车OK  之后 开始计时
                      this.setData({
                          parkStatus: true
                      })
                  } else {
                      console.log(res)
                  }
              }
            })
        }
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

    }
})