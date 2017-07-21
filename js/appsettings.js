
var appSettings = {};
//ip:115.236.160.13    8081
//appSettings.ip = "10.4.102.31";//融资租赁
appSettings.ip = "115.236.160.13";//融资租赁
appSettings.port = "8081";//融资租赁
//appSettings.ip = "10.4.102.56";//黄鹏
//appSettings.port = "8888";//融资租赁
//appSettings.port = "8080";//黄鹏

// appSettings.ip = "10.3.1.141";//现场调式
// appSettings.port = "8081";//现场调式
appSettings.proxy = "http://10.3.1.145"+":"+"8080";
appSettings.uploadUrl ="http://115.236.160.13:8082/fin-ifbp-base/"
//ip 10.3.1.145  8080
//appSettings.requerl = "http://10.4.102.31:8091/fin-ifbp-base/fin/mobile/ocr/Docr";
appSettings.requerl = "http://10.3.1.145:8080/fin-ifbp-base/fin/mobile/ocr/Docr";//ocr识别
appSettings.listRequerl = "http://10.3.1.145:8080/fin-ifbp-base/fin/quote/quotoMgM";
$_ajax = {
    _post: function (obj) {
        var paramsObj = {};
        summer.writeConfig({
            "host": appSettings.ip, //向configure中写入host键值
            "port": appSettings.port //向configure中写入port键值
        });
        paramsObj.viewid = obj.url;
        paramsObj.action = obj.handler;
        paramsObj.params = obj.data;
        paramsObj.header = {
            "Content-Type": "application/x-www-form-urlencoded",
                "User-Agent": "imgfornote"
        }
        paramsObj.callback = obj.success;
        paramsObj.error = obj.err;
        paramsObj.isalerterror = "true",
        summer.callAction(paramsObj);
    },
    _get: function (obj) {
        var paramsObj = {};
        summer.writeConfig({
            "host": appSettings.ip, //向configure中写入host键值
            "port": appSettings.port //向configure中写入port键值
        });
        paramsObj.viewid = obj.url;
        paramsObj.action = obj.handler;
        paramsObj.params = obj.data;
        paramsObj.header = {
            "Content-Type": "application/x-www-form-urlencoded",
            "User-Agent": "imgfornote"
        }
        paramsObj.callback = obj.success;
        paramsObj.error = obj.err;
        summer.callAction(paramsObj);
    },


}
//点击返回上一页
$.fn.extend({
    turnBackLastPage: function (path) {
        $(this).on("click",function () {
            window.location.href = path;
        })
    }
})
$.extend({
    //$obj:图片包裹层  path: 图片路径。  由于后台先返回路径，还要根据路径去下载bas64
    renderIMG: function ($obj,path) {
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
            alert("failed because "+JSON.stringify(err));
        }
    },
    //获取url后面的内容
    getQueryByName:function ( str,name) {
    //var params = decodeURI(location.search);
    var result = str.match(new RegExp("[\?\&]" + name + "=([^\&]+)", "i"));
    if (result == null || result.length < 1) {
        return "";
    }
    return result[1];
},
    returnReg: function (name) {
        var reg =new RegExp("[\?\&]" + name + "=([^\&]+)", "i");
        return reg;
    },
    //字符串转json
    arr2json: function (arr) {
       var obj = {};
       arr.forEach(function (item,index) {
            obj[item.name] = item.value;
       })
        return obj;
    },
    //俩个对象合并
    contactObj: function (oldObj,newObj) {
      for (var key in oldObj){
          newObj[key] = oldObj[key];
      }
      return newObj;
    },
//调原生获取用户的信息
     _callServiceNative: function() {
    var params = {
        "params": {
            "transtype": "request_token"
        },
        "callback": _getTokenInfo,
        "error": function (err) {
            alert(err);
        }
    }
    //调用原生做初始化
    summer.callService("SummerService.gotoNative", params, false);
    function _getTokenInfo(data) {
        var data  = data.result;
        var token = data.token;
        var u_usercode = data.u_usercode;
        try{
            localStorage.removeItem("token");
            localStorage.removeItem("u_usercode");
        }catch (e){
            localStorage.setItem("token",token);
            localStorage.setItem("u_usercode",u_usercode);
        }
    }
},
    //原生跳转
    jumpToPage: function () {
        var params = {
            "params": {
                "transtype": "request_url",
                title: "项目申请",
                startPage: "html/idInformation.html",
                appidversion: "",
            },
            "callback": _getTokenInfo,
            "error": function(err) {
                alert("先下载项目申请到本地！");
            }
        }
        function _getTokenInfo(data) {
            try {
                var data = JSON.parse(data.result);
            } catch (e) {
                var data = data.result
            }
            var url = data.H5file;
            alert(JSON.stringify(url));
            window.location.href = url + "/index.html"
        }
        //调用原生做初始化
        summer.callService("SummerService.gotoNative", params, false);
    },
    setTotastText: function (obj) {
        //先进行初始化
        init();
        var totastContentBottomText = $("#totast .totastContentBottomText");
        var $totast = $("#totast");
        var text = obj.text||"没有获取到数据！";
        totastContentBottomText.html(text);
        $totast.show();
       $("#totast .confirmBtn").on("click",function () {
           $totast.hide();
           offBindEvent();

       })
        $("#closeTotast").on("click",function () {
            $totast.hide();
            offBindEvent();
        })
        //进行初始化，添加html
        function init() {
            if ($("body").find("#totast").length>0){
                return;
            }
            var htmlStr = '<div id="totast" style="display: none">'
                +'<div id="closeTotast"></div>'
                +'<div id="totastContent">'
                +'<div id="totastContentTitle">'
                +'<span class="totastContentTitleText">提示</span>'
                +'</div>'
                +'<div id="totastContentBottom">'
                +'<p class="totastContentBottomText">没有获取到数据！</p>'
            +'<button class="confirmBtn">确定</button>'
                +'</div>'
                +'</div>'
                +'</div>';
            $("body").append(htmlStr);
        }
        //对一些时间进行解绑
        function offBindEvent() {
            $("#totast .confirmBtn").off()
            $("#closeTotast").off();
        }
    },
    _openCamara: function () {
        summer.openCamera({
            callback: function (args) {
                openCamaraOrAlbum(args);
            }
        });
    },
    _openPhotoAlbum: function () {
        summer.openPhotoAlbum({
            callback: function (args) {
                openCamaraOrAlbum(args);
            }
        });
    }
})

