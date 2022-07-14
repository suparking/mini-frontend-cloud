// pages/lock-park/index.js
Page({

    /**
     * 页面的初始数据
     */
    data: {
        isShowKeyboard: true, // 是否显示车牌
        number: 3,
        plate: [],
        current: 0,
        parkStatus: false, // 0 扫码停车  1 输入停车,
        // 查询费用前的场库开放时间默认显示
        parkInfo: {
            parkName: "停车场库名称",
            openTime: '开放时间',
            freeMinutes: '-',
            perCharge: '-',
            chargeContent: '暂无'
        },
        // 计费规则查看custom model
        chargeShowModal: false,
        single: true,
        // 记录当前页面查询的场库编号
        projectNo: ''
    },
    // 查看计费规则简单描述
    watchCharge() {
        this.setData({
            chargeShowModal: true
        })
    },
    /**
        * 未开放停车场库弹出modal 确定按钮回调 
        * @param {*} e 
        */
    modalConfirm: (e) => {
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {
        const q = decodeURIComponent(options.q);
        if (q) {
            const scancode_time = parseInt(options.scancode_time)
            if (q.indexOf("http://signaling.suparking.cn/device/qrcode?type=pay") >= 0) {
                let projectNo = q.split("no=")[1];
                if (projectNo) {
                    this.setData({
                        projectNo
                    })
                    this.projectInfoByProjectNo();
                }
            }
        }
    },
    /**
     * 根据项目编号获取项目信息. 
     */
    projectInfoByProjectNo() {
        let { projectNo } = this.data;
        parkPayApi.projectInfoByProjectNo({projectNo: projectNo}).then(res => {
            const { data } = res;
            if (data.code === CONSTANT.REQUEST_SUCCESS) {
                let parkInfo = data.data;
                this.setData({
                    parkInfo
                })
            }
        }).catch(err => {
            wx.showToast({
              title: '查询信息有误',
              icon: 'error',
              duration: 3000
            })
        })
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
    toPay() {
        let { plate } = this.data;
        if (plate.length != 3) {

        }
        if (this.data.plate.length > 0) {
            let { projectNo } = this.data;
        }
    },
    /**
     * 跳转到用户协议.
     */
    goToProtocol() {
        wx.navigateTo({
            url: '/pages/user-protocol/index?code=protocol'
        })
    },
    /**
     * 跳转到免责声明
     */
    goToPrivacy() {
        wx.navigateTo({
            url: '/pages/user-privacy/index?code=privacy'
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

    }
})