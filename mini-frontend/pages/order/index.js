// pages/order/index.ts
Page({

    /**
     * 页面的初始数据
     */
    data: {
        isRefresh: false,
        currentTab: 0,
        orderList: [
                {
                name: '地锁停车'
              }, {
                name: '车牌停车'
              }, {
                name: '预约停车'
              }, {
                name: '充值停车'
              }
        ]
    },
    handleClick(e) {
        let currentTab = e.currentTarget.dataset.index
        this.setData({
          currentTab
        })
      },
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
      handleTolower(e){
        wx.showToast({
          title: '到底啦'
        })
      },
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
      }
})