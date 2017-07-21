/**
 * Created by 巫运廷 on 2017/6/25.
 */
var pageIndex = 0;//索引，支持上拉刷新
var pageSize = 10;
var historyPageIndex = 0;//历史记录，索引
document.addEventListener("deviceready", function () {
    document.addEventListener("backbutton", function () {
        functionback();
    }, false);
}, false);
summerready = function () {
    //调原生拿用户的所有信息
    $._callServiceNative();
    //页面加载时，请求数据
    callservice(pageIndex);
    //点击历史按钮      显示已提交的    @todo
    $(".historyOperation").on("click",function () {
        $("#listview").hide();
        callserviceHistory();
        $("#listview1").show()
    })
    //点击查询按钮        支持模糊查查询   @todo
    $(".checkOperation").on("click",function () {
        $("#listview").show();
        $("#listview1").hide()
    })
    //初始化控件，      只能初始化一次
    $(function () {
        var listview = UM.listview("#listview");
//        listview.on("pullDown", function (sender) {
//            sender.refresh();
//        });
        listview.on("pullUp", function (sender) {
            pageIndex++;
            callservice(pageIndex)
            sender.refresh();
        });
        listview.on("itemDelete", function (sender, args) {
        });
        listview.on("itemClick", function (sender, args) {
        });
        listview.on("itemSwipeLeft", function (sender, args) {
            sender.showItemMenu(args.$target);
        });
        listview.on("tapHold", function () {
        });
    });
    $(function () {
        var listview = UM.listview("#listview1");
//        listview.on("pullDown", function (sender) {
//            sender.refresh();
//        });
        listview.on("pullUp", function (sender) {
            sender.refresh();
        });
        listview.on("itemDelete", function (sender, args) {
        });
        listview.on("itemClick", function (sender, args) {
        });
        listview.on("itemSwipeLeft", function (sender, args) {
            sender.showItemMenu(args.$target);
        });
        listview.on("tapHold", function () {
        });
    });
}
//页面加载时的成功回调
function mycallback(data) {
    var dataArr = data.detailMsg.data.content;//报价信息  数组
    var eventHandler = null;
    var checkMesgArr = [];
    //返回的数据是一个数组。    数据为空时，给与提醒@todo
    if (dataArr.length === 0) {
        return
    }
dataArr.forEach(function (item,index) {
    var obj = {};
    //测试阶段  对于一些值为空时  设置默认值。 以后要删除 @todo
        obj.creationtime=item.creationtime||"2016 04 16  21：08";
        obj.finance_money = item.finance_money ||"639,700.00";
        obj.client_name = item.client_name||"待维护";
        obj.scheme_name = item.eqInfo||"奔驰 C级 2017款 改哇咔咔卡卡";
        obj.pk_quote_h = item.pk_quote_h;
        obj.client_id = item.client_id;
        checkMesgArr.push(obj)
})
    var htmlStr =str2each(checkMesgArr);
    $("#checkListContainer").append(htmlStr);
    var $height = $("#checkListContainer").height();
    $("#checkListContainer").css("min-height",$height+1+"px");
    //列表点击事件，这里使用代理进行事件的绑定。
    if (pageIndex === 0){
        $("#checkListContainer").on("click","li",function (e) {
            var id = $(".hiddenId",this).text();
            var _self = this;
            var quote_id = $(".hiddenQid",this).text();
            var $userName = $(".listBottomMesgLeft",this).text();
            try{
                localStorage.removeItem("id");
                localStorage.removeItem("quote_id");
            }catch (e){

            }
            localStorage.setItem("quote_id",quote_id)
            localStorage.setItem("id",id)
            if (e.target === $(".confirmBtn",this)[0]){
                $_ajax._post({
                    url: "com.yyjr.ifbp.fin.controller.IFBPFINController",
                    handler: "handler",
                    data: {
                        "transtype": "urlparamrequest",
                        "requrl": appSettings.proxy+"/fin-ifbp-base/fin/mobile/flow/startProcess",
                        "reqmethod": "POST",
                        "reqparam": "id="+id+"&quote_id="+quote_id+"&quoto_status=1"

                    },
                    success: approvalSuc,
                    err: approvalErr
                })
                function approvalSuc(data) {
                    alert("提交成功！");
                    $(_self).remove();
                    var lis =  $("#checkListContainer li").length;
                    var liHeight = $("#checkListContainer li").height();
                    var totalHeight = lis*liHeight;
                    var $height = $("#checkListContainer").height();
                    $("#checkListContainer").css("min-height",totalHeight+1+"px");
                }
                function approvalErr(err) {
                    alert("提交失败！");
                }
            }else if (e.target === $(".deleteBtn",this)[0]){
                $_ajax._post({
                    url: "com.yyjr.ifbp.fin.controller.IFBPFINController",
                    handler: "handler",
                    data: {
                        "transtype": "urlparamrequest",
                        "requrl": appSettings.proxy+"/fin-ifbp-base/fin/quote/quotoDel",
                        "reqmethod": "GET",
                        "reqparam": "pk_quote_h="+quote_id
                    },
                    success: deleteSuc,
                    err: deleteErr
                })
                function deleteSuc(data) {
                    $(_self).remove();
                    var lis =  $("#checkListContainer li").length;
                    var liHeight = $("#checkListContainer li").height();
                    var totalHeight = lis*liHeight;
                    var $height = $("#checkListContainer").height();
                    $("#checkListContainer").css("min-height",totalHeight+1+"px");
                }
                function deleteErr(err) {
                    alert("删除失败!")
                }
            }else {
                if ( $userName === "待维护") {
                    window.location.href = "html/idInformation.html"
                }else {
                    window.location.href = "html/userMesg.html";
                }
            }
        })
    }
}
//页面加载的时候的失败回调
function myerror(err) {
    $.setTotastText({
        text:"没有获取到数据！"
    })
}
//  拼接字符串
function str2each(arr) {
    var htmlStr = "";
    arr.forEach(function (item,index) {
        htmlStr += '<li class="um-listview-row">'
            +'<a href="#" class="um-list-item um-swipe-action um-no-icon">'
            +'<div class="um-swipe-btns">'
            +'<span class="um-swipe-btn  confirmBtn">提交</span>'
            +'<span class="um-swipe-btn  deleteBtn">删除</span>'
            +'</div>'
            +'<div class="um-list-item-inner">'
            +'<div class="um-list-item-body" style="padding-right:5px;">'
            +'<div class="listTopMesg">'
            +'<span class="listTopMesgLeft">'
            + item.scheme_name
            +'</span>'
            +'<span class="listTopMesgRight">'
            + item.creationtime
            +'</span>'
            +'</div>'
            +'<div class="listBottomMesg">'
            +'<span class="listBottomMesgLeft">'
            + item.client_name
            +'</span>'
            +'<span class="listBottomMesgRight">'
            +'￥'+item.finance_money
            +'</span>'
            +'</div>'
            +'<div class="hiddenMesg" style="display: none">'
            +'<span class="hiddenId">'+item.client_id+'</span>'
            +'<span class="hiddenQid">'+item.pk_quote_h+'</span>'
            +'</div>'
            +'<i class="listArrowContainer"></i>'
            +'</div>'
            +'</div>'
            +'</a>'
            +'</li>'
    })
    return htmlStr;
}
//历史页面         html
function historyStr2each(arr) {
    var htmlStr = "";
    arr.forEach(function (item,index) {
        htmlStr  += '<li class="um-listview-row">'
            +'<a href="#" class="um-list-item um-swipe-action um-no-icon">'
            +'<div class="um-list-item-inner">'
            +'<div class="um-list-item-body" style="padding-right:5px;">'
            +'<div class="listTopMesg">'
            +'<span class="listTopMesgLeft">'
            + item.scheme_name
            +'</span>'
            +'<span class="listTopMesgRight">'
            + item.creationtime
            +'</span>'
            +'</div>'
            +'<div class="listBottomMesg">'
            +'<span class="listBottomMesgLeft">'
            + item.client_name
            +'</span>'
            +'<span class="listBottomMesgRight">'
            +'￥'+item.finance_money
            +'</span>'
            +'</div>'
            +'<div class="hiddenMesg" style="display: none">'
            +'<span class="hiddenId">'+item.client_id+'</span>'
            +'<span class="hiddenQid">'+item.pk_quote_h+'</span>'
            +'</div>'
            +'<i class="listArrowContainer"></i>'
            +'</div>'
            +'</div>'
            +'</a>'
            +'</li>'
    })
    return htmlStr;
}
//退出应用
function functionback() {
    var u = navigator.userAgent,
        app = navigator.appVersion;
    var isAndroid = u.indexOf('Android') > -1 || u.indexOf('Linux') > -1;
    var isIOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/);
    if (isAndroid) {
        navigator.app.exitApp();
    }
    if (isIOS) {
        var pamn = {
            "params" : {
                "transtype" : "exit_back"
            }
        };
        summer.callService("SummerService.gotoNative", pamn, false);
    }
}
//页面加载时    历史数据成功的回调
function historycallback(data) {
    var dataArr = data.detailMsg.data.content;
    var eventHandler = null;
    var historyMesgArr = [];
    if (dataArr.length === 0) {
        return
    }
    $("#historyListContainer").html("");
    dataArr.forEach(function (item,index) {
        var obj = {};
        obj.creationtime=item.creationtime||"2016 04 16  21：08";
        obj.finance_money = item.finance_money ||"639,700.00";
        obj.client_name = item.client_name||"待维护";
        obj.scheme_name = item.eqInfo||"奔驰 C级 2017款 改哇咔咔卡卡";
        obj.pk_quote_h = item.pk_quote_h;
        obj.client_id = item.client_id;
        historyMesgArr.push(obj)
    })
    var htmlStr =historyStr2each(historyMesgArr);
    $("#historyListContainer").append(htmlStr);
    var $height =  $("#historyListContainer").height();
    $("#historyListContainer").height("min-height",$height+1+"px");
    //列表点击事件，点击进入个人信息页，如果id为null，进入个人档案新增
    $(".um-listview-row").on("click",function (e) {
        var id = $(".hiddenId",this).text();
        var quote_id = $(".hiddenQid",this).text();
        try{
            localStorage.removeItem("id");
            localStorage.removeItem("quote_id");
        }catch (e){

        }
        localStorage.setItem("quote_id",quote_id)
        localStorage.setItem("id",id)
        if (e.target !== eventHandler){
            window.location.href = "html/userMesg.html";
        }
    })
}
//页面   加载时的，历史失败的回调
function historyerror(err) {
alert("获取信息失败!");
}
function callserviceHistory() {
    $_ajax._post({
        url: "com.yyjr.ifbp.fin.controller.IFBPFINController",
        handler: "handler",
        data: {
            "transtype": "urlparamrequest",
            "requrl": "http://10.3.1.145:8080/fin-ifbp-base/fin/quote/quotoMgM",
            "reqmethod": "GET",
            "reqparam": "quoto_status=1"
            //"reqparam": "quoto_status=1"
        },
        success: "historycallback()",
        err: "historyerror()"
    })
}
function callservice(pageIndex) {
    $_ajax._post({
        url: "com.yyjr.ifbp.fin.controller.IFBPFINController",
        handler: "handler",
        data: {
            "transtype": "urlparamrequest",
            "requrl": "http://10.3.1.145:8080/fin-ifbp-base/fin/quote/quotoMgM",
            "reqmethod": "GET",
            "reqparam": "pageSize="+pageSize+"&pageIndex="+pageIndex+"&quoto_status=0"
            //"reqparam":"quoto_status=0"
        },
        success: "mycallback()",
        err: "myerror()"
    })
}

