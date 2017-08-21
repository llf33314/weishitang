var app = getApp();
function addMeal(list,id,that){ //加餐
    console.log(list)

    wx.request({
        url:app.domainName  +'/messSmallRoutine/79B4DE7C/saveOrUpdateAddOrder.do',
        data:list,
        success:function(res){
            console.log(res);
            var data =res.data;
            if (data.status == 'success') {
                console.log('追加订餐成功');
                var oids =  that.data.oids;
                console.log(oids)
                if(!oids.bnum){
                	oids.bnum = 1
                }
                if(!oids.lnum){
                	oids.lnum = 1
                }
                if(!oids.dnum){
                	oids.dnum = 1
                }
                if(!oids.nnum){
                	oids.nnum = 1
                }
                switch(list.mealType){
                    case '0':
                        oids.bnum ++ ;
                        break;
                    case '1':
                        oids.lnum ++ ;
                        break;
                    case '2':
                        oids.dnum ++ ;
                        break;
                    case '4':
                        oids.nnum ++ ;
                        break;
                }
                that.setData({
                    toast2Hidden:false,
                    oids:oids,
                    editState:'追加订餐成功!'
                })
            } else if (data.status == 'error2') {
                console.log('已超过预定时间！');
                that.setData({
                	modalHidden2:false,
                    errorState:'已超过预定时间！'
                })
        
            } else {
                console.log('追加订餐失败');
                that.setData({
                	modalHidden2:false,
                    errorState:'追加订餐失败'
                })
            
            }
        }
    })
}
function cancleMeal(list,id,that){ //取消订单
    wx.request({
        url:app.domainName  +'/messSmallRoutine/'+list.mainId+'/'+id+'/79B4DE7C/cancelOrder.do',
        type: 'get',
        success:function(res){
            console.log(res);
            console.log(list)
            console.log(that.data.mealType)
            
             var data =res.data;
             if (data.status == 'success') {
               console.log('取消订单成功');
               var types = that.data.messTypeObj;
               switch(list.mealType){
	               	case '0':
	               		types.breakfast =false;
	               		break;
	               	case '1':
	               		types.lunch =false;
	               		break;
	               	case '2':
	               		types.dinner =false;
	               		break;
	               	case '3':
	               		types.night =false;
	               		break;
	               	default: 
	               		return;
               }
               that.setData({
                   toast2Hidden:false,
                   messTypeObj:types,
                   editState:'取消订单成功!',
               })
            } else {
                console.log('取消订单失败')
                that.setData({
                	modalHidden2:false,
                    errorState:'取消订单失败!'
                })
            }
        }
    })
}
Page({
    data:{
    	toast2Hidden:true,
    	modalHidden2:true,
        editMealChangeHidden:true
    },
    
    modalChange2z:function(){
    	this.setData({
    		modalHidden2:true
    	})
    },
     returnHome:function(){ //返回首页
         wx.navigateTo({
            url: '../index/index'
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
    orderMeal:function(e){
        var that=this,
            list=that.data.e,
            d=e.currentTarget.dataset,
            t=d.type,
            id=d.id,
            nowNum = d.nownum,
            meal='';
            
            var capNum = app.messBasisSet.capNum;
            if(nowNum >= capNum && capNum != 0){
               that.setData({
                	modalHidden2:false,
                    errorState:'已超过预定份数！'
                })
                return;
            }
        switch(t){
            case '0':
                meal = '早餐';
                break;
            case '1':
                meal = '午餐';
                break;
             case '2':
                meal = '晚餐';
                break;
             case '3':
                meal = '宵夜餐';
                break;
            default:
                return
        };
//        if(id){
//            list.saveType = 'update';
//            list.id = id;
//        }else{
//            list.saveType = 'save';
//            list.id = '';
//        }
        
        list.mealType = t;
        if(list.type== '1'){ //取消订单
            var content =  '是否要取消'+meal+'？';
            var fn = cancleMeal;
            list.id = id;
        }else{ //加餐
            var content = '是否要追加'+meal+'份数 × 1？';
            var fn = addMeal;
            if(id){
                list.saveType = 'update';
                list.id = id;
            }else{
                list.saveType = 'save';
                list.id = '';
            }
        }
        console.log(list)
        wx.showModal({
            title: '温馨提示',
            content: content,
            showCancel: true,
            cancelText: '否',
            confirmText: '是',
            success: function(res) {
                if(res.confirm){ //确定
                    console.log(list);
                    fn(list,id,that)
                }
            }
        })
    },
    toast2Change:function(){
         this.setData({
            toast2Hidden:true
        })
    },
    editMealChange:function(){
        this.setData({
            editMealChangeHidden: !this.data.editMealChangeHidden,
        })
    },
    onLoad:function(e){
        const that =this;
        
        if(e.type == 1){  //取消订单
             wx.setNavigationBarTitle({
                title: '取消订单'
            })
        }else{
            wx.setNavigationBarTitle({
                title: '追加订单'
            })
        }
        app.getHeadMsg(app,this);
       wx.request({
           url:app.domainName+'/messSmallRoutine/79B4DE7C/addOrder.do',
           data:e,
           type:'GET',
           success:function(res){
              
              var d = res.data;
              var p = d.param;
              var m = d.messBasisSet;
              var time = p.time;
              var messTypeObj = {
                    breakfast: app.isContains(m.messType, 0),
                    lunch: app.isContains(m.messType, 1),
                    dinner: app.isContains(m.messType, 2),
                    night: app.isContains(m.messType, 3),
               }
               
               var md = d.messMealOrders;
               var oids={};
                for(let i=0;i<md.length;i++){
                    if(md[i].mealType == '0'){
                        oids.bid=md[i].id; 
                        oids.bnum=md[i].mealNum; 
                    }
                    if(md[i].mealType == '1'){
                        oids.lid=md[i].id;
                        oids.lnum=md[i].mealNum; 
                    }
                    if(md[i].mealType == '2'){
                        oids.did=md[i].id;
                        oids.dnum=md[i].mealNum; 
                    }
                    if(md[i].mealType == '3'){
                        oids.nid=md[i].id;
                        oids.nnum=md[i].mealNum; 
                    }
                }
            

              that.setData({
                  time:time,
                  messTypeObj:messTypeObj,
                  type:e.type,
                  oids:oids,
                  e:e
              })
           }
       })
    },
    onShow:function(){
        const that =this;
        app.getHeadMsg(app,this);
//        wx.request({
//            url:app.domainName+'/messSmallRoutine/'+app.cardId+'/79B4DE7C/addFood.do',
//            type:'GET',
//            success:function(res){
//                const d = res.data.messAddFoods;
//                console.log(d);
//                that.setData({
//                    messAddFoods:d,
//                })
//            }
//        })
    }
})
