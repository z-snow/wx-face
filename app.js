//app.js
App({
  // 全局共享的数据
  globalData: {
    access_token: ''
  },
  
  onLaunch(){
    // 小程序一加载就开始鉴权
    const {toQueryString}  = require('utils/util.js')
    const body = {
      'grant_type':'client_credentials',
      'client_id':'gqXn0EhjXMFQKYu4zIFBbAYD',
      'client_secret':'RwUMbE5N7MCkOO5mMdLwC08I61vgDRAt'
    }
    // console.log(toQueryString(body))
    wx.request({
      method:'post',
      url: 'https://aip.baidubce.com/oauth/2.0/token' + toQueryString(body),
      success:(res)=>{
        // console.log(res)
      // this.globalData.access_token = res.data.access_token
          this.globalData.access_token = res.data.access_token
      },
      fail(){
        console.log('鉴权失败')
      }
    })
  }
})