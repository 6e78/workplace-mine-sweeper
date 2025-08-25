// app.js
App({
  onLaunch() {
    // 登录
    wx.login({
      success: res => {
        if (res.code) {
          // 发起网络请求
          wx.request({
            url: this.globalData.backendUrl + '/api/login',
            method: 'POST',
            data: {
              code: res.code
            },
            success: apiRes => {
              console.log('Login success, got token:', apiRes.data.token);
              // 在这里可以将token保存到全局或本地存储
              this.globalData.token = apiRes.data.token;
            },
            fail: err => {
              console.error('Login API failed', err);
            }
          })
        } else {
          console.error('wx.login failed!' + res.errMsg)
        }
      }
    })
  },
  globalData: {
    userInfo: null,
    token: null,
    backendUrl: 'http://127.0.0.1:8000' // Your local backend server
  }
})
