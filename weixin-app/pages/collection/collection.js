// pages/collection/collection.js
Page({

    /**
     * 页面的初始数据
     */
    data: {
        isShowmore:false,
        collection:[],
        hasList:true,
    },

    showmore(e){
        var index = e.currentTarget.dataset.index;
        //单选功能
        var collection = this.data.collection;
        var selected = collection[index].selected;
        //每次点击时先把所有选中的改为false
        for(var item of collection){
            item.selected=false;
        }
        collection[index].selected = !selected;
        this.setData({
            collection: collection
        })
        //console.log(this.data.collection)
    },
    //取消收藏
    cancelCollection(e){
        var collection=wx.getStorageSync("collection")
        console.log(collection)
        var index=e.currentTarget.dataset.index;
        if(this.data.collection[index].selected){
            collection.splice(collection[index],1)
        }
        this.setData({
            collection:collection
        })
        wx.setStorageSync("collection", this.data.collection)
        //判断是否还有收藏数据
        if(!this.data.collection.length){
            this.setData({
                hasList:false
            })
        }
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        var collection=wx.getStorageSync("collection")
        //循环强行赋值
        for(var i of collection){
            i.selected=false;
        }
        //console.log(collection)
        this.setData({
            collection:collection
        })
    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function () {
        var list = this.data.collection;
        if (!list.length) {
            this.setData({
                hasList: false
            })
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