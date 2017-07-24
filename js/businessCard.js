/**
 * Created by 巫运廷 on 2017/6/22.
 */
var busyOverlay;
var scrollTopNum;
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
	if (id === null || id === "undefined") {
		alert("请先新增个人档案！")
		return;
	}
	$(".turnBackLastPage").turnBackLastPage("userMesg.html");
	//点击图片框，打开相机进行拍照，并展示和发送到后台进行识别。识别的信息展示到页面
	$(".photoContainer").on("click", function() {
		bodyOverfloawHidden();
		$(".takePhotosTypeWraper").show();
	})
	//日常半身照 点击屏幕其他地方,关闭弹出层
	$(".closeTakePhotosTypeWraper").on("click", function() {
		bodyOverfloawAuto();
		$(".takePhotosTypeWraper").hide();
	})
	//日常半身照   点击取消按钮，关闭弹出层
	$(".selectTakePhotosTypeCancelBtn").on("click", function() {
		bodyOverfloawAuto();
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
	//点击保存按钮    信息提交到后台
	$(".headerOperation").on("click", function() {
		var telVal = $("#telPhoneNum").val().trim();
		var postVal = $("#postalcode").val().trim();
		var token = localStorage.getItem("token");
		var u_usercode = localStorage.getItem("u_usercode");
		//手机号校验正则 13，13，15，17，18 开头  11位
		var telTestReg = /^1[3|4|5|7|8][0-9]{9}$/
		//右边校验规则   ,六位  不超过六位就行
		var msTestReg = /^[0-9][0-9]{5}$/
		if (telVal === "") {
			alert("请输入您的手机号！");
			return
		}
		if (!telTestReg.test(telVal)) {
			alert("您输入的和手机号不存在！");
			return;
		}
		if ($("#mailingAddress").val().trim() === "") {
			alert("请输入您的通讯地址！");
			return
		}
		if (postVal) {
			if (!msTestReg.test(postVal)) {
				alert("您输入的邮编不存在！")
				return;
			}
		}
		var jsonData = $("#userMesgWraper").serialize();
		jsonData = decodeURI(jsonData);
		jsonData = jsonData.replace(/=&/g, "=undefined&").replace(/=$/, "=undefined");
		jsonData += "&id=" + id;
		jsonData += "&token=" + token + "&u_usercode=" + u_usercode;
		$_ajax._post({
			url : "com.yyjr.ifbp.fin.controller.IFBPFINController",
			handler : "handler",
			data : {
				"transtype" : "urlparamrequest",
				"requrl" : appSettings.proxy + "/fin-ifbp-base/fin/mobile/user/addContactInfo",
				"reqmethod" : "POST",
				"reqparam" : jsonData,
			},
			success : "myconfirmcallback()",
			err : "myconfirmerror()"
		})
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
	bodyOverfloawAuto();
	if (data.success === "false") {
		hideWaiting()
		alert("识别失败！")
		return;
	}
	var data = data.data;
	if (data === null || data == undefined) {
		hideWaiting()
		alert("识别失败！")
		return;
	}
	if (data == undefined || data == "") {
		hideWaiting()
		alert(您拍摄的照片不对);
		return;
	}
	$("#telPhoneNum").val(data.mobile);
	if (data.address) {
		$("#mailingAddress").val(data.address);
	}
	if (data.email) {
		$("#emailAdress").val(data.email);
	}
	if (data.mobile) {
		$("#telPhoneNum").val(data.mobile);
	}
	hideWaiting();
}

function myerror(error) {
	hideWaiting();
	alert("识别失败，请重新识别！");
}

function myconfirmcallback(data) {
	window.location.href = "userMesg.html";
}

function myconfirmerror(e) {
	alert("保存失败！")
}

//打开相机 打开相册的逻辑
function openCamaraOrAlbum(args) {
	var $photoContainer = $(".photoContainer");
	if ($photoContainer.find("img").length > 0) {
		$photoContainer.html("");
	}
	showWaiting();
	var imgPath = args;
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
			"reqparam" : "typeId=20&img=" + imgPath,
		},
		success : mycallback,
		err : myerror
	})
	$(".takePhotosTypeWraper").hide();
}

//设置body样式为overflow：hiddem
function bodyOverfloawHidden() {
	scrollTopNum = $("body").scrollTop();
	$("body").css({
		position : "fixed",
		overflow : "hidden",
	})
}

//还原body的样式为overflow：auto
function bodyOverfloawAuto() {
	$("body").css({
		overflow : "auto",
		position : "relative",
	})
	$("body").scrollTop(scrollTopNum)
}

