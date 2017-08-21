//index.js
//获取应用实例
var app = getApp()
Page({
    data: {
        RefreshNum:0
    },
    
    returnHome:function(){ //返回首页
         wx.navigateTo({
            url: '../index/index'
        })
    },
    onPullDownRefresh: function() {
        var that =this;
        wx.showToast({
            title: '加载中',
            icon: 'loading',
            duration: 1000
        })
        that.setData({
            RefreshNum:++that.data.RefreshNum
        })
        wx.stopPullDownRefresh({
            complete: function(res) {
                if(that.data.RefreshNum < 5){
                    app.getHeadMsg(app, that);
                }
            }
        })
    },
    
    showNoticeMsg: function() { //点击显示公告信息
        var msg = this.data.headMsg.noticeMsg;
        if (msg == '暂无公告') {
            return;
        }
        app.layerNoticeMsg(msg);
    },
    //我的订餐
    linkMyMess: function() {
        wx.navigateTo({
            url: '../myMessList/myMessList'
        })
    },
    //订餐跳转
    linkMyConsumption: function() {
        wx.navigateTo({
            url: '../myConsumption/myConsumption'
        })
    },
    onLoad: function() {
        app.getHeadMsg(app, this);
    },
    onShow:function(){
        app.getHeadMsg(app, this);
    }
})
