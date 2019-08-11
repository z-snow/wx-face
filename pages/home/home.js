// pages/home/home.js
const app = getApp()
console.log(app)

Page({

  /**
   * 页面的初始数据
   */
  data: {
    // 窗口可用高度
    windowHeight: 0,
    positon: 'front',
    src: '',
    // 是否显示照片
    isShowPic: false,
    // 控制人脸信息盒子显示隐藏
    isShowBox:false,
    // 人脸数据
    faceInfo: null,
    map: {
      gender: {
        male: '男',
        female: '女'
      },
      expression: {
        'none': '不笑', smile: '微笑', laugh: '大笑'
      },
      glasses: {
        none: '无眼镜', common: '普通眼镜', sun: '墨镜'
      },
      emotion: {
        angry: '愤怒', disgust: '厌恶', fear: '恐惧', happy: '高兴',
        sad: '伤心', surprise: '惊讶', neutral: '无情绪'
      }
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const { windowHeight } = wx.getSystemInfoSync()
    this.setData({
      windowHeight
    })
    // console.log(this.windowHeight)
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  // 切换摄像头
  reverseCamera() {
    const positon = this.data.positon === 'front' ? 'back' : 'front'
    this.setData({
      positon
    })
  },
  // 拍照
  takephoto() {
    // 创建一个摄像头对象
    const ctx = wx.createCameraContext()
    ctx.takePhoto({
      quality: 'hight',
      success: (res) => {
        // 拍照成功的回调
        // console.log(res.tempImagePath)
        this.setData({
          src: res.tempImagePath,
          isShowPic: true
        }, this.checkFace.bind(this))
      },
      // 拍照失败的回调
      fail: () => {
        console.log('拍照失败')
        this.setData({
          src: ''
        })
      }
    })
  },
  // 从相册选照片
  choosePhoto() {
    wx.chooseImage({
      count: 1,
      sizeType: ['original'],
      sourceType: ['album'],
      success: (res) => {
        // console.log(res)
        if (res.tempFilePaths.length > 0) {
          this.setData({
            src: res.tempFilePaths[0],
            isShowPic: true
          }, () =>{ this.checkFace()})
        }
      },
      fail: () => {
        console.log('照片选取失败')
      }
    })
  },
  // 重新选择照片
  rechoose() {
    this.setData({
      isShowPic: false,
      src: '',
      // 用户重新选择照片，隐藏颜值框
      isShowBox:false
    })
  },
  // 检测颜值
  checkFace() {
    console.log('开始检测')
    const token = app.globalData.access_token
    if (!token) {
      return wx.showToast({
        title: '无效的token',
      })
    }
    wx.showLoading({
      title: '颜值检测中',
    })
    const fileStr = wx.getFileSystemManager().readFileSync(this.data.src, 'base64')
    // 请求测颜值API
    wx.request({
      url: `https://aip.baidubce.com/rest/2.0/face/v3/detect?access_token=${token}`,
      method: 'post',
      header: {
        'Content-Type': 'application/json'
      },
      data: {
        image_type: 'BASE64',
        image: fileStr,
        face_field: 'age,beauty,expression,gender,glasses,emotion'
      },
      success: (res) => {
        console.log(res)
        if (res.data.result.face_num <= 0) {
          return wx.showToast({
            icon:'none',
            title: '未检测到人脸',
          })
        } else {
          this.setData({
            faceInfo: res.data.result.face_list[0],
            isShowBox:true
          })
        }

      },
      fail: () => {
        wx.showToast({
          title: '颜值检测失败',
        })
      },
      complete:()=>{
        wx.hideLoading()
      }
    })

  }

})