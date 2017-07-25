/**
 * Created by 巫运廷 on 2017/6/22.
 */
var busyOverlay;
var flag = false;
var mateidimg_code = undefined;
var scrollTopNum;
//证件类型，  选择
$(function() {
	// var curr = new Date().getFullYear();
	var opt = {
		'date' : {
			preset : 'date'
		},
		'select' : {
			preset : 'select'
		}
	};
	$('#select1').scroller('destroy').scroller($.extend(opt['select'], {
		theme : "ios7",
		mode : "scroller",
		display : "bottom",
		animate : ""
	}));
});
//职业类型，  选择
$(function() {
	// var curr = new Date().getFullYear();
	var opt = {
		'date' : {
			preset : 'date'
		},
		'select' : {
			preset : 'select'
		}
	};
	$('#select3').scroller('destroy').scroller($.extend(opt['select'], {
		theme : "ios7",
		mode : "scroller",
		display : "bottom",
		animate : ""
	}));
});
//行业类型，  选择
$(function() {
	// var curr = new Date().getFullYear();
	var opt = {
		'date' : {
			preset : 'date'
		},
		'select' : {
			preset : 'select'
		}
	};
	$('#select2').scroller('destroy').scroller($.extend(opt['select'], {
		theme : "ios7",
		mode : "scroller",
		display : "bottom",
		animate : ""
	}));
});
//性别类型，  选择
$(function() {
	// var curr = new Date().getFullYear();
	var opt = {
		'date' : {
			preset : 'date'
		},
		'select' : {
			preset : 'select'
		}
	};
	$('#select4').scroller('destroy').scroller($.extend(opt['select'], {
		theme : "ios7",
		mode : "scroller",
		display : "bottom",
		animate : ""
	}));
});
$(function() {
	$('.scroller-date').scroller('destroy').scroller({
		preset : 'date',
		theme : "ios7",
		mode : "scroller",
		display : "bottom",
		animate : ""
	});
});
summerready = function() {
	//点击返回按钮，返回上一级
	var quote_id = localStorage.getItem("quote_id");
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
		bodyOverfloawAuto();
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
		bodyOverfloawAuto();
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
	//点击保存按钮的逻辑
	$(".headerOperation").on("click", function() {
		var telPhoneNumTest = $("#telPhoneNum").val().trim();
		var telTestReg = /^1[3|4|5|7|8][0-9]{9}$/;
		var token = localStorage.getItem("token");
		var u_usercode = localStorage.getItem("u_usercode");
		if ($("#userName").val().trim() === "") {
			alert("请输入您的姓名！");
			return
		}
		if ($("#userNation").val().trim() === "") {
			alert("请输入您的民族！");
			return
		}
		if ($("#birthDate").val().trim() === "") {
			alert("请输入您的出生日期！");
			return
		}
		if ($("#cardNum").val().trim() === "") {
			alert("请输入您的证件号码！");
			return
		}
		if ($("#userAddress").val().trim() === "") {
			alert("请输入您的住址！");
			return
		}
		if (telPhoneNumTest === "") {
			alert("请输入您的手机号码！");
			return
		}
		var cardNumTest = $("#cardNum").val().trim();
		if (cardNumTest.length !== 18) {
			alert("请输入正确的身份证号码！")
			return
		}
		if (!telTestReg.test(telPhoneNumTest)) {
			alert("您输入的手机号码不存在！");
			return;
		}
		var jsonData = $("#userMesgWraper").serialize();
		var matecertypeVal = document.getElementById("select1_dummy").value;
		var mateindustytypeVal = document.getElementById("select2_dummy").value;
		var matedutyVal = document.getElementById("select3_dummy").value;
		var matesexVal = document.getElementById("select4_dummy").value;
		jsonData = decodeURI(jsonData)
		jsonData = jsonData.replace(/=&/g, "=undefined&").replace(/=$/, "=undefined");
		jsonData += "&document_type=" + selectTypeObj.cardTypeObj[matecertypeVal];
		jsonData += "&industry_type=" + selectTypeObj.mateindustytypeObj[mateindustytypeVal];
		jsonData += "&position=" + selectTypeObj.matedutyObj[matedutyVal];
		jsonData += "&sex=" + selectTypeObj.sexObj[matesexVal];
		jsonData += "&id_img=" + mateidimg_code + "&pk_quote_h=" + quote_id;
        jsonData += "&token="+token+"&u_usercode="+u_usercode;
		$_ajax._post({
			url : "com.yyjr.ifbp.fin.controller.IFBPFINController",
			handler : "handler",
			data : {
				"transtype" : "urlparamrequest",
				"requrl" : appSettings.proxy + "/fin-ifbp-base/fin/guarantee/saveGuarantes",
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
	if (data.name == "" || data.sex == "" || data.nation == "" || data.birthday == "") {
		hideWaiting()
		alert("请核查您上传的照片!")
		return;
	}
	$("#userName").val(data.name || "");
	$("#select4_dummy").val(data.sex || "");
	$("#userNation").val(data.nation || "");
	$("#birthDate").val(data.birthday || "");
	$("#userAddress").val(data.birth_address || "");
	$("#cardNum").val(data.document_id || "");
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
	mateidimg_code = imgPath;
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
			"reqparam" : "typeId=2&img=" + mateidimg_code,
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
