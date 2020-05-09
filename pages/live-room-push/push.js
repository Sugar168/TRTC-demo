var plugin = requirePlugin("liveRoomPlugin")

Page({

  /**
   * 页面的初始数据
   */
  data: {
    version: 2,
    liveAppID: 1256342427,
    pushUrl: "rtmp://22604zypush001.erheiyan.club/live/0420xx3?txSecret=5170dd44689907e652659e8bda924373&txTime=5ea279e9",
    mode: 'SD',
    waitingImage:'https://mc.qcloudimg.com/static/img/daeed8616ac5df256c0591c22a65c4d3/pause_publish.jpg',
    enableCamera:true,
    orientation: "vertical",
    objectFit: "contain",
    beauty:4,
    whiteness:4,
    backgroundMute:true,
    minCache: 1,
    maxCache: 3,
    muted: false,
    debug: false,
    autoFocus: true,
    aspect:'9:16',
    minBitrate: 200,
    maxBitrate: 1000,
    zoom: false,
    devicePosition:'front',  //初始化摄像头为前置还是后置，只能初始化的时候设置，动态调整用switchCamera
    frontCamera: true,

    liveRoomPushComponent: null,
    playing:false,
    showHDTips: false, //显示清晰度弹窗
  },
  onPushClick: function () {
    var url = this.data.pushUrl;
    if (url.indexOf("rtmp:") == 0) { } else {
      wx.showToast({
        title: '推流地址不合法，目前仅支持rtmp方式!',
        icon: 'loading',
      })
    }

    this.setData({
      playing: !this.data.playing,
    })

    if (this.data.playing) {
      this.data.liveRoomPushComponent.start();
      wx.showLoading({
        title: '',
      })
    } else {
      this.setData({
        playing: false,
        mode: "SD",
        enableCamera: true,
        orientation: "vertical",
        beauty: 6.3,
        whiteness: 3.0,
        backgroundMute: false,
        debug: false,
      })
      this.data.liveRoomPushComponent.stop();
      setTimeout(() => {
        wx.hideLoading();
      }, 100);
    }
  },
  onSwitchCameraClick: function () {
    this.data.frontCamera = !this.data.frontCamera;
    this.setData({
      frontCamera: this.data.frontCamera
    })
    this.data.liveRoomPushComponent.switchCamera();
  },
  onBeautyClick: function () {
    if (this.data.beauty != 0) {
      this.data.beauty = 0;
      this.data.whiteness = 0;
    } else {
      this.data.beauty = 6.3;
      this.data.whiteness = 3.0;
    }

    this.setData({
      beauty: this.data.beauty,
      whiteness: this.data.whiteness
    })
  },
  stop: function () {
    this.setData({
      playing: false,
      mode: "SD",
      enableCamera: true,
      orientation: "vertical",
      beauty: 6.3,
      whiteness: 3.0,
      backgroundMute: false,
      debug: false,
    })
    this.data.liveRoomPushComponent && this.data.liveRoomPushComponent.stop();
    setTimeout(() => {
      wx.hideLoading();
    }, 100);
  },

  onOrientationClick: function () {
    if (!this.data.enableCamera) {
      wx.showToast({
        icon: 'none',
        title: '请先开启摄像头'
      })
      return;
    }
    if (this.data.orientation == "vertical") {
      this.data.orientation = "horizontal";
    } else {
      this.data.orientation = "vertical";
    }
    this.setData({
      orientation: this.data.orientation
    })
  },
  onSwitchMode: function () {
    var showTips = !this.data.showHDTips;
    this.setData({
      showHDTips: showTips
    })
  },
  onModeClick: function (event) {
    var mode = "SD";
    switch (event.target.dataset.mode) {
      case "SD":
        mode = "SD";
        break;
      case "HD":
        mode = "HD";
        break;
      case "FHD":
        mode = "FHD";
        break;
    }

    this.setData({
      mode: mode,
      showHDTips: false
    })
  },
  onEnableCameraClick: function () {
    this.setData({
      enableCamera: !this.data.enableCamera
    })
    if (this.data.playing) {
      this.data.liveRoomPushComponent.stop();
      setTimeout(() => {
        this.data.liveRoomPushComponent.start();
      }, 500)
    }
  },
  onObjectfitClick: function () {
    if (this.data.objectFit == "fillCrop") {
      this.data.objectFit = "contain";
    } else {
      this.data.objectFit = "fillCrop";
    }

    this.setData({
      objectFit: this.data.objectFit
    })
  },

  onLogClick: function () {
    this.setData({
      debug: !this.data.debug,
    })
  },
  onBackgroundMuteClick: function () {
    this.setData({
      backgroundMute: !this.data.backgroundMute,
    })
  },
  onAutoFocusClick: function () {
    this.setData({
      autoFocus: !this.data.autoFocus,
    })
  },
  onZoomClick: function () {
    this.setData({
      zoom: !this.data.zoom,
    })
  },
  onSnapshotClick: function () {
    this.data.liveRoomPushComponent.snapshot({
      success: function (res){
        wx.saveImageToPhotosAlbum({
          filePath: res.tempImagePath
        })
        console.log(res)
      },
      fail:function(res) {
        console.log(res)
      }
    });
  },
  onMuteClick: function () {
    this.setData({
      muted: !this.data.muted
    })
  },
    
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.data.liveRoomPushComponent = plugin.instance.getLiveRoomPushInstance();
  },

  /**
   * 监听播放事件
   */
  onPushEvent: function (e) {
    var self = this;
    switch (e.detail.tag) {
      case 'pushEvent': {
        switch (e.detail.code) {
          case -1301:
            self.stop();
            wx.showToast({
              title: '打开摄像头失败',
            })
            break;
          case -1302:
            self.stop();
            wx.showToast({
              title: '打开麦克风失败',
            })
            break;
          case -1307:
            self.stop();
            wx.showToast({
              title: '推流多次失败',
            })
            break;
          case 1002:
            setTimeout(() => {
              wx.hideLoading();
            }, 100);
            break;
        }
        break;
      }
      case 'error': {
        console.log('播放出错, errCode[' + e.detail.code + '],errMsg[' + e.detail.detail + ']');
        self.stop();
        break;
      }
    }
  },
})