var busyOverlay;
var flag = false;
var show_img_code = undefined;
document.addEventListener("deviceready", function() {
	document.addEventListener("backbutton", function() {
		try {
			localStorage.removeItem("navIndex");
		} catch (e) {
		}
		window.location.href = "userMesg.html";
	}, false);
}, false);
summerready = function() {
	//点击返回按钮，返回上一级
	try {
		var id = localStorage.getItem("id")
	} catch (e) {

	}
	$(".turnBackLastPage").turnBackLastPage("userMesg.html");
	//点击图片框，打开相机进行拍照，并展示和发送到后台进行识别。识别的信息展示到页面
	$(".photoContainer").on("click", function() {
		$(".takePhotosTypeWraper").show();

	})
	//日常半身照 点击屏幕其他地方,关闭弹出层
	$(".closeTakePhotosTypeWraper").on("click", function() {
		$(".takePhotosTypeWraper").hide();
	})
	//日常半身照   点击取消按钮，关闭弹出层
	$(".selectTakePhotosTypeCancelBtn").on("click", function() {
		$(".takePhotosTypeWraper").hide();
	})
	//打开相机的逻辑，回复body的样式，关闭弹出层
	$("#openCamaraDiv").on("click", function() {
		var params = {
			"params" : {
				"transtype" : "takephote",
			},
			"callback" : _getTokenInfo,
			"error" : function(err) {
				alert("打开相机失败！");
			}
		}

		function _getTokenInfo(data) {
			try {
				var data = JSON.parse(data.result)
			} catch(e) {
				var data = data.result
			}
			base64str = data.photostring;
			openCamaraOrAlbum(base64str);
		}

		//调用原生做初始化
		summer.callService("SummerService.gotoNative", params, false);
	})
	//点击打开相册的逻辑，回复body的样式，关闭弹出层
	$("#openAlbumDiv").on("click", function() {
		var params = {
			"params" : {
				"transtype" : "openalbum",
			},
			"callback" : _getTokenInfo,
			"error" : function(err) {
				alert("打开相册失败！");
			}
		}
		function _getTokenInfo(data) {
			try {
				var data = JSON.parse(data.result)
			} catch(e) {
				var data = data.result
			}
			base64str = data.photostring;
			openCamaraOrAlbum(base64str);
		}

		//调用原生做初始化
		summer.callService("SummerService.gotoNative", params, false);
	})
	$(".headerOperation").on("click", function() {
		var token = localStorage.getItem("token");
		var u_usercode = localStorage.getItem("u_usercode");
		if ($("#cardUser").val().trim() === "") {
			alert("请输入持卡人的名称！");
			return
		}
		if ($("#bankCardNum").val().trim() === "") {
			alert("请输入银行帐号！");
			return
		}
		if ($("#accountType").val().trim() === "") {
			alert("请输入银行卡号类型！");
			return
		}
		var jsonData = $("#userMesgWraper").serialize();
		jsonData = decodeURI(jsonData);
		jsonData = jsonData.replace(/=&/g, "=undefined&").replace(/=$/, "=undefined");
		jsonData += "&show_img_code=" + show_img_code + "&probank_id=" + id;
		$_ajax._post({
			url : "com.yyjr.ifbp.fin.controller.IFBPFINController",
			handler : "handler",
			data : {
				"transtype" : "urlparamrequest",
				"requrl" : appSettings.proxy + "/fin-ifbp-base/fin/mobile/user/addBankInfo",
				"reqmethod" : "POST",
				"reqparam" : jsonData,
			},
			success : myconfirmcallback,
			err : myconfirmerror
		})
		function myconfirmcallback(data) {
			window.location.href = "userMesg.html";
		}

		function myconfirmerror(e) {
			alert("保存失败！")
		}

	})
}
//展示遮罩层
function showWaiting() {
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
	if (busyOverlay) {
		busyOverlay.remove();
		busyOverlay = null;
	}
}

function mycallback(data) {
	if (data.success === "false") {
		hideWaiting();
		alert("识别失败！")
		return;
	}
	var data = data.data;
	if (data === null || data == undefined) {
		hideWaiting();
		alert("识别失败！")
		return;
	}
	if (data.account_type == "" || data.owned == "" || data.account == "") {
		hideWaiting();
		alert("请核查您上传的照片!")
		return;
	}
	$("#accountType").val(data.account_type || "");
	$("#bankCardNum").val(data.account || "");
	$("#totalBankBig").val(data.owned || "");
	hideWaiting();
}

function myerror(error) {
	hideWaiting()
	alert("识别失败，请重新识别！");
}

//半身照和ocr识别都走的这个逻辑
function openCamaraOrAlbum(args) {
	var $photoContainer = $(".photoContainer");
	if ($photoContainer.find("img").length > 0) {
		$photoContainer.html("");
	}
	showWaiting();
	var imgPath = args;
	show_img_code = imgPath;
	var image = new Image();
	image.onload = function() {
		$._compressImg(image, imgPath, $photoContainer);
	}
	image.src = "data:image/jpeg;base64," + imgPath;
	$_ajax._post({
		url : "com.yyjr.ifbp.fin.controller.IFBPFINController",
		handler : "handler",
		data : {
			"transtype" : "urlparamrequest",
			"requrl" : appSettings.requerl,
			"reqmethod" : "POST",
			"reqparam" : "typeId=17&img=" + show_img_code,
		},
		success : mycallback,
		err : myerror
	})
	$(".takePhotosTypeWraper").hide();
}

