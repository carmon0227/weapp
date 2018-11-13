Page({

  /**
   * 页面的初始数据
   */
  data: {
    index_info:[],
    index_swiper:[],
    index_details:[],
  },

    showmore: function () {
        wx.navigateTo({
            url: '/pages/productList/productList',
        })
    },
    goDetail(e){
        var pid=e.currentTarget.dataset.pid;
        //console.log(pid)
        wx.navigateTo({
            url: '/pages/productDetail/productDetail?pid='+pid,
        })
    },

    go(e){
        wx.reLaunch({
            url: '/pages/product/product',
        })
    },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //轮播
      wx.request({
          url: 'http://127.0.0.1:3030/index/index_swiper',
          method: "get",
          success: (res) => {
              this.setData({
                  index_swiper: res.data
              })
          }
      })

    //左右滑
    wx.request({
        url: 'http://127.0.0.1:3030/index/index_info',
        method:"get",
        success:(res)=>{
            this.setData({
                index_info:res.data
            })
        }
    })

    //详情
      wx.request({
          url: 'http://127.0.0.1:3030/index/index_details',
          method: "get",
          success: (res) => {
              this.setData({
                  index_details: res.data
              })
          }
      })
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
    
  }
})