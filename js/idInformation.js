/**
 * Created by 巫运廷 on 2017/6/22.
 */
var busyOverlay;
var upbody_img_code = "";
var id_img_code=undefined;
var scrollTopNum;
var isOcr = "1"//   1 是ocr识别      0 是半身照
$(function () {
    // var curr = new Date().getFullYear();
    var opt = {
        'date': {
            preset: 'date'
        },
        'select': {
            preset: 'select'
        }
    };
    $('#select1').scroller('destroy').scroller(
        $.extend(opt['select'], {
            theme: "ios7",
            mode: "scroller",
            display: "bottom",
            animate: ""
        })
    );
});
$(function () {
    // var curr = new Date().getFullYear();
    var opt = {
        'date': {
            preset: 'date'
        },
        'select': {
            preset: 'select'
        }
    };
    $('#select2').scroller('destroy').scroller(
        $.extend(opt['select'], {
            theme: "ios7",
            mode: "scroller",
            display: "bottom",
            animate: ""
        })
    );
});
//性别
$(function () {
    // var curr = new Date().getFullYear();
    var opt = {
        'date': {
            preset: 'date'
        },
        'select': {
            preset: 'select'
        }
    };
    $('#select3').scroller('destroy').scroller(
        $.extend(opt['select'], {
            theme: "ios7",
            mode: "scroller",
            display: "bottom",
            animate: ""
        })
    );
});
$(function () {
    $('.scroller-date').scroller('destroy').scroller({
        preset: 'date',
        theme: "ios7",
        mode: "scroller",
        display: "bottom",
        animate: ""
    });
});
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
    //点击返回按钮，返回上一级
    $(".turnBackLastPage").turnBackLastPage("../index.html");
    //点击图片框，打开相机进行拍照，并展示和发送到后台进行识别。识别的信息展示到页面
    $(".photoContainer").on("click", function () {
        bodyOverfloawHidden();
        $(".takePhotosTypeWraper").show();
        isOcr = "1";
    })

    //点击日常半身照上传的逻辑
    $(".specialUserMesgListItemIcon").on("click", function () {
        bodyOverfloawHidden();
        $(".takePhotosTypeWraper").show();
        isOcr = "0";
    })
    //日常半身照 点击屏幕其他地方,关闭弹出层
    $(".closeTakePhotosTypeWraper").on("click", function () {
        bodyOverfloawAuto();
        $(".takePhotosTypeWraper").hide();
    })
    //日常半身照   点击取消按钮，关闭弹出层
    $(".selectTakePhotosTypeCancelBtn").on("click", function () {
        bodyOverfloawAuto();
        $(".takePhotosTypeWraper").hide();
    })
    //打开相机的逻辑，回复body的样式，关闭弹出层
    $("#openCamaraDiv").on("click", function () {
        summer.openCamera({
            callback: function (args) {
                openCamaraOrAlbum(args);
            }
        });
    })
    //点击打开相册的逻辑，回复body的样式，关闭弹出层
    $("#openAlbumDiv").on("click", function () {
        summer.openPhotoAlbum({
            callback: function (args) {
                openCamaraOrAlbum(args);
            }
        });
    })
