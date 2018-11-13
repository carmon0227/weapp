// pages/productDetail/productDetail.js

var n=0;      //控制购物车按钮先后顺序
var app=getApp();      //获取app实例
var shopCartInfo=app.globalData.shopCartInfo;
var ppid=null;
var m=0;

Page({
    /**
     * 页面的初始数据
     */
    data: {
        showModalStatus: "",
        num:1,      //input
        spannum:0,
        showspan:false,      //控制购物车图标显示隐藏
        s_img:[],      //请求得到的轮播图数据
        i_img:[],      //请求得到的详细介绍数据
        pname:"",
        price:"",
        spec:"",
        color:[],      //存放颜色
        cur:null,      //控制是否选中以及样式
        colorSpec:[],
        spid:null,      //存放每个规格对应的spid
        spimg_url:"",      //存放每个规格对应的购物车页面prev图
        colorspec:"",      //存放每个规格对应的颜色
        basicmsg:"",      //存放商品基本信息
        isCollected:false,      //控制商品收藏状态
        pid:null,      //存放传递过来的pid
    },

    gocart() {
        wx.reLaunch({
            url: '/pages/shopcart/shopcart',
        })
    },
    collect(){
        this.setData({
            isCollected:!this.data.isCollected
        })
        if(this.data.isCollected){
            wx.showToast({
                title: '收藏成功~',
                icon:"none",
                duration:2000
            })
            setTimeout(()=>{
                wx.hideToast();
            },2000)
            //把本商品存入本地缓存中
            var basicmsg = this.data.basicmsg;
            var myCollection=wx.getStorageSync("collection") || [];
            myCollection=myCollection.concat(basicmsg);
            wx.setStorageSync("collection", myCollection)
        }else{
            wx.showToast({
                title: '成功取消收藏~',
                icon: "none",
                duration: 2000
            })
            setTimeout(() => {
                wx.hideToast();
            }, 2000)
            var myCollection = wx.getStorageSync("collection")
            for(var i=0;i<myCollection.length;i++){
                if(this.data.pid==myCollection[i].pid){
                    myCollection.splice(i,1)
                }
            }
            //console.log(myCollection)
            wx.setStorageSync("collection", myCollection)
        }
    },

    //控制input
    add(){
        var n=this.data.num+1;
        if(n>999){n=999};
        this.setData({
            num:n
        })
    },
    red(){
        var n=this.data.num-1;
        if(n<1){n=1};
        this.setData({
            num:n
        })
    },
    //通过循环生成的index控制样式
    checked(e){
        //console.log(e.target.dataset.spid)
        //console.log(e.target.dataset.spimg_url)
        this.setData({
            cur:e.target.dataset.index,      //获取选中下标
            spid: e.target.dataset.spid,      //获取选中规格的spid
            spimg_url:e.target.dataset.spimg_url,      //获取选中规格的对应图片
            colorspec: e.target.dataset.colorspec,      //获取选中规格的对应颜色
        })
        //console.log(this.data.cur)
        //console.log(e.target.dataset.item)
    },

    //控制弹出框
    showModal: function () {
        if(n==0){
            // 显示遮罩层
            var animation = wx.createAnimation({
                duration: 200,
                timingFunction: "linear",
                delay: 0
            })
            this.animation = animation;
            animation.translateY(300).step();
            this.setData({
                animationData: animation.export(),
                showModalStatus: true
            })
            setTimeout(function () {
                animation.translateY(0).step()
                this.setData({
                    animationData: animation.export()
                })
            }.bind(this), 0);
            n+=1;
        } else {
            //console.log(this.data.cur)
            //先判断当前有没有选中规格，没有则弹出提示
            if(this.data.cur===null){
                wx.showModal({
                    title: '提示',
                    content: '请选择规格',
                    showCancel:false
                })
                return
            }
            
            //购物车信息缓存
            var cartItems = wx.getStorageSync('cartItems') || [];
            //console.log(cartItems)
            //console.log(typeof (this.data.cur))
            //判断购物车缓存中是否已存在该货品
            var exist = cartItems.find( (ele)=> {
                return ele.spid == this.data.spid   //使用每个规格对应的独一无二的id比较
            })
            if (exist) {
                //如果存在，则增加该货品的购买数量
                exist.quantity = parseInt(exist.quantity) + this.data.num
            } else {
                //如果不存在，传入该货品信息
                cartItems.push({
                    pid:ppid,      //存入ppid
                    spid: this.data.spid,   //某种颜色规格对应的spid
                    quantity: this.data.num,
                    price: this.data.price,
                    pname:this.data.pname,
                    colorspec:this.data.colorspec,
                    spimg_url:this.data.spimg_url,
                    selected:true
                })
            }
            //加入购物车数据，存入缓存
            wx.setStorage({
                key: 'cartItems',
                data: cartItems,
                success: function (res) {
                    wx.showToast({
                        title: "添加购物车成功",
                        icon: "none",
                        durantion: 2000
                    })
                    //console.log(res)
                    setTimeout(()=>{
                        wx.hideToast();
                    },2000)
                }
            })
            //图标数量缓存
            //console.log(cartItems)
            var sum = 0;
            for (var i = 0; i < cartItems.length; i++) { 
                //console.log(cartItems[i].quantity)
                sum += cartItems[i].quantity
                wx.setStorage({
                    key: 'cartnum',
                    data: sum,
                    success: function (res) {
                        //console.log(res)
                    }
                })
            }
            //console.log(sum)
            //先弹出,再把数据传到span
            this.setData({
                showspan: true,
                //spannum: this.data.spannum += this.data.num
                spannum:sum
            })
            
        }
    },
    hideModal: function () {
        // 隐藏遮罩层
        var animation = wx.createAnimation({
            duration: 200,
            timingFunction: "linear",
            delay: 0
        })
        this.animation = animation;
        animation.translateY(300).step();
        this.setData({
            animationData: animation.export(),
        })
        setTimeout(function () {
            animation.translateY(0).step()
            this.setData({
                animationData: animation.export(),
                showModalStatus: false
            })
        }.bind(this), 200)
        n=0;      //初始化n
    },


    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        //console.log(options.pid)
        var myCollection=wx.getStorageSync("collection") || [];
        if(myCollection.length){
            for(var i=0;i<myCollection.length;i++){
                if(options.pid==myCollection[i].pid){
                    this.setData({
                        isCollected:true,
                        pid:options.pid
                    })
                }
            }
        }
        
        //根据传递过来的pid发送请求
        var pid=options.pid;
        ppid=Number(pid);      //把获取到的pid转化为数字，放到全局变量ppid中
        wx.request({
            url: 'http://127.0.0.1:3030/details/pro_details_swiper',
            method:"get",
            data:{
                pid:pid
            },
            success:(res)=>{
                //console.log(res.data)
                    this.setData({
                        s_img:res.data
                    })
            }
        })
        wx.request({
            url: 'http://127.0.0.1:3030/details/pro_details_basicmsg',
            method: "get",
            data: {
                pid: pid
            },
            success: (res) => {
                //console.log(res.data)
                this.setData({
                    basicmsg: res.data
                })
                //console.log(this.data.basicmsg)
            }
        })
        wx.request({
            url: 'http://127.0.0.1:3030/details/pro_details_intr',
            method: "get",
            data: {
                pid: pid
            },
            success: (res) => {
                //console.log(res.data)
                this.setData({
                    i_img: res.data
                })
            }
        })
        //请求该商品每个规格
        wx.request({
            url: 'http://127.0.0.1:3030/details/shopcart_prev',
            method:"get",
            data:{
                pid:pid
            },
            success:(res)=>{
                this.setData({
                    colorSpec:res.data,
                })
            }
        })
        setTimeout(()=>{
            console.log(this.data.basicmsg)
            this.setData({
                pname:this.data.basicmsg[0].pname,
                price: this.data.basicmsg[0].price,
            })
        }, 1500)
        
    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function () {
        //从缓存中取出数据
        //先判断缓存中cartItem有没有数据，没有则令spannum为空
        var cartItems=wx.getStorageSync('cartItems');
        //console.log(cartItems)
        if(!cartItems.length){
            this.setData({
                spannum:""
            })
        }else{
            wx.getStorage({
                key: 'cartnum',
                success: (res) => {
                    //console.log(res)
                    //console.log(res.data)
                    //判断:如果本地储存中data有数据，才使小蓝点显示
                    if(res.data!=""){
                        this.setData({
                            spannum: res.data,
                            showspan:true
                        })
                    }
                    //console.log(this.data.spannum)
                },
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
        n=0;      //再次初始化n，使之每次进入页面点击第一次弹出模态框
        shopCartInfo = wx.getStorageSync("cartItems")
        //console.log(shopCartInfo)
        app.globalData.shopCartInfo = shopCartInfo      //重新赋值地址
        //console.log(app.globalData.shopCartInfo)
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