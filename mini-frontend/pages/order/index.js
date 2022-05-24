// pages/order/index.ts
Page({

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
        lockOrderList: [
            {
                name: '数停车 (城发天地)',
                status: 'COMPLETE',
                address: '古运路109号',
                time: '2022-05-18 10:00:00 ~ 2022-05-18 12:00:00',
                minutes: '2小时0分0秒',
                payTime: '2022-05-18 12:10:00',
            },
            {
                name: '数停车 (城发天地)',
                status: 'RUNNING',
                address: '古运路109号',
                time: '2022-05-18 10:00:00 ~ 2022-05-18 12:00:00',
                minutes: '2小时0分0秒',
            },
            {
                name: '数停车 (城发天地)',
                status: 'REFUND',
                address: '古运路109号',
                time: '2022-05-18 10:00:00 ~ 2022-05-18 12:00:00',
                minutes: '2小时0分0秒',
                payTime: '2022-05-18 12:10:00',
                refundTime: '2022-05-20 18:00:00'
            }
        ],
        dict: {
            'COMPLETE': '已完成',
            'RUNNING': '进行中',
            'REFUND': '已退费'
        },
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
          console.log(e)
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
        setTimeout(() => {
          this.setData({
            isRefresh: false
          })
          wx.showToast({
            title: '加载完成'
          })
      }, 1500)
    },
    /**
     * 点击去停车
     * @param {*} e 
     */
    onPark(e) {
        console.log(e)
        wx.switchTab({
          url: '/pages/park/index',
        })
    },
    onPay(e) {
        wx.showToast({
          title: '去支付',
          icon: 'none',
          duration: 3000
        })
    },
    onRefund(e) {
        wx.showToast({
          title: '去退款',
          icon: 'none',
          duration: 3000
        })
    },
    onQuest(e) {
        wx.showToast({
          title: '疑惑解答',
          icon: 'none',
          duration: 3000
        })
    }
})