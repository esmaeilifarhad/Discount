var CurrentCID = 0;
var CurrentPID = 0;
var CurrentName = ""
var CurrentDep = ""
var CurrentPLoginName = ""
var today = "";

var portalAddress = _spPageContextInfo.webAbsoluteUrl;

var _ServerBranch = []
var _Utility = []
var Confirmss = []
var _IDServerBranch = 0
//----------------------------

$(document).ready(function () {
    //-----npm initial header Request
    $pnp.setup({
        headers: {
            "Accept": "application/json; odata=verbose"
        }
    });
    //-------------
    CurrentCID = sessionStorage.getItem("CID");
    CurrentPID = sessionStorage.getItem("PID");
    CurrentName = sessionStorage.getItem("PFName");
    CurrentDep = sessionStorage.getItem("DName");
    CurrentPLoginName = sessionStorage.getItem("CurrentPLoginName");

    today = todayShamsy8char()

    ShowBranch();
    // ShowMoavenat();
    // ShowMoavenatTakhsisBudget();
    // ShowShoabTakhsisBudget();

    $(".chosen").chosen();

});
//-----------------------------------------------------------

//تعریف تاییدات
async function ShowBranch() {
    // var x=await GetAllUsers()


    Obj_Discount_ServerBranch.OrderBy = "CurrentBudget"
    Obj_Discount_ServerBranch.Is_Increase = false
    Obj_Discount_ServerBranch.Filter = ""
    _ServerBranch = await get_Records(Obj_Discount_ServerBranch)


    var table = "<table class='table'>"
    table += "<tr>" +
        "<th>ردیف</th>" +
        "<th>نام شعبه</th>" +
        "<th>بودجه</th>" +
        "</tr>"
    for (let index = 0; index < _ServerBranch.length; index++) {
        table += "<tr class='rows'>"
        table += "<td >" + (index + 1) + "</td>"
        table += "<td >" + _ServerBranch[index].Title + "</td>"
        table += "<td >" + SeparateThreeDigits(_ServerBranch[index].CurrentBudget) + "</td>"
        table += "<td><input type='button'  onclick='showDetail(" + _ServerBranch[index].ID + ")' style='background-color:#e4b79e' value='نمایش تاییدکنندگان'/></td>"
        table += "</tr>"
    }
    table += "</table>"
    $("#showCreateBranch table").remove()
    $("#showCreateBranch").append(table)

}
//تخصیص معاونت به شعبه
async function ShowMoavenat() {
    var lstMoavenat = await Get_Moavenat()




    Obj_Discount_ServerBranch.OrderBy = "CurrentBudget"
    Obj_Discount_ServerBranch.Is_Increase = false
    Obj_Discount_ServerBranch.Filter = ""
    var _ServerBranch = await get_Records(Obj_Discount_ServerBranch)

    var table = "<table class='table'>"
    table += "<tr>" +
        "<th>ردیف</th>" +
        "<th>نام شعبه</th>" +
        "<th><input type='button' id='btnSaveMoavenat' onclick='saveTakhsisMoavenat()' value='ذخیره'    style='background-color: rgb(22, 184, 103);margin: 1px;' /></th>" +
        "</tr>"
    for (let index = 0; index < _ServerBranch.length; index++) {
        table += "<tr class='rows' DataId=" + _ServerBranch[index].Id + ">"
        table += "<td >" + (index + 1) + "</td>"
        table += "<td >" + _ServerBranch[index].Title + "</td>"
        table += "<td>"

        var res = "<select class='chosen'><option></option>"
        for (let index2 = 0; index2 < lstMoavenat.length; index2++) {

            var res2 = _ServerBranch.find(x =>
                x.Moavenat.Id ==
                lstMoavenat[index2].Id
                &&
                x.Id == _ServerBranch[index].Id
            );
            if (res2 == undefined) {
                res += "<option value='" + lstMoavenat[index2].Id + "'>" + lstMoavenat[index2].Title + "</option>"
            }
            else {
                res += "<option selected value='" + lstMoavenat[index2].Id + "'>" + lstMoavenat[index2].Title + "</option>"
            }

        }
        res += "</select>"

        table += res + "</td>"
        table += "</tr>"
    }
    table += "</table>"
    $("#showBranchMoavenat table").remove()
    $("#showBranchMoavenat").append(table)
    return new Promise(resolve => {
        resolve("finish")
    })

}
//تخصیص بودجه به معاونت توسط مدیر عامل
async function ShowMoavenatTakhsisBudget() {

    var IsMember = await IsCurrentUserMemberOfGroup(274)
    /*
     تخفیف مازاد - مدیر عامل - گلپخش اول    274
 */
    if (IsMember == false) {
        alert("شما به این بخش دسترسی ندارید")
        return
    }

    var lstMoavenat = await Get_Moavenat()
    _Utility = []
    _Utility = lstMoavenat

    var table = "<table class='table'>"
    table += "<tr>" +
        "<th>ردیف</th>" +
        "<th>نام معاونت</th>" +
        "<th>بودجه جاری</th>" +
        "<th>افزایش بودجه</th>" +
        "<th>تاریخچه تراکنش</th>" +

        "</tr>"
    for (let index = 0; index < lstMoavenat.length; index++) {
        table += "<tr class='rows' DataId=" + lstMoavenat[index].Id + ">"
        table += "<td >" + (index + 1) + "</td>"
        table += "<td >" + lstMoavenat[index].Title + "</td>"
        table += "<td >" + SeparateThreeDigits(lstMoavenat[index].CurrentBudget) + "</td>"
        table += "<td >" +
            "<input type='button' id='btnSaveMoavenat' " +
            "onclick='ShowIncreseDecreseMoavenatBudget(" +
            "{MoavenatTitle:\"" + lstMoavenat[index].Title + "\"," +
            "MoavenatId:" + lstMoavenat[index].Id + "})'" +
            "value='افزایش/کاهش'    style='background-color: green!important;margin: 1px;' />" +
            "</td>"
        table += "<td >" +
            "<input type='button' id='btnSaveMoavenat' " +
            "onclick='ShowMoavenatBudgetLog(" +
            "{MoavenatTitle:\"" + lstMoavenat[index].Title + "\"," +
            "MoavenatId:" + lstMoavenat[index].Id + "})'" +
            "value='تاریخچه'    style='background-color: #2f78e6!important ;margin: 1px;' />" +
            "</td>"
        table += "</tr>"
    }
    table += "</table>"

    $("#showMoavenatTakhsis table").remove()
    $("#showMoavenatTakhsis").append(table)
    return new Promise(resolve => {
        resolve("finish")
    })

}

