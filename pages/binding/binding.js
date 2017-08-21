var app = getApp()
Page({
    data: {
        hidden: true,
    },
    onShareAppMessage: function() {
        return {
            title: '微食堂',
            desc: '微食堂',
            path: '/pages/index/index'
        }
    },
    linkNewXcx: function () {
        wx.navigateToMiniProgram({
            appId: 'wxc71d3e2f77e4109f',
            path: '',
            extraData: {
                foo: 'bar'
            },
            envVersion: 'develop',
            success: function (res) {
                // 打开成功
            }
        })
    },
    formSubmit: function(e) {
        var cardNumber = e.detail.value.number; //输入的卡号
        if(cardNumber == '8888'){
            console.log(cardNumber)
            app.data.isTestNumberFlag = true;
            
             wx.redirectTo({
                url: '../index/index'
            })
            return;
        }
        const bean = {
            "cardCode": cardNumber,
            "openId": app.openId,
            //"memberId": app.memberId
        }
        if(cardNumber.length == 0 || cardNumber.length >  30){
            wx.showModal({
                title: '温馨提示',
                content: '请输入就餐卡号',
                showCancel: false,
                confirmText: '我知道了',
                success: function(res) {
                    if (res.confirm) {
                        return;
                    }
                }
            })
            return;
        }
        debugger
        
        wx.request({
            url: app.domainName + '/messSmallRoutine/79B4DE7C/bindingCard.do',
            type: 'POST',
            data: bean,
            success: function(res) {
              console.log(res);
                if (res.data.status == 'success') { //绑定成功
                  debugger;
                    app.isBind = true;
                    wx.showToast({
                        title: '绑定成功',
                        icon: 'success',
                        duration: 2000,
                        success: function(res) {
                            wx.redirectTo({
                                url: '../index/index'
                            })
                        }
                    })
                } else if (res.data.status == 'error2') {
                   wx.showModal({
                        title: '温馨提示',
                        content: '未找到饭票卡信息！ 请联系饭堂进行登记。',
                        showCancel: false,
                        confirmText: '我知道了',
                        success: function(res) {
                            if (res.confirm) {
                                return;
                            }
                        }
                    })
                } else { //绑定失败
                 wx.showModal({
                        title: '温馨提示',
                        content: '请到公众号下绑定饭卡后，再次绑定！',
                        showCancel: false,
                        confirmText: '我知道了',
                        success: function(res) {
                            if (res.confirm) {
                                wx.redirectTo({
                                url: '../index/index'
                                })
                            }
                        }
                    })

                    
                }
            }
        })
    },
    onReady:function(){
         wx.setNavigationBarTitle({
            title: '当前页面'
        })
    },
    onLoad: function() {
       
        if(app.isBind){
            wx.redirectTo({
                url: '../index/index'
                })
        }
        this.setData({
            domainName: app.domainName
        })
    },
    onShow:function(){
         if(app.isBind){
            wx.redirectTo({
                url: '../index/index'
                })
        }
    }
   
})

function reloadz(that) {
    wx.login({ //login流程
        success: function(res) { //登录成功
            if (res.code) {
                var code = res.code;
                wx.getUserInfo({ //getUserInfo流程
                    success: function(res2) { //获取userinfo成功
                        var encryptedData = encodeURIComponent(res2.encryptedData); //一定要把加密串转成URI编码
                        var iv = res2.iv;
                        //请求自己的服务器
                        Login(code, encryptedData, iv, that);
                    }
                })
            } else {
                app.layerMsg('获取用户登录态失败！')
            }
        },
        fail: function() {
            
        }
    });
}

function Login(code, encryptedData, iv, that) {
    wx.showToast({
        title: '正在登录...',
        icon: 'loading',
        duration: 10000
    });
    wx.request({
        url: app.domainName + '/messSmallRoutine/79B4DE7C/login.do?v=' + Date.parse(new Date()),
        data: {
            code: code,
            encryptedData: encryptedData,
            iv: iv
        },
        method: 'GET',
        header: {
            'content-type': 'application/json'
        },
        success: function(res) {
            wx.hideToast();
            index(res.data.openid, that);
        },
        fail: function() {

        },
        complete: function() {

        }
    })
}

function index(openId2, that) {
    wx.request({
        url: app.domainName + '/messSmallRoutine/' + openId2 + '/79B4DE7C/index.do',
        method: 'GET',
        success: function(res) {
            var getData = res.data;
            if (getData.IsSkip == 0) { //未绑定饭卡
                app.openId = openId2;
                // wx.navigateTo({
                //     url: '../binding/binding?openId=' + openId2
                // });
                return;
            }
            var messNotices = res.data.messNotices; //是否有公告
            var notice = [];
            if (getData.nums2 > 0) { //有过期饭票
                notice[0] = '您有' + getData.nums2 + '张饭票即将过期,请尽快使用。';
                if (messNotices.length != 0) { //有公告
                    notice[1] = messNotices[0]
                }
            } else { //没有过期饭票
                if (messNotices.length != 0) { //有公告
                    notice[0] = messNotices[0]
                } else { //没有公告
                    notice[0] = '暂无公告';
                }
            }
            app.mainId = getData.mainId; //全局
            app.memberId = getData.member.id; //全局
            app.cardId = getData.cardId; //全局
            app.messBasisSet = getData.messBasisSet; //全局
            app.messCard = getData.messCard; //全局
            wx.navigateTo({
                url: '../index/index'
            });
        },
        fail: function() {
            app.layerMsg('网络连接失败！');
        },
        complete: function() {
            
        }
    })
}
