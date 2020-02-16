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


const Obj_Discount_ConfirmRows = {
    NameList: "Discount_ConfirmRows",
    Select: "Id,Title,Row",
    Filter: "",
    Expand: "",
    OrderBy: "Id",
    Is_Increase: true
}

const Obj_Discount_Confirm = {
    NameList: "Discount_Confirm",
    Select: "Confirmator/Title,Confirmator/Id,ServerBranch/Title,ServerBranch/Id,ConfirmRow/Title,ConfirmRow/Id,ConfirmRow/Row,Id,Title",
    Filter: "",
    Expand: "Confirmator,ServerBranch,ConfirmRow",
    OrderBy: "Moavenat/Title",
    Is_Increase: true
}
const Obj_Discount_ServerBranch = {
    NameList: "Discount_ServerBranch",
    Select: "Moavenat/Title,Moavenat/Id,Id,Title,IP_Server,TitleBranch,DataBaseName,CurrentBudget",
    Filter: "",
    Expand: "Moavenat",
    OrderBy: "Moavenat/Title",
    Is_Increase: true
}

const Obj_Discount_Moavenat = {
    NameList: "Discount_Moavenat",
    Select: "User/Title,User/Id,Id,Title,CurrentBudget",
    Filter: "",
    Expand: "User",
    OrderBy: "CurrentBudget",
    Is_Increase: true
}

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
    var lstMoavenat = await Get_Moavenat()
    _Utility = []
    _Utility = lstMoavenat

    var table = "<table class='table'>"
    table += "<tr>" +
        "<th>ردیف</th>" +
        "<th>نام معاونت</th>" +
        "<th>بودجه جاری</th>" +
        "<th>افزایش بودجه</th>" +
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
            "value='افزایش/کاهش'    style='background-color: rgb(22, 184, 103);margin: 1px;' />" +
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

        table += "</tr>"
    }
    table += "</table>"
    $("#showShoabTakhsis table").remove()
    $("#showShoabTakhsis").append(table)
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
        "<tr><td><input type='button'  onclick='IncreseMoavenatBudget(" + obj.MoavenatId + ")' value='افزایش'    style='background-color: rgb(22, 184, 103);margin: 1px;' /></td>" +
        "<td><input type='button'  onclick='DecreseMoavenatBudget(" + obj.MoavenatId + ")' value='کاهش'    style='background-color: red!important;margin: 1px;' /></td></tr>" +
        "</table></div>"
    $("#takhsisBudget div").remove();
    $("#takhsisBudget").append(tagHtml);

    OpenDialog("#window2")
}
async function IncDecShoabtBudget(obj) {
    Obj_Discount_Moavenat.ID = obj.MoavenatId
    var Discount_Moavenat = await get_RecordByID(Obj_Discount_Moavenat)

    var tagHtml = "<div>" +
        "<table style='margin:0 auto'>" +
        "<tr><td>مبدا </td><td>" + obj.MoavenatTitle + "</td></tr>" +
        "<tr><td>مقصد </td><td>" + obj.BranchTitle + "</td></tr>" +
        "<tr><td>مقدار بودجه </td><td>" + SeparateThreeDigits(Discount_Moavenat.CurrentBudget) + "</td></tr>" +
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


    $("#confirm1 table  .rows").each(async function () {

        var DataId = $(this).attr("DataId")
        var peopleTitle = $(this).find("select option:selected").text();
        var peopleId = $(this).find("select option:selected").val();
        if (peopleId != "") {

            var res2 = Confirmss.find(x =>
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
/*افزایش و کاهش بودجه معاونت */
async function IncreseMoavenatBudget(ID) {
    
    $('#btnSave').prop('disabled', true);
    $.LoadingOverlay("show");

    var Budget = $("#takhsisBudget input[name=Budget]").val();
    Budget=parseInt(removeComma(Budget))
    
    var obj = { IsIncrease: true, BudgetPrice: Budget, Title: "معاونت", MoavenatId: ID, DateCreated: today, TimeCreated: CurrentTime(), UserIncreaserId: _spPageContextInfo.userId }
    var createDiscount_BudgetIncrease = await create_Record(obj, "Discount_BudgetIncrease")




    Obj_Discount_Moavenat.ID = ID
    var get_Discount_Moavenat = await get_RecordByID(Obj_Discount_Moavenat)

    var price = get_Discount_Moavenat.CurrentBudget + Budget
    var update_Discount_Moavenat = await update_Record(ID, { CurrentBudget: price }, "Discount_Moavenat")


    var MoavenatTakhsisBudget = await ShowMoavenatTakhsisBudget();
    $('#btnSave').prop('disabled', false);
    $("#window2").data("kendoWindow").close();
    $.LoadingOverlay("hide");



}
async function DecreseMoavenatBudget(ID) {
    $('#btnSave').prop('disabled', true);
    $.LoadingOverlay("show");
    var Budget = parseInt($("#takhsisBudget input[name=Budget]").val());
    Budget=parseInt(removeComma(Budget))

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
    Budget=parseInt(removeComma(Budget))

    var obj1 = {
        IsIncrease: false, BudgetPrice: Budget, Title: "شعبه", MoavenatId: obj.MoavenatId,
        DateCreated: today, TimeCreated: CurrentTime(), UserIncreaserId: _spPageContextInfo.userId
    }

    var obj2 = {
        IsIncrease: true, BudgetPrice: Budget, Title: "شعبه", ServerBranchId: obj.ServerBranchId,
        DateCreated: today, TimeCreated: CurrentTime(), UserIncreaserId: _spPageContextInfo.userId
    }

    var createDiscount_BudgetIncrease1 = await create_Record(obj1, "Discount_BudgetIncrease")
    var createDiscount_BudgetIncrease2 = await create_Record(obj2, "Discount_BudgetIncrease")

    /*-----------ویرایش موجودی شعبه----------------- */
    Obj_Discount_ServerBranch.ID = obj.ServerBranchId
    var get_Discount_ServerBranch = await get_RecordByID(Obj_Discount_ServerBranch)

    var price = get_Discount_ServerBranch.CurrentBudget + Budget
    var update_Discount_ServerBranch = await update_Record(obj.ServerBranchId, { CurrentBudget: price }, "Discount_ServerBranch")
    /*---------------ویرایش موجودی معاونت------------- */
    Obj_Discount_Moavenat.ID = obj.MoavenatId
    var get_Discount_Moavenat = await get_RecordByID(Obj_Discount_Moavenat)

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
  Budget=parseInt(removeComma(Budget))

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
    var ConfirmRowss = await get_Records(Obj_Discount_ConfirmRows)





    // var ConfirmRowss = await Get_Discount_ConfirmRows()

    var table = "<table class='table'>"
    table += "<tr>" +
        "<th>ردیف</th>" +
        "<th>نام شعبه</th>" +
        "<th>نام شعبه</th>" +
        "</tr>"
    for (let index = 0; index < ConfirmRowss.length; index++) {
        table += "<tr class='rows' dataId=" + ConfirmRowss[index].Id + ">"
        table += "<td >" + (index + 1) + "</td>"
        table += "<td >" + ConfirmRowss[index].Title + "</td>"
        table += "<td>"
        
        if( ConfirmRowss[index].Row==3 ||ConfirmRowss[index].Row==2||ConfirmRowss[index].Row==6)
        {
        var res = "<select disabled  class='chosen'><option></option>"
        }
        else
        {
            var res = "<select  class='chosen'><option></option>" 
        }
        for (let index2 = 0; index2 < users.length; index2++) {
            var res2 = Confirmss.find(x =>
                x.Confirmator.Id ==
                users[index2].Id
                &&
                x.ConfirmRow.Id ==
                ConfirmRowss[index].Id
            );
            
            if (res2 == undefined) {
                res += "<option  value='" + users[index2].Id + "'>" + splitString(users[index2].Title, "(")[0] + "</option>"
            }
            else {
                res += "<option selected value='" + users[index2].Id + "'>" + splitString(users[index2].Title, "(")[0] + "</option>"
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


