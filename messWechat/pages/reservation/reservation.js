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
const getFirstDayWeek = function(_year, _month, _day) {
    var seperator1 = "/";
    var currentdate = _year + seperator1 + _month + seperator1 + _day;
    var monthFirstDayWeek = new Date(currentdate).getDay(); //每个月01号的星期
    var weeksGrounp = [];
    switch (monthFirstDayWeek) {
        case 0:
            weeksGrounp = []
            break;
        case 1:
            weeksGrounp = [0]
            break;
        case 2:
            weeksGrounp = [0, 1]
            break;
        case 3:
            weeksGrounp = [0, 1, 2]
            break;
        case 4:
            weeksGrounp = [0, 1, 2, 3]
            break;
        case 5:
            weeksGrounp = [0, 1, 2, 3, 4]
            break;
        case 6:
            weeksGrounp = [0, 1, 2, 3, 4, 5]
            break;
        default:

    }
    return weeksGrounp;
}
const DayNumOfMonth = function(year, mouth) { //获取当前月份的天数
    var date = new Date();
    var year = year;
    var mouth = mouth;
    var days;
    if (mouth == 2) {
        days = year % 4 == 0 ? 29 : 28;
    } else if (mouth == 1 || mouth == 3 || mouth == 5 || mouth == 7 || mouth == 8 || mouth == 10 || mouth == 12) {
        days = 31;
    } else {
        days = 30;
    }
    return days;
}
const getNowFormatDate = function() {
    var date = new Date();
    var seperator1 = "-";
    var seperator2 = ":";
    var obj = {};
    var month = date.getMonth() + 1;
    var strDate = date.getDate();
    if (month >= 1 && month <= 9) {
        month = "0" + month;
    }
    if (strDate >= 0 && strDate <= 9) {
        strDate = "0" + strDate;
    }
    var currentdate = date.getFullYear() + seperator1 + month + seperator1 + strDate;
    obj.currentdate = currentdate;
    obj.strDate = strDate;
    obj.month = month;
    return obj;
}
const selectTimeSlot = function() {
    const g = [{
        name: 'thisMonth',
        value: '本月',
    }, ]
    return g;
};

var app = getApp();

const getMonthData = function(t) {
    var _this = t;
    var _t = _this.data;
    var y = _t.year;
    var m = _t.month;
    wx.request({
        url: app.domainName + '/messSmallRoutine/' + app.cardId + '/' + y + '/' + m + '/79B4DE7C/calendar.do',
        method: 'GET',
        success: function(res) {
            const d = res.data.orederDays;
            _this.setData({
                dayWeek: getFirstDayWeek(y, m, '01'),
                listObj: d,
                selectTimeSlot: selectTimeSlot()
            })
        }
    })
};

