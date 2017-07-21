/**
 * Created by 巫运廷 on 2017/6/22.
 */
var busyOverlay;
var upbody_img_code = "";
var id_img_code="";
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
    //如果是     立项报价跳过来，要调下原生获取用户的  token
    if (localStorage.getItem("token") !== "undefined"){
        $._callServiceNative();
    }
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
        var token = localStorage.getItem("token");
        var u_usercode = localStorage.getItem("u_usercode");
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
       var jsonData = $("#userMesgWraper").serializeArray();
        var jsonObj = $.arr2json(jsonData);
        var marriTypeVal = $("#select1_dummy").val();
        var document_typeVal = $("#select2_dummy").val();
        var sexVal = $("#select3_dummy").val();
        var quote_id = localStorage.getItem("quote_id");
        var tempObj = {
            marriage:selectTypeObj.marriageObj[marriTypeVal],
            document_type:selectTypeObj.cardTypeObj[document_typeVal],
            sex:selectTypeObj.sexObj[sexVal],
            u_usercode:u_usercode,
            quote_id: quote_id,
            token:token
        }
        try {
            jsonObj = Object.assign(tempObj, jsonObj)
        }catch (e) {
            jsonObj = $.contactObj(tempObj, jsonObj);
        }
        if (id_img_code === ""){
            $.ajax({
                url:appSettings.uploadUrl+"fin/mobile/user/addLesseeBaseInfo",
                data:jsonObj,
                type:"POST",
                dataType: "json",
                contentType:"application/json&charset=utf-8",
                success:confirmCallback,
                error:confirmError,
            })
        }else {
            summer.upload({
                "fileURL" : id_img_code, //需要上传的文件路径
                "type" : "image/jpeg", //上传文件的类型 > 例：图片为"image/jpeg"
                "params" : jsonObj,
                "SERVER" : appSettings.uploadUrl+"fin/mobile/user/addLesseeBaseInfo" //服务器地址
            }, confirmCallback, confirmError);
        }
        function confirmCallback(data) {
            var id = JSON.parse(data.response).data.id;
            try{
                localStorage.removeItem("id");
            }catch (e){

            }
            if(!!$(".specialUserMesgListItemIcon").find("img")){
                summer.upload({
                    "fileURL" : upbody_img_code, //需要上传的文件路径
                    "type" : "image/jpeg", //上传文件的类型 > 例：图片为"image/jpeg"
                    "params" : {
                        "id": id,
                    },
                    "SERVER" : appSettings.uploadUrl+"fin/mobile/user/addLesseeBodyImg" //服务器地址
                }, ubbodyCallback, upbodyError);
            }
            localStorage.setItem("id",id);
            window.location.href = "userMesg.html";
            function ubbodyCallback(data) {
                console.log("保存成功！");
            }
            function upbodyError() {
            }
        }
        function confirmError(e) {
            alert("保存失败！")
        }
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
function openCamaraOrAlbum(args) {
    var objContainer = null;
    if (isOcr === "0") {
        var objContainer = $(".specialUserMesgListItemIcon");
    } else {
        objContainer = $(".photoContainer");
        showWaiting();
    }
        if (!!objContainer.find("img")) {
            objContainer.html("");
        }

        var imgPath = args.imgPath;
        var image = new Image();
        image.src = imgPath;
        image.style.width = "100%";
        image.style.height = "100%";
        objContainer.append(image);
        if (isOcr === "1") {
            id_img_code = imgPath;
            summer.upload({
                "fileURL": imgPath, //需要上传的文件路径
                "type": "image/jpeg", //上传文件的类型 > 例：图片为"image/jpeg"
                "params": {
                    typeId: "2",
                },
                "SERVER": appSettings.uploadUrl + "fin/mobile/ocr/fDocr" //服务器地址
            }, mycallback, myerror);
        } else {
            bodyOverfloawAuto();
            upbody_img_code = imgPath;
        }
        $(".takePhotosTypeWraper").hide();
}
//ocr识别成功，对返回的数据进行渲染
function mycallback(data) {
    bodyOverfloawAuto();
    var data = JSON.parse(data.response).data;
    if (data.success === "false"||data == undefined){
        hideWaiting();
        alert("识别失败！")
        return;
    }
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


