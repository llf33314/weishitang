//index.js
//获取应用实例

var app = getApp();

function checkOpenid() {
    if (app.openId == undefined) {
        app.layerMsg('请重新授权');
        return;
    }
}
Page({
    data: {
        showPopup:false
    },
    onPullDownRefresh: function(){
         wx.reLaunch({
            url: '../index/index'
        })
    },
     closeLayer:function(){ //关闭提示框
        this.setData({
                layerState:false,
                layerOneState:false
            })
    },
    onShareAppMessage: function() {
        return {
            title: '微食堂',
            desc: '微食堂',
            path: '/pages/index/index'
        }
    },
    //事件处理函数
    bindViewTap: function() {
        if (app.memberId == undefined) {
            app.layerMsg('请重新授权');
        } else {
            wx.navigateTo({
                url: '../logs/logs'
            })
        }
    },
    getLayer:function(){
        wx.navigateTo({
                url: '../layer/layer'
            })
    },
    showNoticeMsg: function() { //点击显示公告信息
        if (app.memberId == undefined) {
            app.layerMsg('请重新授权');
        } else {
            var msg = this.data.headMsg.noticeMsg;
            if (msg == '暂无公告') {
                return;
            }
            app.layerNoticeMsg(msg);
        }
    },
    //订餐跳转
    linkReservation: function() {
        if (app.memberId == undefined) {
            app.layerMsg('请重新授权');
        } else {
            wx.navigateTo({
                url: '../reservation/reservation'
            })
        }
    },
    //每周菜单
    linkWeekyMenu: function() {
        if (app.memberId == undefined) {
            app.layerMsg('请重新授权');
        } else {
            wx.navigateTo({
                url: '../weeklyMenu/weeklyMenu?week=1&mealType=0'
            })
        }

    },
    addMeal: function() {
        if (app.memberId == undefined) {
            app.layerMsg('请重新授权');
        } else {
            wx.navigateTo({
                url: '../addMeal/addMeal'
            })
        }
    },
    //我的
    linkMy: function() {
        if (app.memberId == undefined) {
            app.layerMsg('请重新授权');
        } else {
            wx.navigateTo({
                url: '../my/my'
            })
        }
    },
    buyTickets: function() {
        if (app.memberId == undefined) {
            app.layerMsg('请重新授权');
        } else {
            wx.navigateTo({
                url: '../buyTickets/buyTickets'
            })
        }
    },
    //余额充值
    linkrefill: function() {
        if (app.memberId == undefined) {
            app.layerMsg('请重新授权');
        } else {
            // app.layerMsg('敬请期待...')
            wx.navigateTo({
                url: '../refill/refill'
            })
        }
    },
    addMealFinish:function(){
            this.setData({
                showPopup:false
            })
    },
    //取餐码
    getMealCode: function(e) {
        var _this = this;
        if (app.memberId == undefined) {
            app.layerMsg('请重新授权');
        } else {
            const _this = this;
            const mainId = _this.data.mainId;
            const cardId = _this.data.cardId;
            const mealCode = e.target.dataset.mealcode;
            console.log("===========mealCode："+mealCode)
            if (mealCode == '-1') {
                 app.layerMsg('现时间段无订餐！');
            } else {
                wx.request({
                    url: app.domainName + '/messSmallRoutine/' + mainId + '/' + cardId + '/' + mealCode + '/79B4DE7C/verify.do',
                    method: 'GET',
                    success: function(res) {
                        
                        var getData = res.data;   
                        console.log(getData)                     
                        if (getData.status == 'success') {
                            if (getData.nums > 0) {
                                app.layerMsg('您有' + getData.nums + '张饭票已过期,已自动使用一张饭票重新订餐,请到消费明细查询');
                                return;
                            }
                            if (mealCode != -1) {
                                
                                //显示二维码
                                _this.setData({
                                    showPopup:true,
                                    addMealImg:app.domainName + '/messSmallRoutine/'+app.mainId+'/'+app.cardId+'/'+mealCode+'/79B4DE7C/getMessUrltoQRcode.do',
                                    mealCode:mealCode
                                })
                            } else {
                                app.layerMsg('现时间段无订餐！');
                            }

                        } else if (getData.status == 'error1') {
                            app.layerMsg('您的订餐中有饭票过期,且饭票余额扣费失败,请购票！');
                          
                        } else {
                            app.layerMsg('取餐失败！');
                        }
                    },
                    fail: function() {
                        app.layerMsg('网络连接失败！');
                    },
                    complete: function() {

                    }
                })
            }
        }
    },
    onLoad: function() {
        var that = this;
      
        if(app.data.isTestNumberFlag){
            index(app.data.isTestNumberOpenId, this)
        }else{
            var openId = '';
            wx.login({ //login流程
                success: function(res) { //登录成功
                  console.log(res)
                    if (res.code) {
                        var code = res.code;
                        wx.getUserInfo({ //getUserInfo流程
                            success: function(res2) { //获取userinfo成功                           
                                //请求自己的服务器
                                Login(code, that);
                            }
                        })
                    } else {
                        app.layerMsg('获取用户登录态失败！')
                    }
                }
            });
            }
    },
    onShow: function() {
        var that = this;
        var openId = '';
       
        if(app.data.isTestNumberFlag){
            index(app.data.isTestNumberOpenId, this)
            return
        }
        wx.login({ //login流程
            success: function(res) { //登录成功
                if (res.code) {
                    var code = res.code;
                    wx.getUserInfo({ //getUserInfo流程
                        success: function(res2) { //获取userinfo成功
                            //请求自己的服务器
                            Login(code,that);
                        }
                    })
                } else {
                    app.layerMsg('获取用户登录态失败！')
                }
            }
        });
    }
})