//تخصیص بودجه به مدیر بازاریابی توسط مدیر عامل
async function ShowModirBaziabyTakhsisBudget() {
    var IsMember = await IsCurrentUserMemberOfGroup(274)
    /*
     تخفیف مازاد - مدیر عامل - گلپخش اول    274
 */
    if (IsMember == false) {
        alert("شما به این بخش دسترسی ندارید")
        return
    }

    Obj_MarketingDirector.OrderBy = "Id"
    Obj_MarketingDirector.Is_Increase = false
    Obj_MarketingDirector.Filter = ""

    var results = await Promise.all([
        get_Records(Obj_MarketingDirector),
    ]);


    var MarketingDirector = results[0]


    var table = "<table class='table'>"
    table += "<tr>" +
        "<th>ردیف</th>" +
        "<th>نام مدیر بازاریابی</th>" +
        "<th>بودجه جاری</th>" +
        "<th>افزایش بودجه</th>" +
        "<th>تاریخچه</th>" +
        "</tr>"
    for (let index = 0; index < MarketingDirector.length; index++) {
        table += "<tr class='rows' DataId=" + MarketingDirector[index].Id + ">"
        table += "<td >" + (index + 1) + "</td>"
        table += "<td >" + MarketingDirector[index].Title + "</td>"
        table += "<td >" + SeparateThreeDigits(MarketingDirector[index].CurrentBudget) + "</td>"
        table += "<td >" +
            "<input type='button' id='btnSaveMoavenat' " +
            "onclick='ShowIncreseDecreseModirBaziabyBudget(" +
            "{MarketingDirectorTitle:\"" + MarketingDirector[index].Title + "\"," +
            "MarketingDirectorId:" + MarketingDirector[index].Id + "})'" +
            "value='افزایش/کاهش'    style='background-color: rgb(22, 184, 103);margin: 1px;' />" +
            "</td>"

        table += "<td >" +
            "<input type='button' id='btnSaveMoavenat' " +
            "onclick='ShowMarketingDirectorBudgetLog(" +
            "{MarketingDirectorTitle:\"" + MarketingDirector[index].Title + "\"," +
            "MarketingDirectorId:" + MarketingDirector[index].Id + "})'" +
            "value='تاریخچه'    style='background-color: #2f78e6!important ;margin: 1px;' />" +
            "</td>"
        table += "<td ><a onclick='test()' href='https://portal.golrang.com/services/discount/Pages/Discount_UserRquest.aspx' target='_blank'>click new page</a></td>"
        table += "</tr>"
    }
    table += "</table>"

    $("#ShowModirBaziabyTakhsisBudget table").remove()
    $("#ShowModirBaziabyTakhsisBudget").append(table)
    return new Promise(resolve => {
        resolve("finish")
    })

}

