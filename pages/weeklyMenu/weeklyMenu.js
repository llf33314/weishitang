var app = getApp()
Page({
    data: {
        toView: 'red',
        scrollTop: 100,
        rightHeight: '440',
        messMenus: [],
        messMenusList: [],
        showPopup:false,
        images:{},
        defaultImg:app.domainName+'/images/mess/default.png',
        week: '',
        mealType: '',
        clickeds: [{isClicked: true},{isClicked: false},{isClicked: false},{isClicked: false},{isClicked: false},{isClicked: false},{isClicked: false}],
        dayType: [{isClicked: true},{isClicked: false},{isClicked: false},{isClicked: false}],
    },
   
    tap: function(e) {
        for (var i = 0; i < order.length; ++i) {
            if (order[i] === this.data.toView) {
                this.setData({
                    toView: order[i + 1]
                })
                break
            }
        }
    },
     returnHome:function(){ //返回首页
        wx.navigateBack({
                delta: 6
            })
    },
    tapMove: function(e) {
        this.setData({
            scrollTop: this.data.scrollTop + 10
        })
    },
    isContains: function(str, substr) {
        return new RegExp(substr).test(str);
    },
    screen: function(e) {
        var mymessMenus = [];
        var this_type = parseInt(e.currentTarget.dataset.type);
        for (var i = 0; i < this.data.messMenusList.length; i++) {
            if (this.data.messMenusList[i].type == this_type) {
                mymessMenus.push(this.data.messMenusList[i]);
            }
        }
        var that = this;
        that.data.messMenus = [];
        const type = e.currentTarget.dataset.type;
        const dayType = that.data.dayType;
        const l = dayType.length;
        for (let i = 0; i < l; i++) {
            if (type == i) {
                dayType[i].isClicked = true
            } else {
                dayType[i].isClicked = false
            }
        }
        var  isEmpty = false;
        if(mymessMenus.length == 0){
             isEmpty=true
        }
        that.setData({
            dayType: dayType,
            messMenus: mymessMenus,
            isEmpty:isEmpty
        })

    },
     screen2: function(typez) {
         console.log('typez========'+typez)
        var mymessMenus = [];
        var this_type = parseInt(typez);
        for (var i = 0; i < this.data.messMenusList.length; i++) {
            if (this.data.messMenusList[i].type == this_type) {
                mymessMenus.push(this.data.messMenusList[i]);
            }
        }
        var that = this;
        that.data.messMenus = [];
        const type = typez;
        const dayType = that.data.dayType;
        const l = dayType.length;
        for (let i = 0; i < l; i++) {
            if (type == i) {
                dayType[i].isClicked = true
            } else {
                dayType[i].isClicked = false
            }
        }
        var  isEmpty = false;
        if(mymessMenus.length == 0){
             isEmpty=true
        }
        that.setData({
            dayType: dayType,
            messMenus: mymessMenus,
            isEmpty:isEmpty
        })

    },
    
    showNoticeMsg: function() { //点击显示公告信息
        var msg = this.data.headMsg.noticeMsg;
        if (msg == '暂无公告') {
            return;
        }
        app.layerNoticeMsg(msg);
    },
    lookDetailMsg:function(e){ //点击放大
      
      
        var t  = e.target.dataset;
        this.setData({
            showPopup:true,
            largetMsg:t
        })
    },
    closePopup:function(){
        this.setData({
            showPopup:false,
        })
    },
    onLoad: function(options) {
    	wx.showToast({
            title: '加载中',
            icon: 'loading',
            duration: 50000
        })
        app.getHeadMsg(app, this);
        var options = {
            week: 1,
            mealType: 0,
        }
        getMenus(options, this);
    },
    onShow:function(options){
        app.getHeadMsg(app, this);
        var options = {
            week: 1,
            mealType: 0,
        }
        getMenus(options, this);
    },
    linkWeekyMenu: function(e) {
        var _this = this;
        wx.showToast({
            title: '加载中',
            icon: 'loading',
            duration: 50000
        })
        setTimeout(function() {
            const week = e.currentTarget.dataset.week;
            const clickeds = _this.data.clickeds;
            const l = clickeds.length;
            for (let i = 0; i < l; i++) {
                if (week - 1 == i) {
                    clickeds[i].isClicked = true
                } else {
                    clickeds[i].isClicked = false
                }
            }
            
            _this.setData({
                clickeds: clickeds,
                dayType: [{isClicked: true},{isClicked: false},{isClicked: false},{isClicked: false}],
            })
            var options = {
                week: week || 1,
                mealType: 0,
            }
           
            getMenus(options, _this);
           // _this.screen2(0)
            wx.hideToast()
        }, 500)
    },
})

function getMenus(options, that) {
    wx.getSystemInfo({
    success: function(res) {
        that.setData({
            windowWidth:res.windowWidth,
            windowHeight:res.windowHeight
        })
      }
    })
    wx.request({
        url: app.domainName + '/messSmallRoutine/' + app.cardId + '/' + options.week + '/' + options.mealType + '/79B4DE7C/mealOrder.do',
        data: {},
        method: 'GET',
        success: function(res) {
            var mymessMenus = [];
            for (var i = 0; i < res.data.messMenus.length; i++) {
                if (res.data.messMenus[i].type == options.mealType) {
                    mymessMenus.push(res.data.messMenus[i]);
                }
            }
            var  isEmpty = false;
            if(mymessMenus.length == 0){
                isEmpty=true
            }
         
            that.setData({
                messMenus: mymessMenus,
                messMenusList: res.data.messMenus,
                week: options.week,
                mealType: options.mealType,
                isEmpty:isEmpty
            })
            wx.hideToast();
        },
        fail: function() {
            // fail
        },
        complete: function() {
            // complete
        }
    })
}
