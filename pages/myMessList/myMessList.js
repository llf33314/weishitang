Date.prototype.pattern = function(fmt) {
    var o = {
        "M+": this.getMonth() + 1, //月份
        "d+": this.getDate(), //日
        "h+": this.getHours() % 12 == 0 ? 12 : this.getHours() % 12, //小时
        "H+": this.getHours(), //小时
        "m+": this.getMinutes(), //分
        "s+": this.getSeconds(), //秒
        "q+": Math.floor((this.getMonth() + 3) / 3), //季度
        "S": this.getMilliseconds() //毫秒
    };
    var week = {
        "0": "/u65e5",
        "1": "/u4e00",
        "2": "/u4e8c",
        "3": "/u4e09",
        "4": "/u56db",
        "5": "/u4e94",
        "6": "/u516d"
    };
    if (/(y+)/.test(fmt)) {
        fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    }
    if (/(E+)/.test(fmt)) {
        fmt = fmt.replace(RegExp.$1, ((RegExp.$1.length > 1) ? (RegExp.$1.length > 2 ? "/u661f/u671f" : "/u5468") : "") + week[this.getDay() + ""]);
    }
    for (var k in o) {
        if (new RegExp("(" + k + ")").test(fmt)) {
            fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
        }
    }
    return fmt;
}
var app = getApp()
Page({
    data: {
        nowTime: new Date(Date.parse(new Date())).pattern("yyyy-MM-dd"),
        flag: '',
        height: wx.getSystemInfoSync().windowHeight,
        pageNum: 1,
        hidden: false,
        hasMore: true,
        hasRefesh: false,
        RefreshNum:0
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
                    that.onLoad();
                }
            }
        })
    },
    cancleOrder: function(e) { //取消订单
        var orderId = e.currentTarget.dataset.id;
        var num = e.currentTarget.dataset.num;
        var that =this;
        var data = that.data.data;
        wx.request({
            url: app.domainName + '/messSmallRoutine/' + app.mainId + '/' + orderId + '/79B4DE7C/cancelOrder.do',
            type: 'POST',
            success: function(res) {
                var status = res.data.status;
                if (status == 'success') {
                    app.layerFail('已取消');
                    data[num].messMealOrder.status = 2;
                    that.setData({
                    	data:data
                    })
                } else {
                    app.layerMsg('取消失败')
                }
            }
        })
    },
    delMeal: function(e) { //删除订单
        var orderId = e.currentTarget.dataset.id;
        var num = e.currentTarget.dataset.num;
        var _nowData = this.data.data;
        var _this = this;
        var deleteArray = function(array, num) { //删除数组指定下标的值
            var g = [];
            if (array.length != 0) {
                array[num] = '';
                for (var i = 0, l = array.length; i < l; i++) {
                    if (array[i] != "") {
                        g.push(array[i])
                    }
                }
            };
            return g;
        };
        var newData = deleteArray(_nowData, num);
        wx.request({
            url: app.domainName + '/messSmallRoutine/' + orderId + '/79B4DE7C/delMealOrder.do',
            type: 'POST',
            success: function(res) {
                var status = res.data.status;
                if (status == 'success') {
                    app.layerFail('删除成功');
                    _this.onLoad();
                } else {
                    app.layerMsg('删除失败');
                }
            }
        })
    },
    chooseMeal: function(e) { //去选餐
        var orderId = e.currentTarget.dataset.id;
        wx.redirectTo({
            url: '../chooseMeal/chooseMeal'
        });
    },

    loadMore: function() {
        var _this = this;
        _this.setData({
            hasRefesh: true,
        });
        var bean = {
            pageNum: ++_this.data.pageNum
        }
        if(!_this.data.hasMore){
            _this.setData({
                hasMore: false,
                hidden: false,
            })
            return;
        }
        wx.request({
            url: app.domainName + '/messSmallRoutine/' + app.mainId + '/' + app.cardId + '/79B4DE7C/loadDetailList.do',
            data: bean,
            method: 'GET',
            success: function(res) {
                if (res.data == '-1') {
                    _this.setData({
                        hidden: false,
                        hasMore: false
                    })
                } else {
                    _this.setData({
                        data: _this.data.data.concat(res.data),
                        hidden: true,
                        hasMore: true,
                    })
                }
            }
        });
    },
    onLoad: function() {
        var that = this;
        wx.request({
            url: app.domainName + '/messSmallRoutine/' + app.mainId + '/' + app.cardId + '/79B4DE7C/loadDetailList.do',
            method: 'GET',
            success: function(res) {
                console.log( res.data)
                if( res.data.length < 10){
                    that.setData({
                        hasMore:false
                    })
                }
                that.setData({
                    data: res.data,
                    hidden: true
                })
            }
        })
    }    
})
