// pages/shopcart/shopcart.js
var app=getApp();
var shopCartInfo=app.globalData.shopCartInfo;

Page({

  /**
   * 页面的初始数据
   */
  data: {
      hasList:true,      //是否有数据
      shopCartList:[],      //保存globaldata的购物车数据
      totalPrice:0,
      selectAllStatus:true,
      orderList:[]      //保存订单数据
  },

    //控制input
    add(e) {
        var index=e.currentTarget.dataset.index;
        var carts=this.data.shopCartList;
        var num=carts[index].quantity;
        num+=1;
        carts[index].quantity=num;
        this.setData({
            shopCartList:carts,
        })
        this.getTotalPrice();
    },
    red(e) {
        var index=e.target.dataset.index;
        var carts=this.data.shopCartList;
        var num=carts[index].quantity;
        if(num<=1){
            return false
        }
        num-=1;
        carts[index].quantity=num;
        this.setData({
            shopCartList:carts
        })
        this.getTotalPrice();
    },

    //计算总价
    getTotalPrice(){
        var carts=this.data.shopCartList;
        var total=0;
        for(var i=0;i<carts.length;i++){
            if(carts[i].selected){
                total+=carts[i].quantity*carts[i].price;
            }
        }
        this.setData({
            shopCartList:carts,
            totalPrice:total.toFixed(2)
        })
    },
    //单个选择事件
    isSelected(e){
        var index=e.currentTarget.dataset.index;
        var carts=this.data.shopCartList;
        var selected=carts[index].selected;
        carts[index].selected=!selected;
        this.setData({
            shopCartList:carts
        })
        // if(!carts[index].selected){
        //     this.setData({
        //         selectedAllStatus:false
        //     })
        // }
        this.getTotalPrice();
    },
    //全选事件
    selectAll(e){
        var selectAllStatus=this.data.selectAllStatus;
        selectAllStatus=!selectAllStatus;
        var carts=this.data.shopCartList;
        for(var i=0;i<carts.length;i++){
            carts[i].selected=selectAllStatus;
        }
        this.setData({
            selectAllStatus:selectAllStatus,
            carts:carts
        })
        this.getTotalPrice();
    },
    //删除商品
    deleteItems() {
        var carts = this.data.shopCartList;
        console.log(carts)
        for (var i = 0; i < carts.length; i++) {   //???
            if (carts[i].selected) {
                carts.splice(i--,1);
                //console.log(carts[i].selected+"+"+i)
            }
        }
        console.log(carts)
        this.setData({
            shopCartList: carts
        })
        if(!carts.length){
            this.setData({
                hasList:false
            })
        }else{
            this.getTotalPrice();
        }
    },

    //跳转
    goDetail:function(e){
        var pid = e.currentTarget.dataset.pid;
        wx.navigateTo({
            url: '/pages/productDetail/productDetail?pid='+pid,
        })
    },

    //结算
    pay(){
        var carts = this.data.shopCartList;
        if(!carts.length){
            wx.showToast({
                title: '购物车空空的，去逛逛吧~',
                icon: "none",
                duration: 2000
            })
            setTimeout(() => {
                wx.hideToast();
            }, 2000)
            return
        }else{
            wx.showToast({
                title: '请稍候',
                icon:"loading",
                duration:1000
            })
            setTimeout(() => {
                wx.hideToast();
            }, 1000)
            console.log(carts)
            for (var i = 0; i < carts.length; i++) {   //???
                if (carts[i].selected) {
                    var list=carts.splice(i--, 1);
                    //console.log(carts[i].selected+"+"+i)
                    this.setData({
                        orderList:this.data.orderList.concat(list)
                    })
                    //console.log(this.data.orderList)
                }
            }
            carts=carts;
            this.setData({
                shopCartList:carts
            })
            var order = this.data.orderList;
            console.log(order)
            setTimeout(()=>{
                for(var i=0;i<order.length;i++){
                    console.log(order[i])
                    wx.request({
                        url: 'http://127.0.0.1:3030/order/order',
                        method:"get",
                        data:{
                            pid:order[i].pid,
                            spid:order[i].spid,
                            pname:order[i].pname,
                            price:order[i].price,
                            quantity:order[i].quantity,
                            colorspec:order[i].colorspec,
                            oimg_url:order[i].spimg_url
                        },
                        success:(res)=>{
                            console.log(res)
                            wx.navigateTo({
                                url: '/pages/order/order',
                            })
                        }
                    })
                }
            },1000)
        } 
    },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
          this.setData({
              shopCartList:app.globalData.shopCartInfo
          })
          //console.log(this.data.shopCartList)
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
      var carts = this.data.shopCartList;
      if (!carts.length) {
          this.setData({
              hasList: false
          })
      } else {
          this.getTotalPrice();
      }
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
        //页面隐藏（更改）时,把shopCartList的数据放入本地储存中
        wx.setStorage({
            key: 'cartItems',
            data: this.data.shopCartList,
        })
        var sum = 0;
        for (var i = 0; i < this.data.shopCartList.length; i++) {
            sum += this.data.shopCartList[i].quantity
            wx.setStorage({
                key: 'cartnum',
                data: sum,
                success: function (res) {
                    //console.log(res)
                }
            })
        }
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
      wx.setStorage({
          key: 'cartItems',
          data: this.data.shopCartList,
      })
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
        this.setData({
            shopCartList: app.globalData.shopCartInfo
        })
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

})