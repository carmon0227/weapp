// pages/product/product.js
Page({
  /**
   * 页面的初始数据
   */
  data: {
      prev_img:[],
      search:[],      //接收搜索信息
      hasPro:true,
  },
    gohome(){
        wx.reLaunch({
            url: '/pages/index/index',
        })
    },
    
    go:function(e) {
        var pid = e.currentTarget.dataset.pid;
        var pname = e.currentTarget.dataset.pname;
        var price = e.currentTarget.dataset.price;
        var color = e.currentTarget.dataset.color;
        wx.navigateTo({
            url: '/pages/productDetail/productDetail?pid='+pid
        })
    },

    //搜索
    show(e) {
        var value = e.detail.value;
        wx.request({
            url: 'http://127.0.0.1:3030/search/search_info',
            method:"post",
            data:{
                value:value
            },
            success:(res)=>{
                this.setData({
                    search:res.data
                })
                console.log(this.data.search)
            },
        })
        wx.showToast({
            title: '加载中',
            icon: 'loading',
            duration: 1000
        })
        setTimeout((res)=>{  
            if(this.data.search.length>0){
                this.setData({
                    prev_img:this.data.search
                })
            }else{
                this.setData({
                    hasPro:false
                })
            }
            wx.hideToast()
        }, 1200)
    },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
      wx.request({
          url: 'http://127.0.0.1:3030/index/index_info',
          method:"get",
          success:(res)=>{
              //console.log(res.data)
            this.setData({
                prev_img:res.data
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