function renderIMG($obj,path) {
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
        alert("图片加载失败！");
    }
}
//一些可选的
var selectTypeObj = {};
selectTypeObj.cardTypeObj = {
    "身份证":"0",
    "户口薄":"1",
    "护照":"2",
    "军官证":"3",
    "士兵证":"4",
    "港澳居民来往内地通行证":"5",
    "台湾同胞来往内地通行证":"6",
    "临时身份证":"7",
    "外国人居留证":"8",
    "警官证":"9",
    "香港身份证":"A",
    "澳门身份证":"B",
    "台湾身份证":"C",
    "其他证件":"X",
}
selectTypeObj.mateindustytypeObj = {
    "农林牧渔业":"A",
    "采掘业":"B",
    "制造业":"C",
    "电力燃气及水的生产和供应业":"D",
    "建筑业":"E",
    "交通运输仓储和邮政业":"F",
    "信息传输计算机服务和软件业":"G",
    "批发与零售业":"H",
    "住宿和餐饮业":"I",
    "金融业":"J",
    "房地产业":"K",
    "租赁和商务服务业":"L",
    "科学研究技术服务业和地质勘察业":"M",
    "水利环境和公共设施管理业":"N",
    "居民服务和其他服务业":"O",
    "教育":"P",
    "卫生社会保障和社会福利业":"Q",
    "文化体育和娱乐业":"R",
    "公共管理和社会组织":"S",
    "国籍组织":"T",
    "未知":"Z",
}
selectTypeObj.matedutyObj = {
    "国家机关党群组织企业事业单位负责人":"0",
    "专业技术人员":"1",
    "办事人员和有关人员":"2",
    "商业服务人员":"3",
    "农林牧渔水利上产人员":"4",
    "生产运输设备操作人员及有关人员":"5",
    "军人":"X",
    "不便分类的其他从业人员":"Y",
    "未知":"Z",
}
selectTypeObj.sexObj = {
    "男":"1",
    "女":"2",
    "未知的性别":"0",
    "未说明的性别":"9",
};
selectTypeObj.marriageObj = {
    "未婚":"10",
    "已婚": "20",
    "初婚": "21",
    "再婚": "22",
    "离婚": "40",
    "复婚": "23",
    "丧偶": "30",
    "未说明的婚姻类型":"90"
}
Date.prototype.Format = function (fmt) { //author: meizz
    var o = {
        "M+": this.getMonth() + 1, //月份
        "d+": this.getDate(), //日
        "h+": this.getHours(), //小时
        "m+": this.getMinutes(), //分
        "s+": this.getSeconds(), //秒
        "q+": Math.floor((this.getMonth() + 3) / 3), //季度
        "S": this.getMilliseconds() //毫秒
    };
    if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (var k in o)
        if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
    return fmt;
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


