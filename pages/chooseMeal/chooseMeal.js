var app = getApp();
Page({
    data: {
        flag: false,
        selectAll: [{
            name: 'selectAll',
            value: '全选',
        }],
        selectAllFlag: false,
        changeNum: 1,
        submitFlag:2
    },
   
    showNoticeMsg: function() { //点击显示公告信息
        var msg = this.data.headMsg.noticeMsg;
        if (msg == '暂无公告') {
            return;
        }
        app.layerNoticeMsg(msg);
    },
    linkToR:function(){
    	 wx.redirectTo({
             url: '../reservation/reservation'
         })
    },
    selectThisMeal: function(e) { //单个选择
        const dataset = e.currentTarget.dataset;
        const id = dataset.id;
        const num = dataset.num;
        const type = dataset.type;
        const listObj = this.data.listObj;
        switch (type) {
            case '0':
                if (listObj[num].type.breakfast) {
                    listObj[num].type.breakfast = null;
                } else {
                    listObj[num].type.breakfast = true;
                }
                break;
            case '1':
                if (listObj[num].type.lunch) {
                    listObj[num].type.lunch = null;
                } else {
                    listObj[num].type.lunch = true;
                }
                break;
            case '2':
                if (listObj[num].type.dinner) {
                    listObj[num].type.dinner = null;
                } else {
                    listObj[num].type.dinner = true;
                }
                break;
            case '3':
                if (listObj[num].type.night) {
                    listObj[num].type.night = null;
                } else {
                    listObj[num].type.night = true;
                }
                break;
            default:
                return;
        }
        this.setData({
            listObj: listObj
        })
    },
    selectAll: function(e) { //全选
        const _this = this;
        const _thisD = _this.data;
        const selectAllFlag = _thisD.selectAllFlag
        const listObj = _thisD.listObj;
        const l = listObj.length;
       
        if (selectAllFlag) {
            for (let i = 0; i < l; i++) {
                listObj[i].type.breakfast = false;
                listObj[i].type.lunch = false;
                listObj[i].type.dinner = false;
                listObj[i].type.night = false;
            }
            _this.setData({
                selectAllFlag: false,
                listObj: listObj
            })
        } else {
            for (let i = 0; i < l; i++) {
                listObj[i].type.breakfast = true;
                listObj[i].type.lunch = true;
                listObj[i].type.dinner = true;
                listObj[i].type.night = true;
            }
            _this.setData({
                selectAllFlag: true,
                listObj: listObj
            })
        }
    },
    changeNum: function(e) {
        const type = e.currentTarget.dataset.type;
        var num = this.data.changeNum;
        var capNum = this.data.capNum;

        if (type == 'm') { //--
            num--;
            if (num < 0) {
                num = 0
            }
        } else { //++
            num++;
            if (num > 100) {
                num = 100
            }
        }
        if (capNum > 0) {
            if (num > capNum) {
                app.layerMsg('添加份数不能超过' + capNum + '份！');
                return;
            }
        }
        this.setData({
            changeNum: num
        })

    },
    submit: function(e) { //提交数据
        if (this.data.changeNum == 0) {
            app.layerMsg('请添加份数！');
            return;
        }
        var flag = this.data.submitFlag;
        if(flag == '1'){
            console.log('正在提交....')
            return;
        }
        this.setData({
            submitFlag:1
        });
        var _thisD = this.data;
        var size = _thisD.changeNum;
        var listObj = _thisD.listObj;
        var l = listObj.length;
        
        var newg = [];
        var m=0;
        for (var i = 0,j = 0; i < l,j<l; i++,j++) {
            var o = {};
            var g = [];
            var type = listObj[i].type;
            if (type.breakfast && listObj[i].messTypeObj.breakfast) {
                g.push('0');
            }
            
            if (type.lunch && listObj[i].messTypeObj.lunch) {
                g.push('1');
            }
            if (type.dinner && listObj[i].messTypeObj.dinner) {
                g.push('2');
            }
            if (type.night && listObj[i].messTypeObj.night) {
                g.push('3');
            }
           
            if (type.breakfast || type.dinner || type.lunch || type.night) {
               
            var g = '"'+"id"+m+ '"' + ":"+'"' + listObj[i].id +'"'+ ","+'"'+"mealTypes"+m+'"'+":"+'"'+ g.join(',') +'"';
             ++m;
                newg.push(g)
            }   
        };
       if (newg.length == 0) {
            app.layerMsg('请选餐！');
            return;
        }
        var realg = newg.join(",");
        var r = realg.substr(0, realg.length - 1);
        var r2 ='{"'+ r.substr(1) + '"}';
       
        var  bean = {
            "size": m,
            "mealNum":_thisD.changeNum,
            "json":r2,
            "mainId": app.mainId,
            "cardId": app.cardId,
            "memberId":app.memberId
        };
        var _this = this;
        wx.request({
            url: app.domainName + '/messSmallRoutine/79B4DE7C/saveChooseMealOrder.do',
            data: bean,
           // method: 'POST',
            success: function(res) {
                const state = res.data.status;
                _this.setData({
                    submitFlag:2
                });
                if(state == 'error'){
                   wx.showModal({
                       // title: '提交失败',
                       content: '您已经订过了！',
                        showCancel: false,
                        confirmText: '我知道了',
                        success: function(res) {
                        	if (res.confirm) {
                                wx.navigateBack({
                                    delta: 3
                                })
                            }
                        }
                    })
                    return
                }
                if (state == 'success') {
                	
                    wx.showModal({
                        title: '提交成功',
                        content: '请在进餐时间到食堂扫码取餐！',
                        showCancel: false,
                        confirmText: '我知道了',
                        success: function(res) {
                            if (res.confirm) {
                                wx.navigateBack({
                                                    delta: 3
                                                })
                                //  wx.navigateBack({
                                //             delta: 1
                                //         })
                            }
                        }
                    })
                } else if (state == 'error1') {
                    if (_thisD.bitBuy == 0) {
                        wx.showModal({
                            title: '温馨提示',
                            content: '当前饭票数量不足',
                            confirmText: '充值',
                            success: function(res) {
                                if (res.confirm) {
                                    wx.redirectTo({
                                        url: '../buyTickets/buyTickets'
                                    })
                                }
                            }
                        })
                    } else {
                        wx.showModal({
                            title: '温馨提示',
                            content: '饭票不足,请到饭堂进行充值！',
                            confirmText: '充值',
                            success: function(res) {
                                if (res.confirm) {
                                    wx.redirectTo({
                                        url: '../buyTickets/buyTickets'
                                    })
                                }
                            }
                        })
                    }
                } else if (state == 'error2') {
                    app.layerMsg('已超过预定时间！')
                } else {
                    if (_thisD.bitBuy == 0) {
                        wx.showModal({
                            title: '温馨提示',
                            content: '当前饭票数量不足',
                            confirmText: '充值',
                            success: function(res) {
                                if (res.confirm) {
                                    wx.redirectTo({
                                        url: '../buyTickets/buyTickets'
                                    })
                                }
                            }
                        })
                    } else {
                        wx.showModal({
                            title: '温馨提示',
                            content: '饭票不足,请到饭堂进行充值！',
                            confirmText: '充值',
                            success: function(res) {
                                if (res.confirm) {
                                    wx.redirectTo({
                                        url: '../buyTickets/buyTickets'
                                    })
                                }
                            }
                        })
                    }
                }
            }
        });
    },
    onLoad: function() {
        app.getHeadMsg(app, this);

        var _this = this;
        var isContains = function(str, substr) {
            return new RegExp(substr).test(str);
        };
         _this.setData({
            listObj: null,
            messTypeObj: null,
            capNum: null,
            bitBuy: null
        })
        
        wx.request({
            url: app.domainName + '/messSmallRoutine/' + app.cardId + '/79B4DE7C/chooseMeal.do',
            method: 'GET',
            success: function(res) {
                const bitBuy = res.data.messBasisSet.bitBuy;
                const messType = res.data.messBasisSet.messType;
                const capNum = res.data.messBasisSet.capNum; //大于0限制  否则不限制
                const messTypeObj = {
                    breakfast: isContains(messType, 0),
                    lunch: isContains(messType, 1),
                    dinner: isContains(messType, 2),
                    night: isContains(messType, 3),
                }
                const listObj = res.data.messMealOrders;
                const l = listObj.length;
                var g = [];
                for (let i = 0; i < l; i++) {
                    var newObj = {};
                    newObj.time = listObj[i].time;
                    newObj.mealType = listObj[i].messMealOrder.mealType;
                    newObj.id = listObj[i].messMealOrder.id;
                    newObj.flag = false;
                    newObj.type = {
                        breakfast: false,
                        lunch: false,
                        dinner: false,
                        night: false,
                    };
                    newObj.messTypeObj = messTypeObj;
                    g.push(newObj);

                }
                setTimeout(function(){
                    _this.setData({
                        listObj: g,
                        messTypeObj: messTypeObj,
                        capNum: capNum,
                        bitBuy: bitBuy
                    })
                },400)
            }
        })
    }
})
