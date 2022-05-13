// app.ts
import login from './api/login';
import loginApi from './api/login'
import CONSTANT from './utils/constant'
App({
  globalData: {
      bottomSafeArea: 0
  },

  onLaunch: async function() {

      if (!this.isLogin()) {
          this.checkUser()
      }
  },

  // 获取机器信息
  getSystemInfo() {
      wx.getSystemInfo({
          success: (res) => {
              conssole(res)
              const { safeArea, screenHeight } = res;
              const { bottom } = safeArea;
              this.globalData.bottomSafeArea = screenHeight - bottom;
          }
      })
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

 /**
  * 判断用户是否登录,如果登录则忽略,如果未登录那么调用登录
  */
  isLogin() {
      return Boolean(wx.getStorageSync('user'))
  },

  /**
   *  微信登录,成功之后跳转到一键登录页面.
   */
  checkUser() {
    wx.login({
        success: (res) => {
            const { code } = res;
            console.log(code)
            loginApi.login(code).then(res => {
                console.log(res);
                if (res.code === CONSTANT.REQUEST_SUCCESS) {
                    // 如果获取到用户信息就存储到store
                    wx.setStorageSync('user', res.data);
                    wx.navigateTo({
                      url: '/pages/index/index',
                    })
                } else {
                    wx.navigateTo({
                        url: `/pages/login/index?code=${code}`,
                    })
                }
            })
        },
        fail: (err) => {
         wx.showToast({
             title: '登录失败',
             icon: 'error',
             duration: 3000
         }) 
        }
     })
  }
})