/**
 * Created by 巫运廷 on 2017/6/24.
 */
document.addEventListener("deviceready", function () {
    document.addEventListener("backbutton", function () {
        try {
            localStorage.removeItem("navIndex");
        } catch (e) {
        }
        window.location.href = "userMesg.html";
    }, false);
}, false);
summerready  = function () {
    $(".turnBackLastPage").turnBackLastPage("userMesg.html");
    $(".headerOperation").turnBackLastPage("addBankCard.html");
    var data = JSON.parse(localStorage.getItem("data"));
    var arrMesg = data.probank_id;
    var dataArr = returnArr(arrMesg);

    var arrText = doT.template($("#bankCardListWraper").text());
    $(".bankCardListWraper").html(arrText(dataArr));
}
function returnArr(arr) {
    if (arr.length === 0) {
        return;
    }
    var dataArr = [];
    arr.forEach(function (item,index) {
        var obj = {};
        obj.bankName = item.owned||"空";
        obj.bankCardType = item.account_type||"空";
        obj.bankCardNum = item.account||"空";
        dataArr.push(obj)
    })
    return   dataArr
}
