// app.ts
App({
  globalData: {
  },
  onLaunch: async function() {
      if (!this.isLogin()) {
          this.checkUser()
      }
      
  },
  // 获取用户位置信息
  loadCurrentLocation() {
      return new Promise((resolve, reject) => {
        const locationInfo = wx.getStorageSync('location');
        if (!locationInfo)  {
          wx.getLocation({
              type: 'wgs84',
              success: (res) => {
                  const longitude = res.longitude;
                  const latitude = res.latitude;
                  console.log(longitude, latitude)
                  wx.setStorageSync('location', { longitude, latitude });
                  resolve({longitude, latitude});
                }
            })
        }
    }) 
 },
  isLogin() {
      return Boolean(wx.getStorageSync('user'))
  },

  checkUser() {
      wx.showLoading({
        title: '正在检查登录',
      })
      // 检查是否存在用户,如果存在则直接登录,如果不存在则登录
      //wx.setStorageSync('user', this.globalData.user);
      wx.reLaunch({
        url: '/pages/index/index',
      })
      wx.hideLoading();
  }
})