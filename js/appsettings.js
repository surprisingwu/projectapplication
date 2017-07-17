
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
    }
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

function returnReg(name) {
    var reg = /marriage=([^\&]+)"/
    return reg;
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


