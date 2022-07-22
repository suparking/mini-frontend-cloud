// pages/order/index.ts
import { userBehavior } from "../../behaviors/user-behavior";
const CONSTANT = require('../../utils/constant');
import lockOrderApi from "../../api/lock-order"
Page({
    behaviors: [userBehavior ],
    /**
     * 页面的初始数据
     */
    data: {
        isRefresh: false,
        currentTab: 0,
        orderTabList: [
            {
            name: '地锁停车'
            }, {
            name: '场库停车'
            }, {
            name: '预约停车'
            }, {
            name: '充值停车'
            }
        ],
        lockOrderList: [],
        dict: {
            'COMPLETE': '已完成',
            'RUNNING': '进行中',
            'REFUND': '已退费'
        },

        // 地锁Picker所需参数
        lockIndex: 0,
        lockOrderTypeNameList: [
          '临停订单',
          '合约订单'
        ],
        lockOrderTypeList:[
          'TEMP',
          'VIP'
        ]
    },
    // 拉下选择不同种类的订单.
    lockBindPickerChange(e) {
      let index = e.detail.value;
      this.setData({
        lockIndex: index
      })
      let { lockOrderTypeNameList } = this.data;
      wx.showToast({
        title: `查询 ${lockOrderTypeNameList[index]} 数据`,
        icon: 'none',
        duration: 2000
      })
    },
    lockOrderShow() {
        return new Promise((resolve, reject) => {
            let { user } = this.data;
            let params = {
                userId: user.userId
            }
            lockOrderApi.getLockOrder(params).then(res => {
                if (res.data.code === CONSTANT.REQUEST_SUCCESS) {
                    let { data } = res.data;
                    this.setData({
                        lockOrderList: data 
                    })
                    resolve("success");
                } else {
                    reject("fail");
                }
            })
        }).catch(err => {
            wx.showToast({
              title: `查询订单错误${err}`,
              icon: 'error',
              duration: 3000
            })
        })
    },
    // 首次加载页面查询地锁停车
    onLoad(e) {
        let { currentTab } = this.data;
        if (currentTab === 0) {
            // 查询地锁订单
            this.lockOrderShow().then(res => {
                wx.showToast({
                  title: '获取订单成功',
                  icon: 'none',
                  duration: 2000
                })
            }).catch(err => {
                wx.showToast({
                  title: '获取订单失败',
                  icon: 'error',
                  duration: 2000
                })
            })
        }
    },
    // 显示加载
    onShow() {
        let { currentTab } = this.data;
        if (currentTab === 0) {
            // 查询地锁订单
            this.lockOrderShow().then(res => {
                wx.showToast({
                  title: '获取订单成功',
                  icon: 'none',
                  duration: 2000
                })
            }).catch(err => {
                wx.showToast({
                  title: '获取订单失败',
                  icon: 'error',
                  duration: 2000
                })
            })
        }
    },
    /**
     * 点击tab.
     * @param {*} e 
     */
    handleClick(e) {
        let currentTab = e.currentTarget.dataset.index
        this.setData({
          currentTab
        })
      },
      /**
       * 滑动swiper
       * @param {} e 
       */
      handleSwiper(e) {
        let {
          current,
          source
        } = e.detail
        if (source === 'autoplay' || source === 'touch') {
          const currentTab = current
          this.setData({
            currentTab
          })
        }
      },
      /**
       * 滑动到底
       * @param {*} e 
       */
      handleTolower(e){
      },
      /**
       * 往下拉刷新订单.
       */
      refresherpulling() {
        wx.showLoading({
          title: '刷新中'
        })
        let { currentTab } = this.data;
        if (currentTab === 0) {
            // 查询地锁订单
            this.lockOrderShow().then(res => {
                wx.showToast({
                  title: '获取订单成功',
                  icon: 'none',
                  duration: 2000
                })
            }).catch(err => {
                wx.showToast({
                  title: '获取订单失败',
                  icon: 'error',
                  duration: 2000
                })
            })
        } 
        wx.hideLoading()
        this.setData({
            isRefresh: false
        })
    },
    /**
     * 点击去停车
     * @param {*} e 
     */
    onPark(e) {
        wx.switchTab({
          url: '/pages/park/index',
        })
    },
    onPay(e) {
        wx.showToast({
          title: '暂未开通',
          icon: 'none',
          duration: 3000
        })
    },
})