//点击保存按钮   提交数据到后台
    $(".headerOperation").on("click",function () {
      if ($("#userName").val().trim()===""){
          alert("请输入您的姓名！");
          return
      }
      if ($("#userNation").val().trim()===""){
          alert("请输入您的民族！");
          return
      }
        if ($("#birthDate").val().trim()===""){
            alert("请输入您的出生日期！");
            return
        }
        if ($("#cardNum").val().trim()===""){
            alert("请输入您的证件号码！");
            return
        }
        if ($("#userAddress").val().trim()===""){
            alert("请输入您的住址！");
            return
        }
        var  cardNum = $("#cardNum").val().trim();
        if (cardNum.length !== 18){
            alert("请输入正确的身份证号码！")
            return
        }
       var jsonData = $("#userMesgWraper").serialize();
        jsonData = decodeURI(jsonData)
        jsonData = jsonData.replace(/%2F/g,"-");
        var marriTypeVal = $("#select1_dummy").val();
        var document_typeVal = $("#select2_dummy").val();
        var sexVal = $("#select3_dummy").val();
        jsonData +="&marriage="+selectTypeObj.marriageObj[marriTypeVal];
        jsonData +="&document_type="+selectTypeObj.cardTypeObj[document_typeVal];
        if (upbody_img_code === ""){
            jsonData +="&upbody_img_code=undefined";
        }else {
            jsonData +="&upbody_img_code="+upbody_img_code;
        }
        jsonData +="&id_img_code="+id_img_code;
        jsonData +="&sex="+selectTypeObj.sexObj[sexVal];
        var quote_id = localStorage.getItem("quote_id");
        jsonData +="&quote_id="+quote_id;
        $_ajax._post({
            url: "com.yyjr.ifbp.fin.controller.IFBPFINController",
            handler: "handler",
            data: {
                "transtype": "urlparamrequest",
                "requrl": appSettings.proxy+"/fin-ifbp-base/fin/mobile/user/addLesseeBaseInfo",
                "reqmethod": "POST",
                "reqparam": jsonData,
            },
            success: "confirmCallback()",
            err: "confirmError()"
        })
    })
    
}
//展示遮罩层
function showWaiting() {
    bodyOverfloawHidden();
    busyOverlay = getBusyOverlay('viewport', {
        color : 'white',
        opacity : 0.75,
        text : 'viewport: loading...',
        style : 'text-shadow: 0 0 3px black;font-weight:bold;font-size:14px;color:white'
    }, {
        color : '#175499',
        size : 50,
        type : 'o'
    });
    if (busyOverlay) {
        busyOverlay.settext("正在加载......");
    }
}
//关闭遮罩层
function hideWaiting() {
    bodyOverfloawAuto();
    if (busyOverlay) {
        busyOverlay.remove();
        busyOverlay = null;
    }
}
//设置body样式为overflow：hiddem
function bodyOverfloawHidden() {
    scrollTopNum = $("body").scrollTop();
    $("body").css({
        position:"fixed",
        overflow:"hidden",
    })
}
//还原body的样式为overflow：auto
function bodyOverfloawAuto() {
    $("body").css({
        overflow:"auto",
        position:"relative",
    })
    $("body").scrollTop(scrollTopNum)
}
function confirmCallback(data) {
    var id = data.data.id;
    try{
        localStorage.removeItem("id");
    }catch (e){

    }
    localStorage.setItem("id",id);
    window.location.href = "userMesg.html";
}
function confirmError(e) {
    alert("保存失败！")
}
//半身照和ocr识别都走的这个逻辑
function openCamaraOrAlbum(args) {
    var objContainer = null;
    if (isOcr === "0") {
        var objContainer = $(".specialUserMesgListItemIcon");
    }else {
        objContainer =$(".photoContainer");
        showWaiting();
    }
    if (!!objContainer.find("img")) {
        objContainer.html("");
    }
    var imgPath = args.imgPath;
    var max_width = 1080;
    var max_height = 960;
    var img = new Image();
    img.src = imgPath; //base64字符串
    //这里设置的是撑开图片盒子，也可以自己设置宽和高
    img.onload = function () {
        //对图片进行压缩
        var width = img.width;
        var height = img.height;
        var canvas = document.createElement("canvas");
        if(width > height) {
            if(width > max_width) {
                height = Math.round(height *= max_width / width);
                width = max_width;
            }
        }else{
            if(height > max_height) {
                width = Math.round(width *= max_height / height);
                height = max_height;
            }
        }
        canvas.width = width;
        canvas.height = height;
        canvas.getContext("2d").drawImage(img, 0, 0, width, height);
        //这里的压缩比例是0.85
        if (isOcr === "1"){
            var dataURL = canvas.toDataURL('image/jpeg',0.85);
            var imageDom = new Image();
            imageDom.src=dataURL;
            imageDom.style.width = "100%";
            imageDom.style.height = "100%";
            objContainer.append(imageDom);
            bodyOverfloawAuto();
            id_img_code = dataURL.replace(/^data:image\/(png|jpg|jpeg);base64,/, "");
            $_ajax._post({
                url: "com.yyjr.ifbp.fin.controller.IFBPFINController",
                handler: "handler",
                data: {
                    "transtype": "urlparamrequest",
                    "requrl": appSettings.requerl,
                    "reqmethod": "POST",
                    "reqparam": "typeId=2&img="+ id_img_code,
                },
                success: "mycallback()",
                err: "myerror()"
            })
        }else{
            var dataURL = canvas.toDataURL('image/jpeg',0.85);
            var imageDom = new Image();
            imageDom.src=dataURL;
            imageDom.style.width = "100%";
            imageDom.style.height = "100%";
            objContainer.append(imageDom);
            bodyOverfloawAuto();
            upbody_img_code = dataURL.replace(/^data:image\/(png|jpg|jpeg);base64,/, "");
        }

    }
    $(".takePhotosTypeWraper").hide();
}
//ocr识别成功，对返回的数据进行渲染
function mycallback(data) {
    if (data.success === "false"){
        hideWaiting();
        return;
    }
    var data = data.data;
    if(data.name == ""||data.sex==""||data.nation==""||data.birthday=="") {
        hideWaiting()
        alert("请核查您上传的照片")
        return;
    }
    $("#userName").val(data.name||"");
    $("#select3_dummy").val(data.sex||"");
    $("#userNation").val(data.nation||"");
    $("#birthDate").val(data.birthday||"");
    $("#userAddress").val(data.birth_address||"");
    $("#cardNum").val(data.document_id||"")
    hideWaiting();
}
//ocr 识别失败的逻辑
function myerror(error) {
    hideWaiting();
    alert("识别失败，请重新识别！");
}

//获取url后面的内容
function getQueryByName(str,name) {
   //var params = decodeURI(location.search);
    var result = str.match(new RegExp("[\?\&]" + name + "=([^\&]+)", "i"));
    if (result == null || result.length < 1) {
        return "";
    }
    return result[1];
}


