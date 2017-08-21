var app = getApp()
Page({
    data: {
        messNumber: [0, 0, 0, 0, 0],
        num: 0,
        total: 0,
        totalNum: 0,
        flag: true
    },
   
    addMessTicket: function(e) { //选择饭票
        var mealCode = e.target.dataset.type; //订餐类型
        var method = e.target.dataset.method;
        var _data = this.data;
        var grounp = _data.messNumber;
        var _this = this;
        var judgment = function(g, n, method, _this) {
            var _num = g[n];
            if (method == 'minus')
                _num--;
            else
                _num++;
            if (_num < 0) return
            g[n] = _num;
            _this.setData({
                messNumber: grounp
            })
        }
        
        switch (mealCode) {
            case '0':
                judgment(grounp, 0, method, _this);
                break;
            case '1':
                judgment(grounp, 1, method, _this);
                break;
            case '2':
                judgment(grounp, 2, method, _this);
                break;
            case '3':
                judgment(grounp, 3, method, _this);
                break;
            case '4':
                judgment(grounp, 4, method, _this);
                break;
            default:
                return
        }
        var newGtype = _data.messNumber;
        var priceG = _data.priceGroup;
        var total = 0;
        var totalNum = 0;
        for (var i = 0, l = newGtype.length; i < l; i++) {
            if(newGtype[i] != '' && priceG[i] != ''){
                total += newGtype[i] * priceG[i];
                totalNum += newGtype[i];    

            }
        }
        this.setData({
            total: total.toFixed(2),
            totalNum: totalNum
        })
    },
    submitTicket: function() {
        var _this = this;
        if (this.data.flag) {
            var _data = _this.data;
            var _messNumber = _data.messNumber;
            var totalNum = _data.totalNum;
            if (totalNum == 0) {
                app.layerMsg('购票数量不能为0');
                return
            }
            var bean = {
                "mainId": app.mainId,
                "cardId": app.cardId,
                "breakfastNum": _messNumber[0],
                "lunchNum": _messNumber[1],
                "dinnerNum": _messNumber[2],
                "nightNum": _messNumber[3],
                "universalNum": _messNumber[4],
                "memberId":app.memberId
            }
            wx.request({
                url: app.domainName + '/messSmallRoutine/79B4DE7C/buyTicket.do', //仅为示例，并非真实的接口地址
                data: bean,
                type: 'POST',
                success: function(res) {
                    var status = res.data.status;
                    _this.setData({
                        flag: false
                    });
                    switch (status) {
                        case 'success':
                            wx.showModal({
                                title: '温馨提示',
                                content: '已购买了' + totalNum + '张饭票！',
                                showCancel: false,
                                confirmText: '我知道了',
                                success: function(res) {
                                    if (res.confirm) {                                        
                                        wx.navigateBack({
                                            delta: 2
                                        })
                                    }
                                }
                            })
                            break;
                        case 'error1':
                            app.layerMsg('购票数量不能为0');
                            break;
                        case 'error2':
                            app.layerMsg('余额不足,请充值');
                            break;
                        default:
                            app.layerMsg('余额不足,请充值');
                    }
                }
            })
        } else {
            app.layerMsg('充值进行中....');
            setTimeout(function() {
                _this.setData({
                    flag: true
                });
            }, 3000)
        }

    },
    onLoad: function() {
        const messBasisSet = app.messBasisSet;
        const messCard = app.messCard;
        const messType = messBasisSet.messType;
        var isContains = function(str, substr) {
            return new RegExp(substr).test(str);
        };
        console.log(messBasisSet);
        this.setData({
            money: messCard.money,
            bitUniversal: messBasisSet.bitUniversal, //0显示通用饭票 1显示其它
            breakfast: isContains(messType, 0),
            lunch: isContains(messType, 1),
            dinner: isContains(messType, 2),
            night: isContains(messType, 3),
            priceGroup: [messBasisSet.breakfastPrice, messBasisSet.lunchPrice, messBasisSet.dinnerPrice, messBasisSet.nightPrice, messBasisSet.universalPrice, ]
        })
    }

})
