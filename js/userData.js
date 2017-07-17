/**
 * Created by 巫运廷 on 2017/6/22.
 */
var busyOverlay;
var _selfThat = null;
var scrollTopNum = 0;
var identifyNum = 0;
var identifyAttr = "";
var mesgArr = {
    work_img:"",
    payments_img:"",
    child_img:"",
    estateinfo_img:"",
    capital_img:"",
    media_img:"",
}
//work_img  payments_img  child_img  estateinfo_img    返回的数据可以直接取
//capital_img   media_img   数组包裹
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
    //var userid = "uapcloud100000008oi2";
    //新增 还有资料查询都是和 个人档案生成时的id进行绑定
    // var id = localStorage.getItem("id");
    // if(id === null) {
    //     alert("请先新增个人档案！")
    //     return;
    // }
    //底部的按钮      样式
    $("#ziliao .ziliao").addClass("activeziliao");
    $("#ziliao #ziliaoText").addClass("ziliaoText")
    var id = localStorage.getItem("id");
    //请求所有的数据， 对已有的图片进行展示    暂部支持编辑
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
    //点击返回按钮，返回上一级
    $(".turnBackLastPage").turnBackLastPage("../index.html");
   //点击导航栏，实现tab切换    navItemActive
    $(".navWraper .navItem").on("click",function () {
        if($(this).children().hasClass("navItemActive")){
            return
        }
        var thisAttr = $(this).attr("id");
        if (thisAttr === "userDataMesg") {
            $(".userDataMesg").show();
            $(".assureDataMesg").hide();
        }else {
            $(".assureDataMesg").show();
            $(".userDataMesg").hide();

        }
        $(this).siblings().find("span").removeClass("navItemActive");
        $(this).children().addClass("navItemActive");
    })
    //点击编辑按钮   上传的图片右上角显示删除图标，可以执行删除的动作
    $(".headerOperation").on("click",function () {
        //首先获取到所有的图片盒子，判断是否有子节点img，有的话，显示delete
        var $userDataMesgImgWraper = $(".userDataMesgImgWraper");
        $userDataMesgImgWraper.each(function (index,item) {
            if (!!$(item).find("img")) {
                $(".userDataMesgImgDelete",item).show();
            }
        })
    })

    //图片右上方删除的按钮的逻辑
    $(".userDataMesgImgDelete").on("click",function () {
        $(this).parent().remove("img");
    })
    //点击没有关联关系的，图片右上角的delete按钮，删除整个图片盒子
    $(".userDataMesgMuchImgDelete").on("click",function () {
        $(this).parent().remove();
    })
    //点击没有关联关系的上传按钮时，弹出复层进行选择，打开相册或者相机
    $(".addMuchPhoto").on("click",function () {
        var openCamaraDom = document.getElementById("openCamara");
        var openAlbumDom = document.getElementById("openAlbum");
        _selfThat = this;
        identifyAttr = $(this).attr("id")
        //这个里面绑定打开相册和相机的逻辑，要对事件进行解绑     this
        $(".openCamaraOrAlbumWraper").show();
        bodyOverfloawHidden();
        try{
            openAlbumDom.removeEventListener("click",openAlbumHandler);
            openCamaraDom.addEventListener("click",openCamaraHandler)
        }catch (e){}
        openCamaraDom.addEventListener("click",openCamaraHandler)
        openAlbumDom.addEventListener("click",openAlbumHandler)
    })
    //点击弹出层的取消按钮的逻辑
    $(".operationCancelBtn").on("click",function () {
        $(".openCamaraOrAlbumWraper").hide();
        bodyOverfloawAuto(scrollTopNum);
    })
    //点击弹出层其他地方关闭弹出层
    $(".closeTotastHandler").on("click",function () {
        $(".openCamaraOrAlbumWraper").hide();
        bodyOverfloawAuto(scrollTopNum);
    })
    //点击承租人的逻辑
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
    //点击报价的逻辑
    $("#baojia").on("click",function () {
        window.location.href = "../index.html";
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

    alert(JSON.stringify(data));


    hideWaiting();
}
function myerror(error) {
    alert(JSON.stringify(error));
}

// <div class="userDataMesgMuchImg">
//     <div class="userDataMesgImgWraper addMuchPhoto">
//     <div class="userDataMesgMuchImgDelete" style = "display: none;">
//
//     </div>
//     </div>
//
//     </div>
function createImgWraper() {
    var htmlStr = '<div class="userDataMesgImgWraper addMuchPhoto"><div class="userDataMesgMuchImgDelete" style = "display: none;"></div></div>';
    $(htmlStr).insertBefore(_selfThat)
}
//点击打开相机的逻辑
function openCamaraHandler() {
    summer.openCamera({
        callback: function (args) {
            openCaramaOrAlbum(args);
        }
    });
}
//点击打开相册的逻辑
function openAlbumHandler() {
    summer.openPhotoAlbum({
        callback: function (args) {
            openCaramaOrAlbum(args);
        }
    });
}
function mycallback(data) {
    var $userId = $("#userId");//个人身份证
    var $upBody = $("#upBody");//半身照
    var $bankCard = $("#bankCard");//银行卡
    var $wifeId = $("#wifeId");//配偶身份证
    if (data.success === "false") {
        return;
    }
    var data = data.data;
    if (!data){
        return;
    }
    //个人     身份证
    if(data.id_img!==null){
        renderSingleImg($userId,data.id_img);
    }
    //半身照  单个的
    if (data.upbody_img!==null){
        renderSingleImg($upBody,data.upbody_img);
    }

    //配偶   身份证
    if (data.mateidimg!==null){
        renderSingleImg($wifeId,data.mateidimg);
    }
    //银行卡    可能多张
    var bankCardArr = data.probank_id;
   if (bankCardArr.length > 0){
       $("#placeholderImg").parent().remove();
       bankCardArr.forEach(function (item,index) {
           renderMuchImg($bankCard,item.show_img);
       })
   }
    // work_img:"",
    //     payments_img:"",
    //     child_img:"",
    //     estateinfo_img:"",
    //     capital_img:"",
    //     media_img:"",

   //工作证明照片   对已有的进行展示，并且仍可以上传
    if (data.work_img) {
       var workImgArr = data.work_img.trim().split(",");
       workImgArr.forEach(function (item,index) {
           if (item !==""&&item !=="null"){
               mesgArr.work_img  += item +",";
               renderWorkimgSpecialImg(item);
           }
       })
    }
    //收支证明照片    对已有的进行展示   mediainfo_id   filepath
    if (data.payments_img) {
        var paymentsImgArr = data.payments_img.trim().split(",");
        paymentsImgArr.forEach(function (item,index) {
            if (item !==""&&item !=="null"){
                mesgArr.payments_img += item+",";
                renderPaymentsImgSpecialImg(item)
            }
        })
    }
    //子女照片    对已有的进行展示
    if (data.child_img) {
        var childImgArr = data.child_img.trim().split(",");
        childImgArr.forEach(function (item,index) {
            if (item !==""&&item !=="null"){
                mesgArr.child_img += item+",";
                renderChildImgSpecialImg(item);
            }
        })
    }
    //房产证明照片    对已有的进行展示
    if (data.estateinfo_img) {
        var estateinfoImgArr = data.estateinfo_img.trim().split(",");
        estateinfoImgArr.forEach(function (item,index) {
            if (item !==""&&item !=="null"){
                mesgArr.estateinfo_img += item+","
                renderEstateinfoImgSpecialImg(item)
            }
        })
    }
    //资产档案照片    对已有的进行展示
    //data.procapital_id.capital_img
    if (data.capital_img) {
        var capital_imgArr = data.capital_img.trim().split(",");
        capital_imgArr.forEach(function (item,index) {
            if (item !==""&&item !=="null"){
                mesgArr.capital_img += item+","
                renderCapitalImgSpecialImg(item)
            }
        })
    }
    //其他照片    对已有的进行展示 //data.mediainfo_id.capital_img
    if (data.mediainfo_id.length>0) {
        var mediaImgArr = data.mediainfo_id;
        mediaImgArr.forEach(function (item,index) {
            if (item !==""&&item !=="null"){
                renderMediaImgSpecialImg(item.filepath)
            }
        })
    }

    //@todo 渲染担保人页面 展示担保人的有效二代身份证和其他照片，其他照片仍可以上传

}
function myerror(err) {
    alert("获取信息失败!")
}
//对单一图片进行展示
function renderSingleImg($obj,path) {
    if (path === null) {
        return;
    }
        $_ajax._post({
            url: "com.yyjr.ifbp.fin.controller.IFBPFINController",
            handler: "handler",
            data: {
                "transtype": "urlparamrequest",
                "requrl": appSettings.proxy+"/fin-ifbp-base/fin/mobile/user/fileDownLoad",
                "reqmethod": "POST",
                "reqparam": "filePath="+path,
            },
            success: myRenderSuc,
            err: myRenderErr
        })
    function myRenderSuc(data) {
        var img = new Image();
        img.src = "data:image/jpeg;base64,"+data.resultctx;
        img.style.width = "100%";
        img.style.height = "100%";
        $obj.append(img);
    }
    function myRenderErr(err){
            alert("获取图片失败！");
    }
}
//对多个图片进行展示
function renderMuchImg($obj,path) {
    if (path === null) {
        return;
    }
    $_ajax._post({
        url: "com.yyjr.ifbp.fin.controller.IFBPFINController",
        handler: "handler",
        data: {
            "transtype": "urlparamrequest",
            "requrl": appSettings.proxy+"/fin-ifbp-base/fin/mobile/user/fileDownLoad",
            "reqmethod": "POST",
            "reqparam": "filePath="+path,
        },
        success: myRenderSuc,
        err: myRenderErr
    })
    function myRenderSuc(data) {
        var img = new Image();
        img.src = "data:image/jpeg;base64,"+data.resultctx;
        img.style.width = "100%";
        img.style.height = "100%";
        var htmlStr = '<div class="userDataMesgImgWraper addMuchPhoto" id='+identifyNum+'><div class="userDataMesgMuchImgDelete" style = "display: none;"></div></div>';
        $obj.append(htmlStr);
        $("#"+identifyNum).append(img);
        identifyNum++;
    }
    function myRenderErr(err){
        alert("获取图片失败！");
    }
}
function myUploadSuccess(data) {
    var data = data.data;
    if (identifyAttr === "media_img") {
        return;
    }
    mesgArr[identifyAttr] = data[identifyAttr];
}
function myUploadError(err) {
    alert("加载图片失败！");
}
function openCaramaOrAlbum(args) {
    var params = "";
    bodyOverfloawAuto();
    createImgWraper();
    var $imgContainer = $(_selfThat).prev();
    var imgcode = identifyAttr+"_code";
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
        $imgContainer.append(imageDom);
        $(".openCamaraOrAlbumWraper").hide();
        var base64 = dataURL.replace(/^data:image\/(png|jpg|jpeg);base64,/, "");
        if (mesgArr[identifyAttr] == ""||mesgArr[identifyAttr] == null) {
            params = imgcode+"="+base64+"&id="+id;
        }else {
            params = identifyAttr+"="+mesgArr[identifyAttr]+"&"+imgcode+"="+base64+"&id="+id;
        }

        //发送请求
        $_ajax._post({
            url: "com.yyjr.ifbp.fin.controller.IFBPFINController",
            handler: "handler",
            data: {
                "transtype": "urlparamrequest",
                "requrl": appSettings.proxy+"/fin-ifbp-base/fin/mobile/user/lesseeFileData",
                "reqmethod": "POST",
                "reqparam": params
            },
            success: "myUploadSuccess()",
            err: "myUploadError()"
        })
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
//渲染工作证明及以下的照片，    如果用户的数据path不为空，则对用户的照片进行渲染。并且可以添加。由于都是异步的，不太好解决，就每一个都写一个单独的方法。
function renderWorkimgSpecialImg(path) {
    var $showWorkImg = $("#showWorkImg");
    $_ajax._post({
        url: "com.yyjr.ifbp.fin.controller.IFBPFINController",
        handler: "handler",
        data: {
            "transtype": "urlparamrequest",
            "requrl": appSettings.proxy+"/fin-ifbp-base/fin/mobile/user/fileDownLoad",
            "reqmethod": "POST",
            "reqparam": "filePath="+path,
        },
        success: myRenderSuc,
        err: myRenderErr
    })
    function myRenderSuc(data) {
        var img = new Image();
        img.src = "data:image/jpeg;base64,"+data.resultctx;
        img.style.width = "100%";
        img.style.height = "100%";
        var htmlStr = '<div class="userDataMesgImgWraper addMuchPhoto"><div class="userDataMesgMuchImgDelete" style = "display: none;"></div></div>';
        var htmlJqueryObj = $(htmlStr);
        htmlJqueryObj.append(img);
        $showWorkImg.prepend(htmlJqueryObj);
    }
    function myRenderErr(err){
        alert("获取图片失败！");
    }
}
// work_img:"",
//     payments_img:"",
//     child_img:"",
//     estateinfo_img:"",
//     capital_img:"",
//     media_img:"",

function renderPaymentsImgSpecialImg(path) {
    var $showPaymentsImg = $("#showPaymentsImg");
    $_ajax._post({
        url: "com.yyjr.ifbp.fin.controller.IFBPFINController",
        handler: "handler",
        data: {
            "transtype": "urlparamrequest",
            "requrl": appSettings.proxy+"/fin-ifbp-base/fin/mobile/user/fileDownLoad",
            "reqmethod": "POST",
            "reqparam": "filePath="+path,
        },
        success: myRenderSuc,
        err: myRenderErr
    })
    function myRenderSuc(data) {
        var img = new Image();
        img.src = "data:image/jpeg;base64,"+data.resultctx;
        img.style.width = "100%";
        img.style.height = "100%";
        var htmlStr = '<div class="userDataMesgImgWraper addMuchPhoto"><div class="userDataMesgMuchImgDelete" style = "display: none;"></div></div>';
        var htmlJqueryObj = $(htmlStr);
        htmlJqueryObj.append(img);
        $showPaymentsImg.prepend(htmlJqueryObj);
    }
    function myRenderErr(err){
        alert("获取图片失败！");
    }
}
function renderChildImgSpecialImg(path) {
    var $showChildImg = $("#showChildImg");
    $_ajax._post({
        url: "com.yyjr.ifbp.fin.controller.IFBPFINController",
        handler: "handler",
        data: {
            "transtype": "urlparamrequest",
            "requrl": appSettings.proxy+"/fin-ifbp-base/fin/mobile/user/fileDownLoad",
            "reqmethod": "POST",
            "reqparam": "filePath="+path,
        },
        success: myRenderSuc,
        err: myRenderErr
    })
    function myRenderSuc(data) {
        var img = new Image();
        img.src = "data:image/jpeg;base64,"+data.resultctx;
        img.style.width = "100%";
        img.style.height = "100%";
        var htmlStr = '<div class="userDataMesgImgWraper addMuchPhoto"><div class="userDataMesgMuchImgDelete" style = "display: none;"></div></div>';
        var htmlJqueryObj = $(htmlStr);
        htmlJqueryObj.append(img);
        $showChildImg.prepend(htmlJqueryObj);
    }
    function myRenderErr(err){
        alert("获取图片失败！");
    }
}
function renderEstateinfoImgSpecialImg(path) {
    var $showEstateinfoImg = $("#showEstateinfoImg");
    $_ajax._post({
        url: "com.yyjr.ifbp.fin.controller.IFBPFINController",
        handler: "handler",
        data: {
            "transtype": "urlparamrequest",
            "requrl": appSettings.proxy+"/fin-ifbp-base/fin/mobile/user/fileDownLoad",
            "reqmethod": "POST",
            "reqparam": "filePath="+path,
        },
        success: myRenderSuc,
        err: myRenderErr
    })
    function myRenderSuc(data) {
        var img = new Image();
        img.src = "data:image/jpeg;base64,"+data.resultctx;
        img.style.width = "100%";
        img.style.height = "100%";
        var htmlStr = '<div class="userDataMesgImgWraper addMuchPhoto"><div class="userDataMesgMuchImgDelete" style = "display: none;"></div></div>';
        var htmlJqueryObj = $(htmlStr);
        htmlJqueryObj.append(img);
        $showEstateinfoImg.prepend(htmlJqueryObj);
    }
    function myRenderErr(err){
        alert("获取图片失败！");
    }
}
function renderCapitalImgSpecialImg(path) {
    var $showCapitalImg = $("#showCapitalImg");
    $_ajax._post({
        url: "com.yyjr.ifbp.fin.controller.IFBPFINController",
        handler: "handler",
        data: {
            "transtype": "urlparamrequest",
            "requrl": appSettings.proxy+"/fin-ifbp-base/fin/mobile/user/fileDownLoad",
            "reqmethod": "POST",
            "reqparam": "filePath="+path,
        },
        success: myRenderSuc,
        err: myRenderErr
    })
    function myRenderSuc(data) {
        var img = new Image();
        img.src = "data:image/jpeg;base64,"+data.resultctx;
        img.style.width = "100%";
        img.style.height = "100%";
        var htmlStr = '<div class="userDataMesgImgWraper addMuchPhoto"><div class="userDataMesgMuchImgDelete" style = "display: none;"></div></div>';
        var htmlJqueryObj = $(htmlStr);
        htmlJqueryObj.append(img);
        $showCapitalImg.prepend(htmlJqueryObj);
    }
    function myRenderErr(err){
        alert("获取图片失败！");
    }
}
function renderMediaImgSpecialImg(path) {
    var $showMediaImg = $("#showMediaImg");
    $_ajax._post({
        url: "com.yyjr.ifbp.fin.controller.IFBPFINController",
        handler: "handler",
        data: {
            "transtype": "urlparamrequest",
            "requrl": appSettings.proxy+"/fin-ifbp-base/fin/mobile/user/fileDownLoad",
            "reqmethod": "POST",
            "reqparam": "filePath="+path,
        },
        success: myRenderSuc,
        err: myRenderErr
    })
    function myRenderSuc(data) {
        var img = new Image();
        img.src = "data:image/jpeg;base64,"+data.resultctx;
        img.style.width = "100%";
        img.style.height = "100%";
        var htmlStr = '<div class="userDataMesgImgWraper addMuchPhoto"><div class="userDataMesgMuchImgDelete" style = "display: none;"></div></div>';
        var htmlJqueryObj = $(htmlStr);
        htmlJqueryObj.append(img);
        $showMediaImg.prepend(htmlJqueryObj);
    }
    function myRenderErr(err){
        alert("获取图片失败！");
    }
}