Page({
    data: {
        month: new Date().getMonth() + 1,
        year: new Date().getFullYear(),
        dayWeek: [],
        selectTimeSlot: selectTimeSlot(),
        getThisMonth: new Date().getMonth() + 1,
        isThisMonth: true,
        flag: false,
        actionSheetHidden: true,
        editMealChangeHidden:true,
        loadHidden:false,
        submitFlag:2
    },
    
    showNoticeMsg: function() { //点击显示公告信息
        var msg = this.data.headMsg.noticeMsg;
        if (msg == '暂无公告') {
            return;
        }
        app.layerNoticeMsg(msg);
    },
    addMeal:function(e){ //打开加餐
        var dayz = e.currentTarget.dataset.day;
        var year = this.data.year;
        var month = this.data.month;
        if (month >= 1 && month <= 9) {
            month = "0" + month;
        }
        var orderDay = year + '-'+ month  + '-' + dayz;
        var today = new Date(Date.parse(new Date())).pattern("yyyy-MM-d");
        var hiddenDeleteOrder = false;
        
        if(orderDay == today ){ //等于今天隐藏取消订单栏
            hiddenDeleteOrder = true;
        }
    	this.setData({
    	      actionSheetHidden: !this.data.actionSheetHidden,
    	      day:dayz,
              hiddenDeleteOrder:hiddenDeleteOrder
    	 })
    },
    addMealChange: function(e) { //加餐状态改变
        this.setData({
            actionSheetHidden: !this.data.actionSheetHidden,
        })
    },
    editMealChange:function(){
        this.setData({
            editMealChangeHidden: !this.data.editMealChangeHidden,
        })
    },
    editMeal:function(e){ //编辑订单
    	var type = e.currentTarget.dataset.state;
    	var d= this.data;
    	var bean = {
                "time": d.year + "-"  + d.month + "-" + d.day,
                "mainId": app.mainId,
                "cardId": app.cardId,
                "type": type, 
       }
       var u = '../addOrder/addOrder?time='+ bean.time + '&mainId=' + bean.mainId + '&cardId='+bean.cardId + '&type='+bean.type;
       this.setData({
 	      actionSheetHidden: true
       });
       wx.navigateTo({
           url:u
      });
    },
    selectMonth: function(e) { //选择月份
        var type = e.currentTarget.dataset.type;
        var _t = this.data;
        var _Year = _t.year;
        var _Month = _t.month;
        var y, m;

        if (type == 'before') {
            _Month--;
            if (_Month < 1) {
                _Month = 12;
                _Year--;
            }
        } else {
            _Month++;
            if (_Month > 12) {
                _Month = 1;
                _Year++;
            }
        }
        y = _Year;
        m = _Month;
        var isThisMonth = null;
        if (this.data.getThisMonth != _Month) {
            isThisMonth = false;
        } else {
            isThisMonth = true;
        }
        this.setData({
            year: y,
            month: m,
            isThisMonth: isThisMonth
        })
        getMonthData(this);

    },
    onTouchStart:function(e){ //左右滑动
       return;
       this.setData({
            startClientX:e.changedTouches[0].clientX,
            startClientY:e.changedTouches[0].clientY
        })

    },
    onTouchEnd:function(e){ //左右滑动
        return;
        var startX = this.data.startClientX;
        var startY = this.data.startClientY;
        var directionX = startX - e.changedTouches[0].clientX;
        var directionY = startY - e.changedTouches[0].clientY;
       
        if(directionY > 20){
            return
        }
        if(directionY < -15 && directionY < 1){
            return
        }
        if(directionX == 0 || directionY == 0){
            return;
        }
        if(directionX < 0){
            console.log('向右滑')
            var type = 'before';
        }else{
            console.log('向左滑')
            var type = 'after';
        }
         var _t = this.data;
            var _Year = _t.year;
            var _Month = _t.month;
            var y, m;

        if (type == 'before') {
            _Month--;
            if (_Month < 1) {
                _Month = 12;
                _Year--;
            }
        } else {
            _Month++;
            if (_Month > 12) {
                _Month = 1;
                _Year++;
            }
        }
        y = _Year;
        m = _Month;
        var isThisMonth = null;
        if (this.data.getThisMonth != _Month) {
            isThisMonth = false;
        } else {
            isThisMonth = true;
        }
        this.setData({
            year: y,
            month: m,
            isThisMonth: isThisMonth
        })
        getMonthData(this);
    },
    radioChange: function(e) { //0是过期 1是未过期
        const month = getNowFormatDate().month;
        const _this = this;
        const state = e.detail.value;
        const _thisD = this.data;
        const listObj = _this.data.listObj;
        const l = listObj.length;
        const flag = _thisD.flag;
        if (flag != true) {
            _this.setData({
                flag: true
            })
            for (let i = 0; i < l; i++) {
                if (listObj[i].type == 4) {
                    listObj[i].selectThis = i + 1;
                }
            }
            _this.setData({
                listObj: listObj
            })

        } else {
            _this.setData({
                flag: false
            })
            for (let i = 0; i < l; i++) {
                if (listObj[i].type == 4) {
                    listObj[i].selectThis = false;
                }
            }
        }
        _this.setData({
            listObj: listObj
        })
    },
    selectThisDay: function(e) {
        var num = e.currentTarget.dataset.num;
        const listObj = this.data.listObj;
        console.log(num)
        if (listObj[num].selectThis) {
            listObj[num].selectThis = false;
            this.setData({
                listObj: listObj
            })
        } else {
            listObj[num].selectThis = true;
            this.setData({
                listObj: listObj
            })
        }
    },
    goToChooseMeal:function(){ //去选餐
        this.setData({
            editMealChangeHidden: !this.data.editMealChangeHidden,
        })
         wx.navigateTo({
            url:'../chooseMeal/chooseMeal'
        })
    },
    deleteChooleMealDate:function(){ //删除日期
        const that =this;
        const d =that.data;
         const day = d.chooseMealDay;
        const bean = {
            time: d.year + '-' + d.month + '-' + day,
            cardId: app.cardId,
            mainId: app.mainId,
            memberId:app.memberId
        }
        that.setData({
            editMealChangeHidden: !this.data.editMealChangeHidden,
        })
        if(d.flag){
            return;
        }
        d.flag = true;
        setTimeout(function(){
                wx.request({
                url: app.domainName + '/messSmallRoutine/79B4DE7C/delNotCMealOrder.do',
                data: bean,
                type: 'POST',
                success: function(res) {
                    that.setData({
                        flag:false
                    })
                    const status = res.data.status;
                    
                    switch (status) {
                        case 'success':
                            //app.layerMsg('删除成功!')
                            that.onLoad();
                            break;
                        case 'error1':
                            app.layerMsg('删除失败!')
                            break;
                        default:
                            return;
                            //app.layerMsg('删除失败!')
                    }
                }
            })
        },600)
    },
    chooseMeal: function(e) { //打开未选餐状态
        const day = e.currentTarget.dataset.num + 1;
        const that =this;
        const d =that.data;
        this.setData({
          editMealChangeHidden: !this.data.editMealChangeHidden,
          chooseMealDay:day
        })
    },
    submit: function(e) {
        var flag = this.data.submitFlag;
        if(flag == '1'){
            console.log('正在提交....')
            return;
        }
        this.setData({
            submitFlag:1
        });
        
        const listObj = this.data.listObj;
        const l = listObj.length;
        const m = this.data.month;
        const y = this.data.year;
        const _this = this;
        const reOnLoad = function() {
            _this.onLoad();
        }
        
        var submitG = [];
        for (let i = 0; i < l; i++) {
            if (listObj[i].selectThis) {
                submitG.push(y + '-' + m + '-' + [i + 1])
            }
        }
       
        if (submitG.length == 0) {
            app.layerMsg('请选择订餐时间')
        } else {
            var bean = {
                "days": submitG.join(","),
                "mainId": app.mainId,
                "cardId": app.cardId,
                "memberId":app.memberId
            }
            
            wx.request({
                url: app.domainName + '/messSmallRoutine/79B4DE7C/saveMealOrder.do',
                data: bean,
                type: 'POST',
                success: function(res) {
                    setTimeout(function(){
                        _this.setData({
                            submitFlag:2
                        });
                    },2000)
                    var status = res.data.status;
                    switch (status) {
                        case 'success':
                            wx.navigateTo({
                                    url: '../chooseMeal/chooseMeal'
                                })
                            break;
                        case 'error1':
                            app.layerMsgCallBack('订餐失败,请选择日期', reOnLoad);
                            break;
                        default:
                            return;
                            //app.layerMsgCallBack('订餐失败,请选择日期', reOnLoad);
                    }
                }
            })
        }
    },
    loadingChange:function(){
        this.setData({
                loadHidden:true
            })
    },
    onLoad: function() {
        var _this = this;
        app.getHeadMsg(app, _this);
        getMonthData(_this);
      
    },
    onShow:function(){
        var _this =this;
        setTimeout(function(){
            app.getHeadMsg(app, _this);
            getMonthData(_this);
             _this.setData({
                loadHidden:true
            })
        },800)
    },
    onHide:function(){
         var _this =this;
         app.getHeadMsg(app, _this);
         getMonthData(_this);
          _this.setData({
            loadHidden:false
        })
    }
})
