// app.ts
import login from './api/login';
import loginApi from './api/login'
import CONSTANT from './utils/constant'
App({
  globalData: {
      bottomSafeArea: 0
  },

  onLaunch: function() {
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
      return new Promise((resolve, reject) => {
        wx.login({
            success: (res) => {
                const { code } = res;
                loginApi.login(code).then(res => {
                    if (res.statusCode === CONSTANT.REQUEST_SUCCESS && res.data.code === CONSTANT.REQUEST_SUCCESS && res.data.data !== null) {
                        const { data } = res.data;
                        let user = {
                            id: data.id,
                            phoneNumber: data.iphone,
                            miniOpenId: data.miniOpenId,
                            registerType: data.registerType,
                            unionId: data.unionId,
                            enabled: data.enabled,
                            avatarUrl: ''
                        }
                        // 如果获取到用户信息就存储到store
                        resolve(user);
                    } else {
                        reject(`/pages/login/index?code=${code}`)
                    }
                }).catch(err => {
                    wx.showToast({
                      title: '登录异常',
                      icon: 'error',
                      duration: 3000
                    })
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
      })
  }
})