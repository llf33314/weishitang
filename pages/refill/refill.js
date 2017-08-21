var app = getApp()
Page({
    data: {
        focus: false,
        inputValue: '',
    },
    bindKeyInput: function(e) {
        this.setData({
            inputValue: e.detail.value
        })
    },
    
    refillSubmit: function(e) {
        var money = this.data.inputValue;
        console.log("money================="+money)
        if (money == '' || money <= 0) {
            app.layerMsg('充值金额不能为0');
        } else {
            // var url_ = app.domainName + '/messSmallRoutine/79B4DE7C/topUpPay.do';
            console.log("app.data.appid================="+app.data.appid)
            
            var bean = {
                "mainId": app.mainId,
                "cardId": app.cardId,
                "money": money,
                "memberId":app.memberId,
                "appid":app.data.appid               
                // "url":url_
            }
            
            // console.log("url_================="+url_)
            wx.request({
                url: app.domainName + '/messSmallRoutine/79B4DE7C/topUpPay.do', //仅为示例，并非真实的接口地址
                data: bean,
                type: 'POST',
                success: function(res) {    
                    console.log(res)                
                    var status = res.data.status;
                    var orderNo = res.data.orderNo;
                    var detailId = res.data.detailId;     
                    // var prepay_id =''+res.data.prepay_id.replace(/prepay_id=/, "");
                    console.log("orderNo========"+orderNo)  
                    if(orderNo != null){
                        console.log("orderNo========"+orderNo)
                        wx.requestPayment({
                        'timeStamp': res.data.timeStamp,
                        'nonceStr': res.data.nonceStr,
                        'package': res.data.prepay_id,
                        'signType': 'MD5',
                        'paySign': res.data.paySign,
                        'success':function(res2){
                        console.log(res2)                        
                                if(res2.errMsg == "requestPayment:ok" ) {
                                    var bean3 = {
                                        "detailId": detailId,
                                        "orderNo": orderNo
                                    }
                                    console.log("=====================")
                                    wx.request({
                                        url: app.domainName + '/messSmallRoutine/79B4DE7C/wxMessPayOrder.do', //仅为示例，并非真实的接口地址
                                        data: bean3,
                                        type: 'POST',
                                        success: function(res3) {
                                            console.log(res3)
                                            if(res3.data.status == 'success'){
                                                app.layerMsg('充值成功！');
                                                wx.navigateBack({
                                                    delta: 2
                                                })
                                            }else{
                                                app.layerMsg('充值失败！');
                                            }                                            
                                        }});
                                    
                                } else if(res2.errMsg != "requestPayment:ok" ){
                                    //关闭微信浏览器
                                    // WeixinJSBridge.call('closeWindow');
                                    app.layerMsg('充值失败！');
                                }
                        },
                        'fail':function(res5){
                            console.log("fail");
                           console.log(res5)
                        }
                        })
// console.log(res.data.timeStamp)
// console.log(res.data.nonceStr)
// console.log(res.data.prepay_id)
// console.log(res.data.paySign)
// var timeStamp =''+res.data.timeStamp;
// var nonceStr =''+res.data.nonceStr;
// var prepay_id =''+res.data.prepay_id.replace(/prepay_id=/, "");
// var paySign =''+res.data.paySign;
// console.log(prepay_id)

//                         wx.requestPayment({
//                             timestamp: timeStamp, // 支付签名时间戳，注意微信jssdk中的所有使用timestamp字段均为小写。但最新版的支付后台生成签名使用的timeStamp字段名需大写其中的S字符
//                             nonceStr: nonceStr, // 支付签名随机串，不长于 32 位
//                             package: prepay_id, // 统一支付接口返回的prepay_id参数值，提交格式如：prepay_id=***）
//                             signType: "MD5", // 签名方式，默认为'SHA1'，使用新版支付需传入'MD5'
//                             paySign: paySign, // 支付签名
//                             success:function (res2) {
//                                 console.log(res2)
//                                 // 支付成功后的回调函数
//                                 if(res2.errMsg == "chooseWXPay:ok" ) {
//                                     var bean3 = {
//                                         "detailId": detailId,
//                                         "orderNo": orderNo
//                                     }
//                                     wx.request({
//                                         url: app.domainName + '/messSmallRoutine/79B4DE7C/wxMessPayOrder.do', //仅为示例，并非真实的接口地址
//                                         data: bean3,
//                                         type: 'POST',
//                                         success: function(res3) {
//                                             if(res3.data.status == 'success'){
//                                                 app.layerMsg('充值成功！');
//                                                 wx.redirectTo({
//                                                     url: '../index/index'
//                                                 })
//                                             }else{
//                                                 app.layerMsg('充值失败！');
//                                             }                                            
//                                         }});
                                    
//                                 } else if(res2.errMsg == "chooseWXPay:cancel" ){
//                                     //关闭微信浏览器
//                                     // WeixinJSBridge.call('closeWindow');
//                                     app.layerMsg('充值失败！');
//                                 }
//                             },
//                             'fail':function(res){}
//                         });

//                     }else{
//                         app.layerMsg('充值失败');
                    }           
                }
            })
        }
    },
    onLoad: function() {
        const messCard = app.messCard;
        this.setData({
            money: messCard.money,
        })
    },
    onShow:function(options){
        const messCard = app.messCard;
        this.setData({
            money: messCard.money,
        })
    }
})
