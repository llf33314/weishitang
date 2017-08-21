//app.js
App({
    data: {
        appid:'',
        secret:'9136c9a6ee9034bc01fb923796649424',
        isTestNumberOpenId:'oc9YJ0c65-L0PuSITJGF2jK27Txo',
    },
    layerMsg: function(tips) { //弹出框
        wx.showModal({
            title: '温馨提示',
            content: tips,
            showCancel: false,
            confirmText: '我知道了',
            success: function(res) {
                if (res.confirm) {
                    return;
                }
            }
        })
    },
    isContains:function(str, substr) { //是否包含
            return new RegExp(substr).test(str);
    },
    layerFail: function(tips) {
        wx.showToast({
            title: tips,
            icon: 'success',
            duration: 2000
        })
    },
    domainName: '',
    //domainName: 'http://yifriend.net',
    //domainName: 'http://192.168.3.44:8080',
    onLaunch: function() {
        //调用API从本地缓存中获取数据
        wx.getUserInfo({
          success:function(res){

          },
          fail:function(res){
            console.log('拒绝....')
            wx.showLoading({
              title: '退出请重新授权',
            })
          }
        })
        var logs = wx.getStorageSync('logs') || []
        logs.unshift(Date.now())
        wx.setStorageSync('logs', logs);
        var that  =this;
        wx.getExtConfig({
		      success: function (res) {
            console.log(res)
		        console.log(res.extConfig)
		        that.domainName =  res.extConfig.domain;
            that.appid = res.extConfig.appid;
		        // that.setData({
		        // 	appid:res.extConfig.appid
		        // })
		      }
	    })
    },
    layerMsgCallBack:function(tips,fn){
        wx.showModal({
            title: '温馨提示',
            content: tips,
            showCancel: false,
            confirmText: '我知道了',
            success: function(res) {
                if (res.confirm) {
                    fn();
                }
            }
        })
    },
    layerMsgCallBack2:function(tips,fn){
        wx.showModal({
            title: '温馨提示',
            content: tips,
            showCancel: false,
            confirmText: '选择类型',
            success: function(res) {
                if (res.confirm) {
                    fn();
                }
            }
        })
    },layerNoticeMsg:function(tips){
         wx.showModal({
            title: '公告',
            content: tips,
            showCancel: false,
            confirmText: '我知道了',
            success: function(res) {
                if (res.confirm) {
                    fn();
                }
            }
        })
    },
    getUserInfo: function(cb) {
        var that = this
        console.log('666666'+this.globalData.userInfo)
        if (this.globalData.userInfo) {
            typeof cb == "function" && cb(this.globalData.userInfo)
        } else {
            //调用登录接口
            wx.login({
                success: function(res) {
                  console.log(res)
                    wx.getUserInfo({
                        success: function(res) {
                          console.log(res)
                            that.globalData.userInfo = res.userInfo
                            typeof cb == "function" && cb(that.globalData.userInfo)
                        }
                    })
                },
                fail:function(){
                  app.layerMsg('请重新授权！')
                },
                complete:function(res){
                  console.log(res)
                }
            })
        }
    },
    globalData: {
        userInfo: null
    },
    getHeadMsg: function(that,_this) {
    	
        wx.request({
            url:that.domainName + '/messSmallRoutine/'+that.mainId+'/'+that.memberId+'/79B4DE7C/head.do',
            type:'GET',
            success:function(res){
                console.log('getHeadMsg');
                console.log(res.data);
                const d = res.data;
                const headMsg = {
                    headimgurl:d.member.headimgurl,
                    cardCode:d.messCard.cardCode,
                    nickname:d.member.nickname,
                    breakfastNum:d.messCard.breakfastNum,
                    lunchNum:d.messCard.lunchNum,
                    dinnerNum:d.messCard.dinnerNum,
                    nightNum:d.messCard.nightNum,
                    bitUniversal:d.messBasisSet.bitUniversal,
                    money:d.messCard.money,
                    noticeMsg:d.messNotices[0].notice,
                    domainName:that.domainName,
                    universalNum:d.messCard.universalNum
                }
                _this.setData({
                    headMsg:headMsg

                })
            }

        })
    }
})
