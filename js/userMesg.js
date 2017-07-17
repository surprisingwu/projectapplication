/**
 * Created by 巫运廷 on 2017/6/24.
 */
document.addEventListener("deviceready", function () {
    document.addEventListener("backbutton", function () {
        try {
            localStorage.removeItem("navIndex");
        } catch (e) {
        }
        window.location.href = "../index.html";
    }, false);
}, false);
summerready = function () {
    $("#chengzuren .chengzuren").addClass("activechengzuren");
    $("#chengzuren #chengzurenText").addClass("chengzurenText")
    var id = localStorage.getItem("id");
    var quote_id = localStorage.getItem("quote_id");
    renderMesg();
        renderBondManNesg();
    //页面加载时，请求担保人的数据
    function renderBondManNesg() {
        if(quote_id === "null"||id==="undefined"){
            return;
        }
        $_ajax._post({
            url: "com.yyjr.ifbp.fin.controller.IFBPFINController",
            handler: "handler",
            data: {
                "transtype": "urlparamrequest",
                "requrl": appSettings.proxy+"/fin-ifbp-base/fin/guarantee/selectGuarantById",
                "reqmethod": "POST",
                "reqparam": "pk_quote_h="+quote_id
            },
            success: mycallback,
            err: myerror
        })
        function mycallback(data) {
            if (data.success === "false"){
                return
            }
            try {
                var data = data.detailMsg.data[0];
            }catch (e){
            }
                if (data === null || data === "") {
                    return
            }
            localStorage.setItem("quoteIdData",JSON.stringify(data))
            renderBondMan(data)
        }
        function myerror(err) {
        }
    }
    function renderMesg() {
        if(id === "null"||id === "undefined") {
            return;
        }
        $_ajax._post({
            url: "com.yyjr.ifbp.fin.controller.IFBPFINController",
            handler: "handler",
            data: {
                "transtype": "urlparamrequest",
                "requrl": appSettings.proxy+"/fin-ifbp-base/fin/mobile/user/get",
                "reqmethod": "POST",
                "reqparam": "id="+id
            },
            success: "mycallback()",
            err: "myerror()"
        })
    }
    //点击芝麻信用
    $(".headerOperation").on("click",function () {
        $_ajax._post({
            url: "com.yyjr.ifbp.fin.controller.IFBPFINController",
            handler: "handler",
            data: {
                "transtype": "urlparamrequest",
                "requrl": appSettings.proxy+"/fin-ifbp-base/fin/sesame/authorizeAndSend",
                "reqmethod": "GET",
                "reqparam": "client_Id="+id
            },
            success: mycallback,
            err: myerror
        })
        function mycallback(data) {
            alert("授权成功！");
        }
        function myerror(err) {
            alert("操作失败！")
        }
    })
    //进来请求数据
    $(".turnBackLastPage").turnBackLastPage("../index.html");
    //点击个人档案，进入个人详情页或者新增页面
    $(".userMesgShow").on("click", function () {
        if ($("#userName").html() === "") {
            window.location.href = "idInformation.html";
        } else {
            window.location.href = "idInformationDetail.html";
        }
    })
    addBindEvent()
$("#chengzuren").on("click",function () {
    if (location.href.indexOf("userMesg.html")>0) {
        return;
    }
    window.location.href = "userMesg.html";
})
    //点击资料的逻辑
    $("#ziliao").on("click",function () {
        if (location.href.indexOf("userData.html")>0) {
            return;
        }
        window.location.href = "userData.html";
    })
    //点击报价
    $("#baojia").on("click",function () {
        window.location.href = "../index.html";
    })
}
function mycallback(data) {
    if (data.success === "false") {
        return;
    }
    var data = data.data;
    if (data === null || data === "") {
        alert("返回的数据为空")
        return
    }
    //对获取的数据进行保存,便于详情页使用
        localStorage.setItem("data",JSON.stringify(data));
    //个人档案
    showUserMesg(data);
    //配偶
    renderWifeMesg(data);
    //联系方式
    renderContactWay(data);
    //联系人
    renderContactPeople(data);
    //银行卡
    renderBankCardAccount(data);
    //担保人
    //给对应的信息     绑定事件
    detailBindEvent();
}
function myerror(e) {
    alert("加载个人信息数据失败！" )
}
//渲染个人档案的逻辑
function showUserMesg(data) {
    $("#userName").html(data.name || "");
    var sexText = data.sex;
    var $dateFat =  new Date(Number(data.birthday)).Format("yyyy-MM-dd");
   for (var key in selectTypeObj.sexObj){
       if (selectTypeObj.sexObj[key] === sexText) {
           sexText = key;
       }
   }
   var documentTypeText = data.document_type;
    for (var key in selectTypeObj.cardTypeObj){
        if (selectTypeObj.cardTypeObj[key] === documentTypeText) {
            documentTypeText = key;
        }
    }
    $("#userSex").html(sexText)
    $("#userNation").html(data.nation || "")
    $("#userBirthDate").html($dateFat || "")
    $("#userIndefienceCardType").html(documentTypeText)
    $("#userIndefienceCardNum").html(data.document_id || "")
}
//渲染  配偶信息的逻辑
function renderWifeMesg(data) {
    var $wifeMesg = $("#wifeMesg");
    if (data.matename == null || data.matemobile == null) {
        return;
    }
    var mesgStr = '<li class="commonListItem wifeMesgDetail"><span class="commonListItemText">' + data.matename + '</span><i class="commonListItemRightArrow"></i> <span class="commonListItemVal">' + data.matemobile + '</span></li>';
    $wifeMesg.append(mesgStr);
}
//渲染  联系方式的逻辑
function renderContactWay(data) {
    var $contactWay = $("#contactWay");
    if (data.mobile == null || data.address == null) {
        return;
    }
    var mesgStr = '<li class="commonListItem connectWay"><span class="commonListItemText">' + data.mobile + '</span><i class="commonListItemRightArrow"></i> <span class="commonListItemVal">' + data.address + '</span></li>';
    $contactWay.append(mesgStr);
}
//渲染 联系人
function renderContactPeople(data) {
    var $connectPeople = $("#connectPeople");
    var data = data.contacts_id;
    if (data === []||data===null) {
        return;
    }
    var mesgStr = "";
    data.forEach(function (item,index) {
        if (item.name !== null||item.phone !== null) {
            mesgStr += '<li class="commonListItem connectPeopleDetail"><span class="commonListItemText">' + item.name + '</span><i class="commonListItemRightArrow"></i> <span class="commonListItemVal">' + item.phone+ '</span></li>';
        }
    })
    $connectPeople.append(mesgStr)
}

