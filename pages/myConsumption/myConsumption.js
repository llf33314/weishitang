
Date.prototype.format = function(format) {
       var date = {
              "M+": this.getMonth() + 1,
              "d+": this.getDate(),
              "h+": this.getHours(),
              "m+": this.getMinutes(),
              "s+": this.getSeconds(),
              "q+": Math.floor((this.getMonth() + 3) / 3),
              "S+": this.getMilliseconds()
       };
       if (/(y+)/i.test(format)) {
              format = format.replace(RegExp.$1, (this.getFullYear() + '').substr(4 - RegExp.$1.length));
       }
       for (var k in date) {
              if (new RegExp("(" + k + ")").test(format)) {
                     format = format.replace(RegExp.$1, RegExp.$1.length == 1
                            ? date[k] : ("00" + date[k]).substr(("" + date[k]).length));
              }
       }
       return format;
}

var app = getApp();
Page({
    data: {
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
    loadMore: function() {
        var _this = this;
        _this.setData({
            hasRefesh: true,
        });
        var bean = {
            pageNum: ++_this.data.pageNum
        };
        if(!_this.data.hasMore){
            _this.setData({
                hasMore: false,
            })
            return;
        }
        wx.request({
            url: app.domainName + '/messSmallRoutine/' + app.mainId + '/' + app.cardId + '/79B4DE7C/loadOrderList.do',
            data: bean,
            method: 'GET',
            success: function(res) {
                if (res.data == '-1') {
                    _this.setData({
                        hasMore: false,
                    })
                } else {
                    var _d = res.data;
                    var l = _d.length;
                    if (l != 0) {
                        for (var i = 0; i < l; i++) {
                            _d[i].hiddenView = true;
                        }
                    }
                    
                for(let i=0;i<_d.length;i++){
                   var btotal =  _d[i].messConsumerDetail.breakfastNum *   _d[i].messConsumerDetail.breakfastPrice;
                   var ltotal =  _d[i].messConsumerDetail.lunchNum *   _d[i].messConsumerDetail.lunchPrice;
                   var dtotal =  _d[i].messConsumerDetail.dinnerNum *   _d[i].messConsumerDetail.dinnerPrice;
                   var ntotal =  _d[i].messConsumerDetail.nightNum *   _d[i].messConsumerDetail.nightPrice;
                   var utotal =  _d[i].messConsumerDetail.universalNum *   _d[i].messConsumerDetail.universalPrice;
                   _d[i].messConsumerDetail.btotal = btotal.toFixed(2);
                   _d[i].messConsumerDetail.ltotal = ltotal.toFixed(2);
                   _d[i].messConsumerDetail.dtotal = dtotal.toFixed(2);
                   _d[i].messConsumerDetail.ntotal = ntotal.toFixed(2);
                    _d[i].messConsumerDetail.utotal = utotal.toFixed(2);
                     _d[i].messConsumerDetail.alltotal = (btotal + ltotal + dtotal +ntotal +  utotal).toFixed(2);
                   _d[i].time = new Date(_d[i].messConsumerDetail.time).format('MM-dd/hh:mm');
                }
                var newDate = new Date();
                console.log(newDate)
                console.log(newDate.format('yyyy-MM-dd h:m:s'));
                    console.log(_d)
                    _this.setData({
                        data: _this.data.data.concat(_d),
                        hidden: true,
                        hasRefesh: false,
                        hidden: true,
                        dataLength: _this.data.data.length
                    })
                }
            }
        });
    },
    showDetail: function(e) {
        const num = e.currentTarget.dataset.num;
        const that = this;
        const data = that.data.data;
        if (data[num].hiddenView) {
            data[num].hiddenView = false
        } else {
            data[num].hiddenView = true;
        };
        that.setData({
            data: data
        });
    },
    onLoad: function() {
        var that = this;
        wx.request({
            url: app.domainName + '/messSmallRoutine/' + app.mainId + '/' + app.cardId + '/79B4DE7C/loadOrderList.do',
            method: 'GET',
            success: function(res) {
                var _d = res.data;
                var l = _d.length;
                if (l != 0) {
                    for (var i = 0; i < l; i++) {
                        _d[i].hiddenView = true;
                    }
                };
               console.log(_d)
                for(let i=0;i<_d.length;i++){
                   var btotal =  _d[i].messConsumerDetail.breakfastNum *   _d[i].messConsumerDetail.breakfastPrice;
                   var ltotal =  _d[i].messConsumerDetail.lunchNum *   _d[i].messConsumerDetail.lunchPrice;
                   var dtotal =  _d[i].messConsumerDetail.dinnerNum *   _d[i].messConsumerDetail.dinnerPrice;
                   var ntotal =  _d[i].messConsumerDetail.nightNum *   _d[i].messConsumerDetail.nightPrice;
                   var utotal =  _d[i].messConsumerDetail.universalNum *   _d[i].messConsumerDetail.universalPrice;
                   _d[i].messConsumerDetail.btotal = btotal.toFixed(2);
                   _d[i].messConsumerDetail.ltotal = ltotal.toFixed(2);
                   _d[i].messConsumerDetail.dtotal = dtotal.toFixed(2);
                   _d[i].messConsumerDetail.ntotal = ntotal.toFixed(2);
                    _d[i].messConsumerDetail.utotal = utotal.toFixed(2);
                     _d[i].messConsumerDetail.alltotal = (btotal + ltotal + dtotal +ntotal +  utotal).toFixed(2);
                  
                  _d[i].time = new Date(_d[i].messConsumerDetail.time).format('MM-dd/hh:mm');

                
                }
              
               if(_d.length < 20){
                   console.log('1111')
                    that.setData({
                        hasMore:false
                    })
                }
               
                that.setData({
                    data: _d,
                    hidden: true,
                    dataLength: _d.length
                });
            }
        })
    }
});
