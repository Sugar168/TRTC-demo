var plugin = requirePlugin("liveRoomPlugin")

Page({

  /**
   * 页面的初始数据
   */
  interval : null,

  data: {
    version: 2,
    mode: 'live',
    liveAppID: 1256342427,
    playUrl: "http://zsplay01-22604.m.qlivecloud.com/live/0420xx3.flv",
    orientation: 'vertical',
    objectFit: 'contain',
    minCache: 1,
    maxCache: 3,
    muted: false,
    debug: false,

    liveRoomComponent: null,
    playing: false,
    pagename : "play1",    
  },


  onPlayClick: function() {
    var url = this.data.playUrl;
    if (url.indexOf("rtmp:") == 0) {} else if (url.indexOf("https:") == 0 || url.indexOf("http:") == 0) {
      if (url.indexOf(".flv") != -1) {}
    } else {
      wx.showToast({
        title: '播放地址不合法，目前仅支持rtmp,flv方式!',
        icon: 'loading',
      })
    }

    this.setData({
      playing: !this.data.playing,
    })

    if (this.data.playing) {
      this.data.liveRoomComponent.start();
      wx.showLoading({
        title: '',
      })
    } else {
      this.data.liveRoomComponent.stop();
      setTimeout(() => {
        wx.hideLoading();
      }, 100);
    }
  },

  stop: function() {
    this.setData({
      playing: false,
      orientation: "vertical",
      objectFit: "contain",
      muted: false,
      debug: false,
    })
    this.data.liveRoomComponent && this.data.liveRoomComponent.stop();
    setTimeout(() => {
      wx.hideLoading();
    }, 100);
  },

  onOrientationClick: function() {
    if (this.data.orientation == "vertical") {
      this.data.orientation = "horizontal";
    } else {
      this.data.orientation = "vertical";
    }
    this.setData({
      orientation: this.data.orientation
    })
  },

  onObjectfitClick: function() {
    if (this.data.objectFit == "fillCrop") {
      this.data.objectFit = "contain";
    } else {
      this.data.objectFit = "fillCrop";
    }

    this.setData({
      objectFit: this.data.objectFit
    })
  },

  onLogClick: function() {
    this.setData({
      debug: !this.data.debug
    })
  },

  onMuteClick: function() {
    this.setData({
      muted: !this.data.muted
    })
  },
  
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options);
    this.setData({
      pagename: options.name ? options.name : "play1",
    })
    this.data.liveRoomComponent = plugin.instance.getLiveRoomInstance();
  },

  onReady : function(e){    
    // const context = wx.createCanvasContext('firstCanvas')
    // context.setStrokeStyle('#00ff00')
    // context.setLineWidth(5)
    // context.rect(0, 0, 200, 200)
    // context.stroke()
    // context.setStrokeStyle('#ff0000')
    // context.setLineWidth(2)
    // context.moveTo(160, 100)
    // context.arc(100, 100, 60, 0, 2 * Math.PI, true)
    // context.moveTo(140, 100)
    // context.arc(100, 100, 40, 0, Math.PI, false)
    // context.moveTo(85, 80)
    // context.arc(80, 80, 5, 0, 2 * Math.PI, true)
    // context.moveTo(125, 80)
    // context.arc(120, 80, 5, 0, 2 * Math.PI, true)
    // context.stroke()
    // context.draw()

    var self = this;
    this.interval = setInterval(function(){
      console.log(self.data.pagename);
    }, 3000)
  },

  onUnload : function(){
    if (this.interval )
      clearInterval(this.interval);
    console.log("onUnload page:", this.data.pagename);
  },

  /**
   * 监听播放事件
   */
  onPlayEvent: function(e) {
    var self = this;
    console.log("pagename:", this.data.pagename, "current e:", e)

    switch (e.detail.tag) {
      case 'playEvent': {
        if (e.detail.code == -2301) {
          self.stop();
          wx.showToast({
            title: '拉流多次失败',
          })
        }
        if (e.detail.code == 2004) {
          setTimeout(() => {
            wx.hideLoading();
          }, 100);
        }
        break;
      }
      case 'error' : {
        console.log('播放出错, errCode[' + e.detail.code + '],errMsg[' + e.detail.detail + ']');
        self.stop();
        break;
      }
    }
  },
})