function Login(code,that) {
	if(!that.data.mainId){
	    wx.showToast({
	        title: '正在登录...',
	        icon: 'loading',
	        duration: 10000
	    });
	}

    // var loginUrl = 'https://api.weixin.qq.com/sns/jscode2session?appid='+app.data.appid+'&secret='+app.data.secret+'&js_code='+code+'&grant_type=authorization_code';
    wx.request({
      url: app.domainName + '/messSmallRoutine/79B4DE7C/app_login.do?v=' + Date.parse(new Date()),   
        data: {
          appid: app.appid,
          js_code: code
        },
        method: 'GET',
        header: {
            'content-type': 'application/json'
        },
        success: function(res) {
            wx.hideToast();
            console.log('res.data.openid+++'+res.data.openid)
            index(res.data.openid, that);
        },
        fail: function() {
          app.layerMsg('获取用户openid失败！')
        },
        complete: function() {

        }
    })
}

function index(openId2, that) {
    console.log(openId2);
    if(openId2 == undefined){
      app.layerMsg('请重新授权！')
      return;
    }
   
    wx.request({
        url: app.domainName + '/messSmallRoutine/' + openId2 + '/79B4DE7C/index.do',
        method: 'GET',
        success: function(res) {
            var getData = res.data;
            if (getData.IsSkip == 0) { //绑定饭卡
                app.openId = openId2;
                wx.redirectTo({
                    url: '../binding/binding?openId=' + openId2
                });
                return
            }
            var messNotices = res.data.messNotices; //是否有公告
            var notice = [];
            
            if (getData.nums2 > 0) { //有过期饭票              
                //app.layerMsg('您有' + getData.nums2 + '张饭票即将过期,请尽快使用。');
                that.setData({
                        layerOneState:true,
                        layerTitle:'温馨提示',
                        layerTips:'网络连接失败！',
                        layerCloseBtn:'我知道了',
                    })
                notice[0] = '您有' + getData.nums2 + '张饭票即将过期,请尽快使用。';
                if(messNotices){
                    if (messNotices.length != 0) { //有公告
                     notice[1] = messNotices[0].notice
                    }
                }
            } else { //没有过期饭票
                if( messNotices){
                    if (messNotices.length != 0) { //有公告
                        notice[0] = messNotices[0].notice
                    } else { //没有公告
                        notice[0] = '暂无公告';
                    }
                }
            }
            app.mainId = getData.mainId; //全局
            app.memberId = getData.member.id; //全局
            app.cardId = getData.cardId; //全局
            app.messBasisSet = getData.messBasisSet; //全局
            app.messCard = getData.messCard; //全局
            console.log(getData.messBasisSet)
            const headMsg = {
                headimgurl: getData.member.headimgurl,
                cardCode: getData.messCard.cardCode,
                nickname: getData.member.nickname,
                breakfastNum: getData.messCard.breakfastNum,
                lunchNum: getData.messCard.lunchNum,
                dinnerNum: getData.messCard.dinnerNum,
                nightNum: getData.messCard.nightNum,
                bitUniversal: getData.messBasisSet.bitUniversal,
                money: getData.messCard.money,
                noticeMsg: notice[0],
                domainName: app.domainName,
                universalNum:getData.messCard.universalNum,
            }
            console.log(headMsg)
            that.setData({
                userInfo: getData.member,
                messCard: getData.messCard,
                messBasisSet: getData.messBasisSet,
                noticeMsg: notice, //公告信息
                mealCodeState: getData.mealCode,
                mainId: getData.mainId,
                cardId: getData.cardId,
                domainName: app.domainName,
                headMsg: headMsg

            })
        },
        fail: function() {
            app.layerMsg('网络连接失败！');
        },
        complete: function() {

        }
    })
}