//渲染银行账户
function renderBankCardAccount(data) {
    var $bankCardAccount = $("#bankCardAccount");
    var data = data.probank_id;
    if (data === []||data === null) {
        return;
    }
    var mesgStr = "";
    data.forEach(function (item,index) {
        if (item.account !== null||item.owned !== null) {
            mesgStr += '<li class="commonListItem bankAccountDetail"><span class="commonListItemText">' + item.account+ '</span><i class="commonListItemRightArrow"></i> <span class="commonListItemVal">' + item.owned+ '</span></li>';
        }
    })
    $bankCardAccount.append(mesgStr);
}
//渲染担保人的信息
function renderBondMan(data) {
        var $bondsmanMesg = $("#bondsmanMesg");
        //拿到相应的信息
        if (data.name == null || data.mobile == null) {
            return;
        }
        var mesgStr = '<li class="commonListItem wifeMesgDetail"><span class="commonListItemText">' + data.name + '</span><i class="commonListItemRightArrow"></i> <span class="commonListItemVal">' + data.mobile + '</span></li>';
    $bondsmanMesg.append(mesgStr);
    //点击担保人详情
    $("#bondsmanMesg").on("click",function () {
        window.location.href = "bondsmanDetail.html"
    })
}
function addBindEvent() {
    //点击配偶新增，进入配偶新增页
    $(".wifeMesgContainer").on("click", function () {
        window.location.href = "wifeIdInformation.html";
    })
    //点击联系方式新增
    $(".connectWay").on("click", function () {
        window.location.href = "businessCard.html";
    })
    //点击联系人新增
    $(".connectPeople").on("click", function () {
        window.location.href = "conectWay.html";
    })
    //点击银行账户新增
    $(".bankAccount").on("click", function () {
        window.location.href = "addBankCard.html";
    })
    //点击担保人新增
    $(".bondsMan").on("click",function () {
        window.location.href = "bondsman.html"
    })
}
function detailBindEvent() {
    //点击配偶详情。进入配偶详情页
    $("#wifeMesg").on("click", function () {
        window.location.href = "wifeIdInformationDetail.html";
    })
    //点击联系方式详情
    $("#contactWay").on("click", function () {
        window.location.href = "businessCardDetail.html";
    })
    //点击联系人详情
    $("#connectPeople").on("click", function () {
        window.location.href = "connectPeople.html";
    })
    //点击银行账户详情
    $("#bankCardAccount").on("click", function () {
        window.location.href = "bankCardAccount.html";
    })
    //点击底部的按钮的逻辑
    //点击承租人的逻辑
}
