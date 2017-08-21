var app = getApp();
Page({
    data:{
        showPopup:false
    },
    addMeal:function(e){
            const id=e.currentTarget.dataset.id;
            this.setData({
                addMealImg:app.domainName + '/messSmallRoutine/'+app.mainId+'/'+id+'/'+app.memberId+'/79B4DE7C/getAddFoodQRcode.do',
                showPopup:true
            })
    },
    addMealFinish:function(){
        this.setData({
            showPopup:false
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
    onLoad:function(e){
        const that =this;
       
        app.getHeadMsg(app,this);
        wx.request({
            url:app.domainName+'/messSmallRoutine/'+app.cardId+'/79B4DE7C/addFood.do',
            type:'GET',
            success:function(res){
                const d = res.data.messAddFoods;
                console.log(d);
                that.setData({
                    messAddFoods:d,
                })
            }
        })
    },
    onShow:function(){
        const that =this;
        app.getHeadMsg(app,this);
        wx.request({
            url:app.domainName+'/messSmallRoutine/'+app.cardId+'/79B4DE7C/addFood.do',
            type:'GET',
            success:function(res){
                const d = res.data.messAddFoods;
                console.log(d);
                that.setData({
                    messAddFoods:d,
                })
            }
        })
    }
})
