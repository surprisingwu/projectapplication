
var busyOverlay;
var flag = false;
var show_img_code=undefined;
document.addEventListener("deviceready", function () {
    document.addEventListener("backbutton", function () {
        try {
            localStorage.removeItem("navIndex");
        } catch (e) {
        }
        window.location.href = "userMesg.html";
    }, false);
}, false);
summerready = function () {
    //点击返回按钮，返回上一级
    try{
        var id = localStorage.getItem("id")
    } catch (e){

    }
    // if(id === null) {
    //     alert("请先新增个人档案！")
    //     return;
    // }
    $(".turnBackLastPage").turnBackLastPage("userMesg.html");
    //点击图片框，打开相机进行拍照，并展示和发送到后台进行识别。识别的信息展示到页面
    $(".photoContainer").on("click", function () {
        $(".takePhotosTypeWraper").show();

    })
    //日常半身照 点击屏幕其他地方,关闭弹出层
    $(".closeTakePhotosTypeWraper").on("click", function () {
        $(".takePhotosTypeWraper").hide();
    })
    //日常半身照   点击取消按钮，关闭弹出层
    $(".selectTakePhotosTypeCancelBtn").on("click", function () {
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
$(".headerOperation").on("click",function () {
    if ($("#cardUser").val().trim()===""){
        alert("请输入持卡人的名称！");
        return
    }
    if ($("#bankCardNum").val().trim()===""){
        alert("请输入银行帐号！");
        return
    }
    if ($("#accountType").val().trim()===""){
        alert("请输入银行卡号类型！");
        return
    }
    var jsonData = $("#userMesgWraper").serialize();
    jsonData = decodeURI(jsonData);
    jsonData = jsonData.replace(/=&/g,"=undefined&").replace(/=$/,"=undefined");
    jsonData += "&show_img_code="+show_img_code+"&probank_id="+id;
    $_ajax._post({
        url: "com.yyjr.ifbp.fin.controller.IFBPFINController",
        handler: "handler",
        data: {
            "transtype": "urlparamrequest",
            "requrl": appSettings.proxy+"/fin-ifbp-base/fin/mobile/user/addBankInfo",
            "reqmethod": "POST",
            "reqparam": jsonData,
        },
        success: "myconfirmcallback()",
        err: "myconfirmerror()"
    })
})
}
//展示遮罩层
function showWaiting() {
    busyOverlay = getBusyOverlay('viewport', {
        color: 'white',
        opacity: 0.75,
        text: 'viewport: loading...',
        style: 'text-shadow: 0 0 3px black;font-weight:bold;font-size:14px;color:white'
    }, {
        color: '#175499',
        size: 50,
        type: 'o'
    });
    if (busyOverlay) {
        busyOverlay.settext("正在加载......");
    }
}
//关闭遮罩层
function hideWaiting() {
    if (busyOverlay) {
        busyOverlay.remove();
        busyOverlay = null;
    }
}
function mycallback(data) {
    if (data.sucess === "false"){
        hideWaiting();
        alert("识别失败！")
        return;
    }
    var data = data.data;
    if(data.account_type == ""||data.owned==""||data.account=="") {
        hideWaiting();
        alert("请核查您上传的照片!")
        return;
    }
    $("#accountType").val(data.account_type||"");
    $("#bankCardNum").val(data.account||"");
    $("#totalBankBig").val(data.owned||"");
    hideWaiting();
}
function myerror(error) {
    hideWaiting()
    alert("识别失败，请重新识别！");
}
function myconfirmcallback(data) {
    window.location.href = "userMesg.html";
}
function myconfirmerror(e) {
    alert("保存失败！")
}
//半身照和ocr识别都走的这个逻辑
function openCamaraOrAlbum(args) {
    var $photoContainer = $(".photoContainer");
    var objContainer = null;
    objContainer = $photoContainer;
    showWaiting();
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
        var canvas = document.createElement("canvas");
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
        var dataURL = canvas.toDataURL('image/jpeg',0.85);
        var imageDom = new Image();
        imageDom.src=dataURL;
        imageDom.style.width = "100%";
        imageDom.style.height = "100%";
        objContainer.append(imageDom);
        show_img_code = dataURL.replace(/^data:image\/(png|jpg|jpeg);base64,/, "");
        $_ajax._post({
            url: "com.yyjr.ifbp.fin.controller.IFBPFINController",
            handler: "handler",
            data: {
                "transtype": "urlparamrequest",
                "requrl": appSettings.requerl,
                "reqmethod": "POST",
                "reqparam": "typeId=17&img="+ show_img_code,
            },
            success: "mycallback()",
            err: "myerror()"
        })
    }
    $(".takePhotosTypeWraper").hide();
}