//تخصیص بودجه به شعب توسط  معاونت
async function ShowShoabTakhsisBudget() {

    /*نمایش بودجه معاونت ها */
    var lstMoavenat = await Get_Moavenat("User/Id eq " + _spPageContextInfo.userId)
    if (lstMoavenat.length == 0) {
        alert("شعبه ای برای این معاونت تخصیص داده نشده است")
        return
    }
    var filter = ""
    for (let index = 0; index < lstMoavenat.length; index++) {
        filter += "(Moavenat/Id eq " + lstMoavenat[index].Id + ") or "
    }
    filter = removeCountChar(filter, 3)



    Obj_Discount_ServerBranch.OrderBy = "CurrentBudget"
    Obj_Discount_ServerBranch.Is_Increase = false
    Obj_Discount_ServerBranch.Filter = filter
    var _ServerBranch = await get_Records(Obj_Discount_ServerBranch)

    var table = "<table class='table'><tr><th>عنوان</th><th>بودجه</th></tr>"
    for (let index = 0; index < lstMoavenat.length; index++) {
        table += "<tr><td>" + lstMoavenat[index].Title + "</td><td>" + SeparateThreeDigits(lstMoavenat[index].CurrentBudget) + "</td></tr>"
    }

    /*
    نمایش تخصیص بودجه به شعب توسط معاونت 
    */

    table += "</table>"
    table += "<table class='table'>"
    table += "<tr>" +
        "<th>ردیف</th>" +
        "<th>نام شعبه</th>" +
        "<th>بودجه جاری</th>" +
        "<th>معاونت</th>" +
        "<th>افزایش بودجه</th>" +
        "<th>تاریخچه</th>" +
        "</tr>"
    for (let index = 0; index < _ServerBranch.length; index++) {
        var MoavenatTitle = "'[" + _ServerBranch[index].Moavenat.Title + "]'"

        table += "<tr class='rows' DataId=" + _ServerBranch[index].Id + ">"
        table += "<td >" + (index + 1) + "</td>"
        table += "<td >" + _ServerBranch[index].Title + "</td>"
        table += "<td >" + SeparateThreeDigits(_ServerBranch[index].CurrentBudget) + "</td>"
        table += "<td >" + _ServerBranch[index].Moavenat.Title + "</td>"

        table += "<td >" +
            "<input type='button'  value='افزایش/کاهش' " +
            "onclick='IncDecShoabtBudget(" +
            "{BranchTitle:\"" + _ServerBranch[index].Title + "\"," +
            "MoavenatTitle:\"" + _ServerBranch[index].Moavenat.Title + "\"," +
            "MoavenatId:" + _ServerBranch[index].Moavenat.Id + "," +
            "ServerBranchId:" + _ServerBranch[index].Id + "})'  style='background-color: rgb(22, 184, 103);margin: 1px;' /></td>"

        table += "<td >" +
            "<input type='button' id='btnSaveMoavenat' " +
            "onclick='ShowShoabBudgetLog(" +
            "{ServerBranchTitle:\"" + _ServerBranch[index].Title + "\"," +
            "ServerBranchId:" + _ServerBranch[index].Id + "})'" +
            "value='تاریخچه'    style='background-color: #2f78e6!important ;margin: 1px;' />" +
            "</td>"
        table += "</tr>"
    }
    table += "</table>"
    $("#showShoabTakhsis table").remove()
    $("#showShoabTakhsis").append(table)
    return new Promise(resolve => {
        resolve("finish")
    })
}
//تخصیص مدیر بازایابی به برند
async function ShowBrandModirBaziaby() {
    Obj_MarketingDirector.OrderBy = "Id"
    Obj_MarketingDirector.Is_Increase = false
    Obj_MarketingDirector.Filter = ""
    // var MarketingDirector = await get_Records(Obj_MarketingDirector)


    Obj_Discount_Brand.OrderBy = "Id"
    Obj_Discount_Brand.Is_Increase = false
    Obj_Discount_Brand.Filter = ""
    //  var Discount_Brand = await get_Records(Obj_Discount_Brand)

    var results = await Promise.all([
        get_Records(Obj_MarketingDirector),
        get_Records(Obj_Discount_Brand),
    ]);


    var MarketingDirector = results[0]
    var Discount_Brand = results[1]




    var table = "<table class='table'>"
    table += "<tr>" +
        "<th>ردیف</th>" +
        "<th>نام برند</th>" +
        "<th><input type='button' id='btnSaveMoavenat' onclick='saveTakhsisBrandToBazaryaby()' value='ذخیره'    style='background-color: rgb(22, 184, 103);margin: 1px;' /></th>" +
        "</tr>"
    for (let index = 0; index < Discount_Brand.length; index++) {
        table += "<tr class='rows' DataId=" + Discount_Brand[index].Id + ">"
        table += "<td >" + (index + 1) + "</td>"
        table += "<td >" + Discount_Brand[index].Title + "</td>"
        table += "<td>"

        var res = "<select class='chosen'><option></option>"
        for (let index2 = 0; index2 < MarketingDirector.length; index2++) {


            if (Discount_Brand[index].MarketingDirector.Id == MarketingDirector[index2].Id) {
                res += "<option selected value='" + MarketingDirector[index2].Id + "'>" + MarketingDirector[index2].Title + "</option>"
            }
            else {
                res += "<option  value='" + MarketingDirector[index2].Id + "'>" + MarketingDirector[index2].Title + "</option>"
            }

        }
        res += "</select>"

        table += res + "</td>"
        table += "</tr>"
    }
    table += "</table>"
    $("#showBrandModirBaziaby table").remove()
    $("#showBrandModirBaziaby").append(table)
    return new Promise(resolve => {
        resolve("finish")
    })


}
async function ShowIncreseDecreseMoavenatBudget(obj) {


    Obj_Discount_Moavenat.ID = obj.MoavenatId
    var Discount_Moavenat = await get_RecordByID(Obj_Discount_Moavenat)


    var Price = await CalculateBudget("(Moavenat/Id eq " + obj.MoavenatId + ")")

    var tagHtml = "<div>" +
        "<table style='margin:0 auto'>" +
        "<tr><td>مقدار بودجه " + obj.MoavenatTitle + "</td><td>" + SeparateThreeDigits(Discount_Moavenat.CurrentBudget) + "</td></tr>" +
        "<tr><td>مقدار به تومان</td><td><input type='text' name='Budget' onkeyup='changeInputToThreeDigit(this)'/></td></tr>" +
        "<tr><td><input type='button' " +
        "onclick='IncreseMoavenatBudget(" +
        "{MoavenatId:" + obj.MoavenatId + "," +
        "MoavenatTitle:\"" + obj.MoavenatTitle + "\"})' " +
        "value='افزایش'    style='background-color: rgb(22, 184, 103);margin: 1px;' /></td>" +
        "<td><input type='button'  onclick='DecreseMoavenatBudget(" + obj.MoavenatId + ")' value='کاهش'    style='background-color: red!important;margin: 1px;' /></td></tr>" +
        "</table></div>"
    $("#takhsisBudget div").remove();
    $("#takhsisBudget").append(tagHtml);

    OpenDialog("#window2")
}
async function ShowIncreseDecreseModirBaziabyBudget(obj) {

    Obj_MarketingDirector.OrderBy = "Id"
    Obj_MarketingDirector.Is_Increase = false
    Obj_MarketingDirector.ID = obj.MarketingDirectorId

    var results = await Promise.all([
        get_RecordByID(Obj_MarketingDirector),
    ]);


    var MarketingDirector = results[0]



    var tagHtml = "<div>" +
        "<table style='margin:0 auto'>" +
        "<tr><td>مقدار بودجه " + obj.MarketingDirectorTitle + "</td><td>" + SeparateThreeDigits(MarketingDirector.CurrentBudget) + "</td></tr>" +
        "<tr><td>مقدار به تومان</td><td><input type='text' name='Budget' onkeyup='changeInputToThreeDigit(this)'/></td></tr>" +
        "<tr><td><input type='button' " +
        "onclick='IncDecModirBaziabyBudget(" +
        "{MarketingDirectorId:" + obj.MarketingDirectorId + ",MarketingDirectorTitle:\""+obj.MarketingDirectorTitle+"\",IncDec:\"Inc\"})' value='افزایش'    style='background-color: rgb(22, 184, 103);margin: 1px;' /></td>" +
        "<td><input type='button'  onclick='IncDecModirBaziabyBudget({MarketingDirectorId:" + obj.MarketingDirectorId + ",MarketingDirectorTitle:\""+obj.MarketingDirectorTitle+"\",IncDec:\"Dec\"})' value='کاهش'    style='background-color: red!important;margin: 1px;' /></td></tr>" +
        "</table></div>"
    $("#takhsisBudget div").remove();
    $("#takhsisBudget").append(tagHtml);

    OpenDialog("#window2")
}
//مشاهده لاگ مربوط به تخصیص بودجه به معاونت توسط مدیر عامل
async function ShowMoavenatBudgetLog(obj) {
    Obj_Discount_BudgetIncrease.OrderBy = "Id"
    Obj_Discount_BudgetIncrease.Is_Increase = true
    Obj_Discount_BudgetIncrease.Filter = "(Moavenat/Id eq " + obj.MoavenatId + ")"



    var results = await Promise.all([
        get_Records(Obj_Discount_BudgetIncrease),
    ]);


    var Discount_BudgetIncrease = results[0]

    var table = "<table class='table'>"
    table += "<tr>" +
        "<th>ردیف</th>" +
        "<th>ریال</th>" +
        "<th>افزایش/کاهش</th>" +
        "<th>توضیحات</th>" +
        "<th>تاریخ</th>" +
        "<th>زمان</th>" +
        "</tr>"
    for (let index = 0; index < Discount_BudgetIncrease.length; index++) {

        table += "<tr class='rows' DataId=" + Discount_BudgetIncrease[index].Id + ">"
        table += "<td >" + (index + 1) + "</td>"
        table += "<td >" + SeparateThreeDigits(Discount_BudgetIncrease[index].BudgetPrice) + "</td>"
        table += "<td >" + (Discount_BudgetIncrease[index].IsIncrease == false ? 'کاهش' : 'افزایش') + "</td>"
        table += "<td >" + Discount_BudgetIncrease[index].dsc + "</td>"
        table += "<td >" + foramtDate(Discount_BudgetIncrease[index].DateCreated) + "</td>"
        table += "<td >" + foramtTime(Discount_BudgetIncrease[index].TimeCreated) + "</td>"
        table += "</tr>"
    }
    table += "</table>"

    $("#showMoavenatTakhsisLog table").remove();
    $("#showMoavenatTakhsisLog").append(table);


}
//مشاهده لاگ مربوط به مدیر بازاریابی
async function ShowMarketingDirectorBudgetLog(obj) {
    Obj_Discount_BudgetIncrease.OrderBy = "Id"
    Obj_Discount_BudgetIncrease.Is_Increase = true
    Obj_Discount_BudgetIncrease.Filter = "(MarketingDirector/Id eq " + obj.MarketingDirectorId + ")"



    var results = await Promise.all([
        get_Records(Obj_Discount_BudgetIncrease),
    ]);


    var Discount_BudgetIncrease = results[0]

    var table = "<table class='table'><caption align='top'>تاریخچه</caption>"

    table += "<tr>" +
        "<th>ردیف</th>" +
        "<th>ریال</th>" +
        "<th>افزایش/کاهش</th>" +
        "<th>توضیحات</th>" +
        "<th>تاریخ</th>" +
        "<th>زمان</th>" +
        "</tr>"
    for (let index = 0; index < Discount_BudgetIncrease.length; index++) {


        table += "<tr class='rows' DataId=" + Discount_BudgetIncrease[index].Id + ">"
        table += "<td >" + (index + 1) + "</td>"
        table += "<td >" + SeparateThreeDigits(Discount_BudgetIncrease[index].BudgetPrice) + "</td>"
        table += "<td >" + (Discount_BudgetIncrease[index].IsIncrease == false ? 'کاهش' : 'افزایش') + "</td>"
        table += "<td >" + Discount_BudgetIncrease[index].dsc + "</td>"
        table += "<td >" + foramtDate(Discount_BudgetIncrease[index].DateCreated) + "</td>"
        table += "<td >" + foramtTime(Discount_BudgetIncrease[index].TimeCreated) + "</td>"
        table += "</tr>"
    }
    table += "</table>"

    $("#showModirBaziabyTakhsisLog table").remove();
    $("#showModirBaziabyTakhsisLog").append(table);


}
async function ShowShoabBudgetLog(obj) {
    Obj_Discount_BudgetIncrease.OrderBy = "Id"
    Obj_Discount_BudgetIncrease.Is_Increase = true
    Obj_Discount_BudgetIncrease.Filter = "(ServerBranch/Id eq " + obj.ServerBranchId + ")"



    var results = await Promise.all([
        get_Records(Obj_Discount_BudgetIncrease),
    ]);


    var Discount_BudgetIncrease = results[0]
    var table = "<table class='table'>"
    table += "<tr>" +
        "<th>ردیف</th>" +
        "<th>ریال</th>" +
        "<th>افزایش/کاهش</th>" +
        "<th>توضیحات</th>" +
        "<th>تاریخ</th>" +
        "<th>زمان</th>" +
        "</tr>"
    for (let index = 0; index < Discount_BudgetIncrease.length; index++) {

        table += "<tr class='rows' DataId=" + Discount_BudgetIncrease[index].Id + ">"
        table += "<td >" + (index + 1) + "</td>"
        table += "<td >" + SeparateThreeDigits(Discount_BudgetIncrease[index].BudgetPrice) + "</td>"
        table += "<td >" + (Discount_BudgetIncrease[index].IsIncrease == false ? 'کاهش' : 'افزایش') + "</td>"
        table += "<td >" + Discount_BudgetIncrease[index].dsc + "</td>"
        table += "<td >" + foramtDate(Discount_BudgetIncrease[index].DateCreated) + "</td>"
        table += "<td >" + foramtTime(Discount_BudgetIncrease[index].TimeCreated) + "</td>"
        table += "</tr>"
    }
    table += "</table>"


    $("#ShowShoabBudgetLog table").remove();
    $("#ShowShoabBudgetLog").append(table);

    OpenDialog("#window3")
}
async function IncDecShoabtBudget(obj) {

    Obj_Discount_Moavenat.ID = obj.MoavenatId
    var Discount_Moavenat = await get_RecordByID(Obj_Discount_Moavenat)

    var tagHtml = "<div>" +
        "<table style='margin:0 auto'>" +
        "<tr><td>مبدا </td><td>" + obj.MoavenatTitle + "</td></tr>" +
        "<tr><td>مقصد </td><td>" + obj.BranchTitle + "</td></tr>" +
        "<tr><td>مقدار بودجه </td><td>" + SeparateThreeDigits(Discount_Moavenat.CurrentBudget) + "</td></tr>" +
        "<tr><td>درصد</td><td><input type='number'  onkeyup='BudgetDarsadToShoab(this,{MoavenatCurrentBudget:"+Discount_Moavenat.CurrentBudget+"})'  name='BudgetDarsad'/></td></tr>" +
        "<tr><td>مقدار به تومان</td><td><input type='text'  onkeyup='changeInputToThreeDigit(this)'  name='Budget'/></td></tr>" +
        "<tr><td><input type='button'  onclick='IncreseShoabBudget({MoavenatId:" + obj.MoavenatId + ",ServerBranchId:" + obj.ServerBranchId + "})' value='افزایش'    style='background-color: rgb(22, 184, 103);margin: 1px;' /></td>" +
        "<td><input type='button'  onclick='DecreseShoabBudget({MoavenatId:" + obj.MoavenatId + ",ServerBranchId:" + obj.ServerBranchId + "})' value='کاهش'    style='background-color: red!important;margin: 1px;' /></td></tr>" +
        "</table></div>"
    $("#takhsisBudget div").remove();
    $("#takhsisBudget").append(tagHtml);

    OpenDialog("#window2")

}
async function save() {

    $('#btnSave').prop('disabled', true);
    $.LoadingOverlay("show");

    Obj_Discount_Confirm.OrderBy = "Id"
    Obj_Discount_Confirm.Is_Increase = false
    Obj_Discount_Confirm.Filter = " (ServerBranch/Id eq " + _IDServerBranch + ")"
    var Discount_Confirm = await get_Records(Obj_Discount_Confirm)


    $("#confirm1 table  .rows").each(async function () {

        var DataId = $(this).attr("DataId")
        var peopleTitle = $(this).find("select option:selected").text();
        var peopleId = $(this).find("select option:selected").val();
        if (peopleId != "") {

            var res2 = Discount_Confirm.find(x =>
                x.ServerBranch.Id ==
                _IDServerBranch
                &&
                x.ConfirmRow.Id ==
                DataId
            );

            if (res2 == undefined) {
                //create
                var obj = { Title: peopleTitle, ServerBranchId: _IDServerBranch, ConfirmRowId: parseInt(DataId), ConfirmatorId: parseInt(peopleId) }

                var createDiscount_Confirm = await create_Record(obj, "Discount_Confirm")

            }
            else {

                //update
                // var res = await update_Confirm({ ID: res2.Id, Title: peopleTitle, ServerBranchId: _IDServerBranch, ConfirmRowId: parseInt(DataId), ConfirmatorId: parseInt(peopleId) })

                var obj = { Title: peopleTitle, ServerBranchId: _IDServerBranch, ConfirmRowId: parseInt(DataId), ConfirmatorId: parseInt(peopleId) }
                var updateDiscount_Confirm = await update_Record(res2.Id, obj, "Discount_Confirm")

            }
        }
    })

    $.LoadingOverlay("hide");
    $("#window").data("kendoWindow").close();
    $('#btnSave').prop('disabled', false);
}
async function saveTakhsisMoavenat() {
    $('#btnSaveMoavenat').prop('disabled', true);
    $.LoadingOverlay("show");

    var countRows = $("#showBranchMoavenat table  .rows").length

    var iRow = 1
    $("#showBranchMoavenat table  .rows").each(async function () {

        var DataId = $(this).attr("DataId")
        var MoavenatTitle = $(this).find("select option:selected").text();
        var MoavenatId = $(this).find("select option:selected").val();

        if (MoavenatId != "") {
            var obj = { MoavenatId: parseInt(MoavenatId) }

            //var ServerBranch = await update_ServerBranch(obj, DataId)
            var updateServerBranch = await update_Record(DataId, obj, "Discount_ServerBranch")

        }
        iRow += 1
        //console.log(iRow)
        if (countRows == iRow) {
            // resolve("finish")
        }
    })

    $.LoadingOverlay("hide");
    // $("#window").data("kendoWindow").close();
    $('#btnSaveMoavenat').prop('disabled', false);
}
async function saveTakhsisBrandToBazaryaby() {
    $('#btnSave').prop('disabled', true);
    $.LoadingOverlay("show");

    //--------------------------------------
    Obj_MarketingDirector.OrderBy = "Id"
    Obj_MarketingDirector.Is_Increase = false
    Obj_MarketingDirector.Filter = ""


    Obj_Discount_Brand.OrderBy = "Id"
    Obj_Discount_Brand.Is_Increase = false
    Obj_Discount_Brand.Filter = ""

    var results = await Promise.all([
        get_Records(Obj_MarketingDirector),
        get_Records(Obj_Discount_Brand),
    ]);


    var MarketingDirector = results[0]
    var Discount_Brand = results[1]
    //----------------------------------------

    $("#showBrandModirBaziaby table  .rows").each(async function () {

        var DataId = $(this).attr("DataId")
        var MarketingDirectorTitle = $(this).find("select option:selected").text();
        var MarketingDirectorId = $(this).find("select option:selected").val();

        if (MarketingDirectorId != "") {
            var res2 = Discount_Brand.find(x =>
                x.MarketingDirector.Id ==
                parseInt(MarketingDirectorId)
                &&
                x.Id == parseInt(DataId)
            );

            if (res2 == undefined) {
                //update
                // var obj = { Title: peopleTitle, ServerBranchId: _IDServerBranch, ConfirmRowId: parseInt(DataId), ConfirmatorId: parseInt(peopleId) }
                // var createDiscount_Confirm = await create_Record(obj, "Discount_Confirm")
                
                var obj = { MarketingDirectorId: parseInt(MarketingDirectorId) }
                var updateDiscount_Brand = await update_Record(parseInt(DataId), obj, "Discount_Brand")
                
            }
            else {

                //update

                //  var obj = {  MarketingDirectorId: parseInt(MarketingDirectorId) }
                // var updateDiscount_Brand = await update_Record(parseInt(DataId), obj, "Discount_Brand")

            }
        }
    })

    $.LoadingOverlay("hide");
   // $("#window").data("kendoWindow").close();
    $('#btnSave').prop('disabled', false);
}
/*افزایش و کاهش بودجه معاونت */
async function IncreseMoavenatBudget(obj) {

    $('#btnSave').prop('disabled', true);
    $.LoadingOverlay("show");

    var Budget = $("#takhsisBudget input[name=Budget]").val();
    Budget = parseInt(removeComma(Budget))

    var obj = {
        dsc: " مقدار " + Budget + " به " + obj.MoavenatTitle + " واریز شد ",
        IsIncrease: true,
        BudgetPrice: Budget,
        Title: "معاونت",
        MoavenatId: obj.MoavenatId,
        DateCreated: today,
        TimeCreated: CurrentTime(),
        UserIncreaserId: _spPageContextInfo.userId
    }
    var createDiscount_BudgetIncrease = await create_Record(obj, "Discount_BudgetIncrease")




    Obj_Discount_Moavenat.ID =  obj.MoavenatId
    var get_Discount_Moavenat = await get_RecordByID(Obj_Discount_Moavenat)

    var price = get_Discount_Moavenat.CurrentBudget + Budget
    var update_Discount_Moavenat = await update_Record( obj.MoavenatId, { CurrentBudget: price }, "Discount_Moavenat")


    var MoavenatTakhsisBudget = await ShowMoavenatTakhsisBudget();
    $('#btnSave').prop('disabled', false);
    $("#window2").data("kendoWindow").close();
    $.LoadingOverlay("hide");



}
async function DecreseMoavenatBudget(ID) {
    $('#btnSave').prop('disabled', true);
    $.LoadingOverlay("show");
    var Budget = parseInt($("#takhsisBudget input[name=Budget]").val());
    Budget = parseInt(removeComma(Budget))

    var obj = { IsIncrease: false, BudgetPrice: Budget, Title: "معاونت", MoavenatId: ID, DateCreated: today, TimeCreated: CurrentTime(), UserIncreaserId: _spPageContextInfo.userId }
    var createDiscount_BudgetIncrease = await create_Record(obj, "Discount_BudgetIncrease")



    Obj_Discount_Moavenat.ID = ID
    var get_Discount_Moavenat = await get_RecordByID(Obj_Discount_Moavenat)

    var price = get_Discount_Moavenat.CurrentBudget - Budget
    var update_Discount_Moavenat = await update_Record(ID, { CurrentBudget: price }, "Discount_Moavenat")



    var MoavenatTakhsisBudget = await ShowMoavenatTakhsisBudget();
    $('#btnSave').prop('disabled', false);
    $("#window2").data("kendoWindow").close();
    $.LoadingOverlay("hide");

}
/*افزایش و کاهش بودجه شعبه */
async function IncreseShoabBudget(obj) {
    // $('#btnSave').prop('disabled', true);
    $.LoadingOverlay("show");

    var Budget = $("#takhsisBudget input[name=Budget]").val();
    Budget = parseInt(removeComma(Budget))

    Obj_Discount_ServerBranch.ID = obj.ServerBranchId
    var get_Discount_ServerBranch = await get_RecordByID(Obj_Discount_ServerBranch)

    Obj_Discount_Moavenat.ID = obj.MoavenatId
    var get_Discount_Moavenat = await get_RecordByID(Obj_Discount_Moavenat)

    var dsc = " مقدار " + Budget + " از " + get_Discount_Moavenat.Title + " به " + get_Discount_ServerBranch.Title + " واریز شد  "
    console.log(dsc)
    var obj1 = {
        dsc: dsc,
        IsIncrease: false,
        BudgetPrice: Budget,
        Title: "شعبه",
        MoavenatId: obj.MoavenatId,
        DateCreated: today,
        TimeCreated: CurrentTime(),
        UserIncreaserId: _spPageContextInfo.userId
    }
    var dsc = " مقدار " + Budget + " از " + get_Discount_Moavenat.Title + " به " + get_Discount_ServerBranch.Title + " واریز شد  "
    console.log(dsc)
    var obj2 = {
        dsc: dsc,
        IsIncrease: true,
        BudgetPrice: Budget,
        Title: "شعبه",
        ServerBranchId: obj.ServerBranchId,
        DateCreated: today, TimeCreated: CurrentTime(),
        UserIncreaserId: _spPageContextInfo.userId
    }

    var createDiscount_BudgetIncrease1 = await create_Record(obj1, "Discount_BudgetIncrease")
    var createDiscount_BudgetIncrease2 = await create_Record(obj2, "Discount_BudgetIncrease")

    /*-----------ویرایش موجودی شعبه----------------- */


    var price = get_Discount_ServerBranch.CurrentBudget + Budget
    var update_Discount_ServerBranch = await update_Record(obj.ServerBranchId, { CurrentBudget: price }, "Discount_ServerBranch")
    /*---------------ویرایش موجودی معاونت------------- */


    var price = get_Discount_Moavenat.CurrentBudget - Budget
    var update_Discount_Moavenat = await update_Record(obj.MoavenatId, { CurrentBudget: price }, "Discount_Moavenat")




    var ShoabTakhsisBudget = await ShowShoabTakhsisBudget();
    // $('#btnSave').prop('disabled', false);
    $("#window2").data("kendoWindow").close();
    $.LoadingOverlay("hide");
}
async function DecreseShoabBudget(obj) {
    // $('#btnSave').prop('disabled', true);
    $.LoadingOverlay("show");

    var Budget = $("#takhsisBudget input[name=Budget]").val();
    Budget = parseInt(removeComma(Budget))

    var obj1 = {
        IsIncrease: true, BudgetPrice: Budget, Title: "شعبه", MoavenatId: obj.MoavenatId,
        DateCreated: today, TimeCreated: CurrentTime(), UserIncreaserId: _spPageContextInfo.userId
    }

    var obj2 = {
        IsIncrease: false, BudgetPrice: Budget, Title: "شعبه", ServerBranchId: obj.ServerBranchId,
        DateCreated: today, TimeCreated: CurrentTime(), UserIncreaserId: _spPageContextInfo.userId
    }

    var createDiscount_BudgetIncrease1 = await create_Record(obj1, "Discount_BudgetIncrease")
    var createDiscount_BudgetIncrease2 = await create_Record(obj2, "Discount_BudgetIncrease")

    /*-----------ویرایش موجودی شعبه----------------- */
    Obj_Discount_ServerBranch.ID = obj.ServerBranchId
    var get_Discount_ServerBranch = await get_RecordByID(Obj_Discount_ServerBranch)

    var price = get_Discount_ServerBranch.CurrentBudget - Budget
    var update_Discount_ServerBranch = await update_Record(obj.ServerBranchId, { CurrentBudget: price }, "Discount_ServerBranch")
    /*---------------ویرایش موجودی معاونت------------- */

    Obj_Discount_Moavenat.ID = obj.MoavenatId
    var get_Discount_Moavenat = await get_RecordByID(Obj_Discount_Moavenat)

    var price = get_Discount_Moavenat.CurrentBudget + Budget
    var update_Discount_Moavenat = await update_Record(obj.MoavenatId, { CurrentBudget: price }, "Discount_Moavenat")


    var ShoabTakhsisBudget = await ShowShoabTakhsisBudget();
    // $('#btnSave').prop('disabled', false);
    $("#window2").data("kendoWindow").close();
    $.LoadingOverlay("hide");
}
/*افزایش و کاهش بودجه بازگانی */
async function IncDecModirBaziabyBudget(obj) {

    $('#btnSave').prop('disabled', true);
    $.LoadingOverlay("show");

    var Budget = $("#takhsisBudget input[name=Budget]").val();
    Budget = parseInt(removeComma(Budget))

    var objBudgetIncrease = {
        dsc:" مقدار "+Budget+" توسط "+_spPageContextInfo.userLoginName+" به "+obj.MarketingDirectorTitle +" اضافه شد ",
        IsIncrease: true,
        BudgetPrice: Budget,
        Title: "مدیر  بازاریبابی",
        MarketingDirectorId: obj.MarketingDirectorId,
        DateCreated: today,
        TimeCreated: CurrentTime(),
        UserIncreaserId: _spPageContextInfo.userId
    }
    // var createDiscount_BudgetIncrease = await create_Record(obj, "Discount_BudgetIncrease")

    Obj_MarketingDirector.ID = obj.MarketingDirectorId
    // var MarketingDirector = await get_RecordByID(Obj_MarketingDirector)


    var results = await Promise.all([
        create_Record(objBudgetIncrease, "Discount_BudgetIncrease"),
        get_RecordByID(Obj_MarketingDirector)
    ]);


    var MarketingDirector = results[1]

    if (obj.IncDec == 'Inc') {
        var price = MarketingDirector.CurrentBudget + Budget
    }
    else if (obj.IncDec == 'Dec') {
        var price = MarketingDirector.CurrentBudget - Budget
    }

    var update_Discount_Moavenat = await update_Record(obj.MarketingDirectorId, { CurrentBudget: price }, "Discount_MarketingDirector")


    ShowModirBaziabyTakhsisBudget()
    // var MoavenatTakhsisBudget = await ShowMoavenatTakhsisBudget();
    $('#btnSave').prop('disabled', false);
    $("#window2").data("kendoWindow").close();
    $.LoadingOverlay("hide");



}
/*----------------- */
async function CalculateBudget(filter) {

    var BudgetIncrease = await Get_BudgetIncrease(filter)
    return new Promise(resolve => {
        // filter = "Moavenat/Id eq " + lstMoavenat[index].Id
        var Price = 0
        for (let j = 0; j < BudgetIncrease.length; j++) {
            if (BudgetIncrease[j].IsIncrease == true) {
                Price += BudgetIncrease[j].BudgetPrice;
            }
            else {
                Price -= BudgetIncrease[j].BudgetPrice;
            }
        }
        resolve(Price)
    })
}
function BudgetDarsadToShoab(thiss,obj){
   var darsad= thiss.value
  var MoavenatCurrentBudget= obj.MoavenatCurrentBudget
var res=((darsad*MoavenatCurrentBudget)/100).toFixed(0)
   $("#takhsisBudget input[name='Budget']").val(res)

}
// function changeInputToThreeDigit(thiss) {
//     var x=removeComma(thiss.value)
//     x = SeparateThreeDigits(x)
//     thiss.value=(x=='NaN'?0:x)
// }
//--------------------------------------------------------------Modal
async function showDetail(ID_IServerBranch) {
    _IDServerBranch = ID_IServerBranch
    /*
255   کاربران تایید کننده تخفیف  
*/
    var users = await GetUsersInGroup(portalAddress, 255)
    Confirmss = []
    // Confirmss = await Get_Confirm("(ServerBranch/Id eq " + _IDServerBranch + ")")

    Obj_Discount_Confirm.OrderBy = "Id"
    Obj_Discount_Confirm.Is_Increase = false
    Obj_Discount_Confirm.Filter = "(ServerBranch/Id eq " + _IDServerBranch + ")"
    var Confirmss = await get_Records(Obj_Discount_Confirm)

    Obj_Discount_ConfirmRows.OrderBy = "Row"
    Obj_Discount_ConfirmRows.Is_Increase = true
    Obj_Discount_ConfirmRows.Filter = ""
    var Discount_ConfirmRows = await get_Records(Obj_Discount_ConfirmRows)



    Obj_Discount_ServerBranch.OrderBy = "Id"
    Obj_Discount_ServerBranch.Is_Increase = false
    Obj_Discount_ServerBranch.ID = ID_IServerBranch
    var Discount_ServerBranch = await get_RecordByID(Obj_Discount_ServerBranch)


    if (Discount_ServerBranch.Moavenat.Id != undefined) {
        Obj_Discount_Moavenat.ID = Discount_ServerBranch.Moavenat.Id
        var Discount_Moavenat = await get_RecordByID(Obj_Discount_Moavenat)
    }


    var table = "<table class='table'>"
    table += "<tr>" +
        "<th>ردیف</th>" +
        "<th>نام شعبه</th>" +
        "<th>تایید کننده</th>" +
        "</tr>"
    for (let index = 0; index < Discount_ConfirmRows.length; index++) {
        table += "<tr class='rows' dataId=" + Discount_ConfirmRows[index].Id + ">"
        table += "<td >" + (index + 1) + "</td>"
        table += "<td >" + Discount_ConfirmRows[index].Title + "</td>"
        table += "<td>"

        if (Discount_ConfirmRows[index].Row == 3 || Discount_ConfirmRows[index].Row == 2 || Discount_ConfirmRows[index].Row == 6) {
            var res = "<select disabled  class='chosen'><option></option>"
        }
        else {
            var res = "<select  class='chosen'><option></option>"
        }

        for (let index2 = 0; index2 < users.length; index2++) {
            var res2 = Confirmss.find(x =>
                x.Confirmator.Id ==
                users[index2].Id
                &&
                x.ConfirmRow.Id ==
                Discount_ConfirmRows[index].Id
            );

            if (res2 == undefined) {
                res += "<option  value='" + users[index2].Id + "'>" + splitString(users[index2].Title, "(")[0] + "</option>"
            }
            else {
                res += "<option selected value='" + users[index2].Id + "'>" + splitString(users[index2].Title, "(")[0] + "</option>"
            }

        }
        if (Discount_ConfirmRows[index].Row == 2) {
            if (Discount_ServerBranch.Moavenat.Id != undefined) {
                res += "<option selected value='" + Discount_Moavenat.User.Id + "'>" + splitString(Discount_Moavenat.User.Title, "(")[0] + "</option>"
            }
            else {

            }

        }
        res += "</select>"

        table += res + "</td>"
        table += "</tr>"
    }
    table += "</table>"
    $("#confirm1 table").remove()
    $("#confirm1").append(table)


    OpenDialog("#window");
}
function ShowMessage(arrayMessage) {
    var table = "<table class='table table-bordered'>"
    for (let index = 0; index < arrayMessage.length; index++) {
        table += "<tr><td>" + (index + 1) + "</td><td>" + arrayMessage[index].message + "</td></tr>"
    }
    table += "</table>"
    $("#ModaDetail .modal-body table").remove()
    $("#ModaDetail .modal-body").append(table)
    $("#ModaDetail").modal();

    $.LoadingOverlay("hide");
    $('#btnSave').prop('disabled', false);
}
//--------------------------------------------------------------------CRUD
function Get_Confirm(filter) {
    return new Promise(resolve => {
        $pnp.sp.web.lists.
            getByTitle("Discount_Confirm").
            items.
            select("ConfirmRow/Title,ConfirmRow/Id,ServerBranch/Title,ServerBranch/Id,Confirmator/Title,Confirmator/Id,Id,Title").
            filter(filter).
            expand("ConfirmRow,ServerBranch,Confirmator").
            get().
            then(function (items) {
                resolve(items);
            });
    });

}
function Get_Discount_ConfirmRows() {
    return new Promise(resolve => {
        $pnp.sp.web.lists.
            getByTitle("Discount_ConfirmRows").
            items.select().
            orderBy("Row", true).
            get().
            then(function (items) {
                resolve(items);
            });
    });
}
function Get_UsersBranch() {

    return new Promise(resolve => {
        $pnp.sp.web.lists.
            getByTitle("Discount_UsersBranch").
            items.
            select("User/Title,User/Id,Branch/Title,Branch/Id,Id,Title").
            filter("(User/Id eq " + _spPageContextInfo.userId + ")").
            expand("User,Branch").
            get().
            then(function (items) {
                resolve(items);
            });
    });

}
function Get_BudgetIncrease(filter) {
    if (filter == undefined) {
        filter = ""
    }
    return new Promise(resolve => {
        $pnp.sp.web.lists.
            getByTitle("Discount_BudgetIncrease").
            items.
            select("Moavenat/Id,Moavenat/Title,ServerBranch/Id,ServerBranch/Title,UsersBranch/Title,UsersBranch/Id,UsersBranch/IdUser,UserIncreaser/Title,UserIncreaser/Id,Id,Title,BudgetPrice,IsIncrease,DateCreated").
            filter(filter).
            expand("UsersBranch,UserIncreaser,Moavenat,ServerBranch").
            get().
            then(function (items) {
                resolve(items);
            });
    });
}
function Get_Detail_DiscountVal() {

    return new Promise(resolve => {
        $pnp.sp.web.lists.
            getByTitle("Discount_Detail").
            items.
            select("MasterId/IdUser,MasterId/SaleDocCode,MasterId/Id,MasterId/Title,Id,Title,DiscountVal,MasterId/DateCreated,Famount,UnitPrice").
            filter("(MasterId/IdUser eq " + _spPageContextInfo.userId + ")").
            expand("MasterId").
            get().
            then(function (items) {

                resolve(items);
            }).catch(error => {
                console.log(error)
                resolve(error);
            });
    });
}
function Get_Master_IsDuplicate(SaleDocCode) {

    return new Promise(resolve => {
        $pnp.sp.web.lists.
            getByTitle("Discount_Master").
            items.
            // select("User/Title,User/Id,Branch/Title,Branch/Id,Id,Title").
            filter("(SaleDocCode eq " + SaleDocCode + ")").
            // expand("User,Branch").
            get().
            then(function (items) {
                resolve(items);
            });
    });

}
function Get_Moavenat(filter) {
    if (filter == undefined) {
        filter = ""
    }

    return new Promise(resolve => {
        $pnp.sp.web.lists.
            getByTitle("Discount_Moavenat").
            items.
            select("User/Id,User/Title,CurrentBudget,Id,Title").
            filter(filter).
            expand("User").
            //orderBy("Row", true).
            get().
            then(function (items) {
                resolve(items);
            });
    });
}
//Update
function update_UsersBranch(Record) {

    return new Promise(resolve => {
        var list = $pnp.sp.web.lists.getByTitle("Discount_UsersBranch");
        list.items.getById(Record.ID).update({
            Title: Record.LoginTitle,
            UserId: Record.LoginName,
            BranchId: Record.Branch
        }).then(function (item) {

            resolve(item);
        });
    });
}
function update_Confirm(Record) {

    return new Promise(resolve => {
        var list = $pnp.sp.web.lists.getByTitle("Discount_Confirm");
        list.items.getById(Record.ID).update({
            //Title: Record.Title,
            //ServerBranchId: Record.ServerBranchId,
            //ConfirmRowId: Record.ConfirmRowId,
            ConfirmatorId: Record.ConfirmatorId
        }).then(function (item) {
            resolve(item);
        });
    });
}
function update_ServerBranch(Record, RecordID) {

    return new Promise(resolve => {
        var list = $pnp.sp.web.lists.getByTitle("Discount_ServerBranch");
        list.items.getById(RecordID).update(Record).then(function (item) {
            resolve(item);
        });
    });
}
function update_Moavenat(Record) {
    return new Promise(resolve => {
        var list = $pnp.sp.web.lists.getByTitle("Discount_Moavenat");
        list.items.getById(Record.ID).update({
            CurrentBudget: Record.CurrentBudget
        }).then(function (item) {
            resolve(item);
        });
    });
}
//-------------------------------------
function OpenDialog(windows) {
    var myWindow = $(windows),
        undo = $("#newRecord");
    myWindow.kendoWindow({
        width: "1200px",
        title: "کارتابل تاییدات",
        visible: false,
        actions: [
            // "Pin",
            // "Minimize",
            //"Maximize",
            "Close"
        ],
        close: function () {
            undo.fadeIn();
        }
    }).data("kendoWindow").center().open();
}
//--------------------------------------------------------------------web services
function serviceDiscount(Factor) {
    return new Promise(resolve => {
        var serviceURL = "https://portal.golrang.com/_vti_bin/SPService.svc/DiscountData"
        var request = { SaleDocCode: Factor, IpServer: "192.168.10.201", DB: "ISS" }
        // {"CID":"50","Date":"980919","PortalReqHeaderID":"984"}
        $.ajax({
            type: "POST",
            url: serviceURL,
            contentType: "application/json; charset=utf-8",
            xhrFields: {
                'withCredentials': true
            },
            dataType: "json",
            data: JSON.stringify(request),
            //processData: false,
            success: function (data) {

                resolve(data);

            },
            error: function (a) {
                console.log(a);
            }
        });
    })
}


