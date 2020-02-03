
var CurrentCID = 0;
var CurrentPID = 0;
var CurrentName = ""
var CurrentDep = ""
var CurrentPLoginName = ""
var today = "";
var Detail_Factor;
var _Factor = [];
var _CurrentBudget;

var portalAddress = _spPageContextInfo.webAbsoluteUrl;

/*
List Name :

Discount_ServerBranch
Discount_UsersBranch
Discount_BudgetIncrease

*/
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



    const m = moment();
    today = moment().format('jYYYY/jM/jD');//Today
    $(".today").append("<span>تاریخ امروز : </span><span>   " + today + "</span>")

    var todayarray = today.split("/")
    mounth = (parseInt(todayarray[1]) <= 9) ? "0" + parseInt(todayarray[1]) : parseInt(todayarray[1])
    rooz = (parseInt(todayarray[2]) <= 9) ? "0" + parseInt(todayarray[2]) : parseInt(todayarray[2])
    year = todayarray[0].substring(2, 4)
    today = "13" + year + "" + mounth + "" + rooz


    ShowTaskCartabl();



});
//-----------------------------------------------------------
async function ShowTaskCartabl() {
    var Confirm = await Get_Confirm()
    var _usersInConfirm = []
    for (let index = 0; index < Confirm.length; index++) {
        if (_spPageContextInfo.userId == Confirm[index].Confirmator.Id) {
            _usersInConfirm.push({ Step: Confirm[index].Step, ConfirmatorId: Confirm[index].Confirmator.Id, ID: Confirm[index].ID })
        }
    }


    var Master = await Get_Master_Cartabl(_usersInConfirm);

    var table = "<table class='table'>"
    table += "<tr><th>ردیف</th><th>SaleDocCode</th><th>OrderDate</th>" +
        "<th>sum</th><th>TitleUser</th>" +
        "<th>CustomerCode</th>" +
        "<th>Step</th>" +
        "<th>DateCreated</th>" +
        "<th>نمایش فاکتور</th>" +
        "</tr>"
    for (let index = 0; index < Master.length; index++) {

        var res = _usersInConfirm.find(x =>
            x.Step == Master[index].Step);

        table += "<tr><td>" + (index + 1) + "</td>" +
            "<td>" + Master[index].SaleDocCode + "</td>" +
            "<td>" + foramtDate(Master[index].OrderDate) + "</td>" +
            "<td>" + SeparateThreeDigits(Master[index].sum) + "</td>" +
            "<td>" + Master[index].TitleUser + "</td>" +
            "<td>" + Master[index].CustomerCode + "</td>" +
            "<td>" + Master[index].Step + "</td>" +
            "<td>" + foramtDate(Master[index].DateCreated) + "</td>" +
            "<td><input value='نمایش' type=button style='background-color: #97161b!important;' onclick='ShowFactorDetail(" + Master[index].ID + "," + (res == undefined ? 0 : res.ID) + ")'></input></td>" +
            "</tr>"
    }

    table += "</table>"

    $("#ShowCartabl table").remove()

    $("#ShowCartabl").append(table)
}

//--------------------------------------------------------------Modal

function ShowMessage(arrayMessage) {

    var table = "<table class='table table-bordered'>"
    for (let index = 0; index < arrayMessage.length; index++) {
        //const element = array[index];
        table += "<tr><td>" + (index + 1) + "</td><td>" + arrayMessage[index].message + "</td></tr>"
    }
    table += "</table>"
    $("#ModaDetail .modal-body table").remove()
    $("#ModaDetail .modal-body").append(table)
    $("#ModaDetail").modal();

    $.LoadingOverlay("hide");
    $('.btnSave').prop('disabled', false);
}
async function ShowFactorDetail(id, ConfirmatorId) {
    Detail_Factor = await Get_Detail_Factor(id)
    var SumTotal=0
    for (let index = 0; index < Detail_Factor.length; index++) {
        SumTotal += parseInt(Detail_Factor[index].DiscountVal);
    }
    debugger
    //Header Factor
    var HeaderFactor = "<table class='table'>"
    HeaderFactor += "<tr><td>کد فاکتور : " + Detail_Factor[0].MasterId.SaleDocCode + "</td><td>کد مشتری : " + Detail_Factor[0].MasterId.CustomerCode + "</td><td>تاریخ  : " + foramtDate(Detail_Factor[0].MasterId.OrderDate) + "</td></tr>"
    HeaderFactor += "<tr><td style='color:red'>مجموع مبلغ تخفیف : " + SeparateThreeDigits(SumTotal/*Detail_Factor[0].MasterId.sum*/) + "</td><td>مرحله : " + Detail_Factor[0].MasterId.Step + "</td><td>ثبت کننده  : " + Detail_Factor[0].MasterId.TitleUser + "</td></tr>"
    HeaderFactor += "</table>"
    $("#head1 table").remove()
    $("#head1").append(HeaderFactor)

    //Detail Factor
    /* در صورتی که درکارتابل بود این قسمت نمایش داده میشود و لی اگر صفر بود منظور خود درخواست دهنده است که باید ویرایش نماید */
    if (Detail_Factor[0].MasterId.Step > 0) {
        var DetailFactor = "<table class='table'>"
        DetailFactor += "<tr><th>کد فاکتور</th><th>نام کالا</th><th>نام تامین کننده کالا </th><th>تعداد در کاتن</th><th>تعداد</th><th>فی کالا</th><th>مبلغ تخفیف پلکانی</th><th>مبلغ تخفیف ویژه</th><th>مبلغ کل تخفیفات</th><th>مبلغ نهایی بدون مالیات و عوارض</th><th>مبلغ نهایی با مالیات و عوارض</th><th>مبلغ تخفیف</th></tr>"
        for (let index = 0; index < Detail_Factor.length; index++) {
            DetailFactor += "<tr>" +


                "<td> " + Detail_Factor[index].Id + "</td>" +
                "<td> " + Detail_Factor[index].ProductName + "</td>" +
                "<td> " + Detail_Factor[index].SuppName + "</td>" +
                "<td>" + Detail_Factor[index].NoInpack + "</td>" +
                "<td>" + Detail_Factor[index].Famount + "</td>" +
                "<td>" + SeparateThreeDigits(Detail_Factor[index].UnitPrice) + "</td>" +

                "<td>" + Detail_Factor[index].GDiscount_Price + "</td>" +
                "<td>" + Detail_Factor[index].VDiscount_Price + "</td>" +
                "<td>" + SeparateThreeDigits(Detail_Factor[index].DiscountPrice) + "</td>" +
                "<td>" + SeparateThreeDigits(Detail_Factor[index].FinalPriceWithTax) + "</td>" +
                "<td>" + SeparateThreeDigits(Detail_Factor[index].FinalPriceWithoutTax) + "</td>" +
                "<td style='color:red'> " + SeparateThreeDigits(Detail_Factor[index].DiscountVal) +
                "</tr>"


        }
        DetailFactor += "</table>"
    }
    else {
        var DetailFactor = "<table class='table'>"
        DetailFactor += "<tr><th>کد فاکتور</th><th>نام کالا</th><th>نام تامین کننده کالا </th><th>تعداد در کاتن</th><th>تعداد</th><th>فی کالا</th><th>مبلغ تخفیف پلکانی</th><th>مبلغ تخفیف ویژه</th><th>مبلغ کل تخفیفات</th><th>مبلغ نهایی بدون مالیات و عوارض</th><th>مبلغ نهایی با مالیات و عوارض</th><th>مبلغ تخفیف</th></tr>"
        for (let index = 0; index < Detail_Factor.length; index++) {
            DetailFactor += "<tr class='rows' DataId=" + Detail_Factor[index].Id + ">" +


                "<td> " + Detail_Factor[index].Id + "</td>" +
                "<td> " + Detail_Factor[index].ProductName + "</td>" +
                "<td> " + Detail_Factor[index].SuppName + "</td>" +
                "<td>" + Detail_Factor[index].NoInpack + "</td>" +
                "<td>" + Detail_Factor[index].Famount + "</td>" +
                "<td>" + SeparateThreeDigits(Detail_Factor[index].UnitPrice) + "</td>" +

                "<td>" + Detail_Factor[index].GDiscount_Price + "</td>" +
                "<td>" + Detail_Factor[index].VDiscount_Price + "</td>" +
                "<td>" + SeparateThreeDigits(Detail_Factor[index].DiscountPrice) + "</td>" +
                "<td>" + SeparateThreeDigits(Detail_Factor[index].FinalPriceWithTax) + "</td>" +
                "<td>" + SeparateThreeDigits(Detail_Factor[index].FinalPriceWithoutTax) + "</td>" +
                "<td style='color:red'><input type='number' class='discountVal' value='" + Detail_Factor[index].DiscountVal + "'/></td>" +
                "</tr>"


        }
        DetailFactor += "</table>"
    }
    $("#Detail1 table").remove()
    $("#Detail1").append(DetailFactor)

    //decision
    /* در صورتی که درکارتابل بود این قسمت نمایش داده میشود و لی اگر صفر بود منظور خود درخواست دهنده است که باید ویرایش نماید */
    if (Detail_Factor[0].MasterId.Step > 0) {
        var DecisionDiv = "<table class='table'>"

        DecisionDiv += "<tr>" +


            "<td>توضیحات</td>" +
            "<td><textarea  rows=4 cols=100  name='comment' form='usrform'    placeholder='توضیحات ...'></textarea></td>" +
            "</tr>" +
            "<tr>" +
            "<td>نتیجه</td>" +
            "<td><input type='radio' name='decide' value='true'> تایید<input type='radio' name='decide' value='false'> رد<br></td></tr>" +

            "<tr><td colspan=2><button class='btnSave'    style='background-color:rgb(167, 16, 23)!important; border-radius: 17px;'   onclick='save(" + id + "," + ConfirmatorId + ")' " +
            "type='button' class='btn btn-success'>ذخیره</button></td>"
        "</tr>"



        DecisionDiv += "</table>"
    }
    else {
        var DecisionDiv = "<table class='table'>"

        DecisionDiv += "<tr>" +


            "<td>توضیحات</td>" +
            "<td><textarea  rows=4 cols=100  name='comment' form='usrform'    placeholder='توضیحات ...'></textarea></td>" +
            "</tr>" +
            "<tr><td colspan=2><button class='btnSave'    style='background-color:rgb(167, 16, 23)!important; border-radius: 17px;'   onclick='saveEdit(" + id + ")' " +
            "type='button' class='btn btn-success'>ویرایش</button></td>"
        "</tr>"



        DecisionDiv += "</table>"
    }
    $("#Decision1 table").remove()
    $("#Decision1").append(DecisionDiv)


    var Log = await Get_Log(id)
    // console.log(Log)
    var LogForm = "<table class='table'>"
    LogForm += "<tr>" +
        "<th>سمت</th>" +
        "<th>مشخصات</th>" +
        "<th>نتیجه</th>" +
        "<th>توضیحات</th>" +
        // "<th>نتیجه</th>"+
        "<th>تاریخ</th>" +
        "</tr>"
    for (let index = 0; index < Log.length; index++) {
        LogForm += "<tr>" +
            "<td>" + Log[index].ConfirmId.Title + "</td>" +
            "<td>" + Log[index].ConfirmId.Moshakhasat + "</td>" +
            "<td>" + Log[index].Result + "</td>" +
            "<td>" + Log[index].Dsc + "</td>" +
            // "<td>"+Log[index].Title+"</td>"+
            "<td>" + Log[index].DateConfirm + "</td>" +

            "</tr>"
    }

    LogForm += "</table>"
    $("#Log1 table").remove()
    $("#Log1").append(LogForm)


    OpenDialog();

}
function OpenDialog() {
    var myWindow = $("#window"),
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
async function save(id, ConfirmatorId) {

    $('.btnSave').prop('disabled', true);
    $.LoadingOverlay("show");
    var arrayMessage = []

    var obj_Record = {}
    obj_Record.ID = id
    var description = $("#Decision1 textarea").val()
    var result = $("input[name='decide']:checked").val()
    obj_Record.description = description
    obj_Record.result = result

    if (result == undefined) {
        arrayMessage.push({ message: "لطفا نتیجه را مشخص نمایید" })
    }

    if (result == "false" && description.trim() == "") {
        arrayMessage.push({ message: "لطفا در صورت عدم تایید توضیحات را پر نمایید." })

    }
    if (arrayMessage.length > 0) {
        ShowMessage(arrayMessage)
    }
    else {

        if (result == "true") {
            obj_Record.Step = 1
        }
        else {
            obj_Record.Step = -1
        }
        arrayMessage = []
        var Master = await update_Master(obj_Record)
        var Log = await create_Log(obj_Record, ConfirmatorId)
        showAlert()
        $("#window").data("kendoWindow").close();
        ShowTaskCartabl();
        $.LoadingOverlay("hide");
        // $('.btnSave').prop('disabled', false);

    }


}
async function saveEdit(MasterId) {
    debugger
    $('#btnSave').prop('disabled', true);
    $.LoadingOverlay("show");
    var arrayMessage = []
    var _sum = 0

    $("#Detail1 table .rows").each(function () {

        var newObj = {}
        var DataId = $(this).attr("DataId")
        newObj.ID = parseInt(DataId)

        if ($(this).find(".discountVal").val() != "") {
            newObj.DiscountVal = parseInt($(this).find(".discountVal").val())
            _sum += parseInt($(this).find(".discountVal").val())
        }
        else {
            newObj.DiscountVal = 0

        }
        _Factor.push(newObj)

    })


    if (_sum == 0) {

        arrayMessage.push({ message: "هیچ تخفیفی در نظر گرفته نشده است" })
    }
    _CurrentBudget = await getCurrentBudget()
    if (_sum > _CurrentBudget) {
        arrayMessage.push({ message: "بودجه شما کافی نمیباشد" + " بودجه شما   " + SeparateThreeDigits(_CurrentBudget) + " میباشد. " })
    }
    if (arrayMessage.length > 0) {
        ShowMessage(arrayMessage)
    }
    else {
        var statusSave = false;
        //----detail
        for (let index = 0; index < _Factor.length; index++) {

            var Detail = await update_Detail(_Factor[index])
            statusSave = true
        }
        var Master = await update_Master({ ID: MasterId, Step: 1 })

        if (statusSave == true) {
            ShowTaskCartabl()
            $.LoadingOverlay("hide");
            $('#btnSave').prop('disabled', false);
            $("#window").data("kendoWindow").close();
            showAlert()
        }

        else {
            $.LoadingOverlay("hide");
            $('#btnSave').prop('disabled', false);
            $("#window").data("kendoWindow").close();
            alert("خطا در ثبت")
        }
    }


    $('#btnSave').prop('disabled', true);
    $.LoadingOverlay("hide");
}
//محاسبه بودجه فعلی
async function getCurrentBudget() {

    var BudgetIncrease = await Get_BudgetIncrease();
    var DiscountVal = await Get_Detail_DiscountVal();

    var _sum = 0

    for (let index = 0; index < BudgetIncrease.length; index++) {

        if (BudgetIncrease[index].IsIncrease == true) {
            _sum += BudgetIncrease[index].BudgetPrice
        }
        else {
            _sum -= BudgetIncrease[index].BudgetPrice
        }
    }
    for (let index = 0; index < DiscountVal.length; index++) {

        _sum -= DiscountVal[index].DiscountVal

    }
    return _sum


}
function showAlert(){
    const Toast = Swal.mixin({
        toast: true,
       // position: 'top-end',
        showConfirmButton: false,
        timer: 2000,
        timerProgressBar: true,
        onOpen: (toast) => {
          toast.addEventListener('mouseenter', Swal.stopTimer)
          toast.addEventListener('mouseleave', Swal.resumeTimer)
        }
      })
     
      Toast.fire({
        icon: 'success',
        title: 'درخواست شما با موفقیت ذخیره شد'
      })
}

//--------------------------------------------------------------------CRUD
//get
function Get_Discount_ServerBranch() {
    return new Promise(resolve => {
        $pnp.sp.web.lists.
            getByTitle("Discount_ServerBranch").
            items.get().
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
function Get_BudgetIncrease() {

    return new Promise(resolve => {
        $pnp.sp.web.lists.
            getByTitle("Discount_BudgetIncrease").
            items.
            select("UsersBranch/Title,UsersBranch/Id,UsersBranch/IdUser,UserIncreaser/Title,UserIncreaser/Id,Id,Title,BudgetPrice,IsIncrease,DateCreated").
            filter("(UsersBranch/IdUser eq " + _spPageContextInfo.userId + ")").
            expand("UsersBranch,UserIncreaser").
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
            select("MasterId/IdUser,MasterId/SaleDocCode,MasterId/Id,MasterId/Title,Id,Title,DiscountVal,MasterId/DateCreated").
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
function Get_Detail_Cartabl() {

    return new Promise(resolve => {
        $pnp.sp.web.lists.
            getByTitle("Discount_Detail").
            items.
            select("MasterId/IdUser,MasterId/SaleDocCode,MasterId/Id,MasterId/Title,Id,Title,DiscountVal,MasterId/DateCreated,MasterId/TitleUser").
            // filter("(MasterId/IdUser eq " + _spPageContextInfo.userId + ")").
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
function Get_Master_Cartabl(usersInConfirm) {
    var filter = ""
    for (let index = 0; index < usersInConfirm.length; index++) {
        filter += "(Step eq " + usersInConfirm[index].Step + ") or ";
    }
    filter = removeCountChar(filter, 3)
    return new Promise(resolve => {
        $pnp.sp.web.lists.
            getByTitle("Discount_Master").
            items.
            // select("User/Title,User/Id,Branch/Title,Branch/Id,Id,Title").
            filter("(Step eq 0) or " + filter).
            //expand("User,Branch").
            get().
            then(function (items) {

                resolve(items);
            });
    });

}
function Get_Confirm() {

    return new Promise(resolve => {
        $pnp.sp.web.lists.
            getByTitle("Discount_Confirm").
            items.
            select("Confirmator/Title,Confirmator/Id,Id,Title,Step").
            //filter("(UsersBranch/IdUser eq " + _spPageContextInfo.userId + ")").
            expand("Confirmator").
            get().
            then(function (items) {

                resolve(items);
            });
    });
}
function Get_Log(MastreId) {
    return new Promise(resolve => {
        $pnp.sp.web.lists.
            getByTitle("Discount_Log").
            items.
            select("MasterId/Title,MasterId/Id,ConfirmId/Title,ConfirmId/Id,ConfirmId/Moshakhasat,Id,Title,Result,Dsc,DateConfirm").
            orderBy("Id", false).
            filter("(MasterId/Id eq " + MastreId + ")").
            expand("MasterId,ConfirmId").
            get().
            then(function (items) {
                resolve(items);
            });
    });
}
//  Get Item By Id :
function Get_Detail_Factor(id) {
    /*
    FinalPriceWithoutTax,
FinalPriceWithTax,
DiscountPrice ,
VDiscount_Price,
GDiscount_Price,
CDiscount_Price,
TaxesPercent,
VdisPercent,
Gdispercent,
Cdispercent,
UnitPrice,
Famount: ,
NoInpack,
SuppName,
SuppCode,
ProductName,
SaleDocTypeDesc,
FinalBox,
DiscountVal,
    */

    return new Promise(resolve => {
        $pnp.sp.web.lists.getByTitle("Discount_Detail").
            items.
            select("Id,Title,ProductName,DiscountVal," +
                "FinalPriceWithoutTax,FinalPriceWithTax,DiscountPrice,VDiscount_Price,GDiscount_Price,CDiscount_Price," +
                "TaxesPercent," +
                "VdisPercent," +
                "Gdispercent," +
                "Cdispercent," +
                "UnitPrice," +
                "Famount," +
                "NoInpack," +
                "SuppName," +
                "SuppCode,ProductName,SaleDocTypeDesc," +
                "FinalBox,DiscountVal," +
                "MasterId/Id,MasterId/Title,MasterId/SaleDocCode,MasterId/OrderDate, MasterId/FinalDate,MasterId/CustomerCode," +
                "MasterId/sum,MasterId/Step,MasterId/CID,MasterId/TitleUser").
            expand("MasterId").
            filter("MasterId/Id eq " + id + "").
            orderBy("Id", false).
            get().
            then(function (item) {
                resolve(item)
            });

    });
}
//update
function update_Master(Record) {

    //console.log(Detail_Factor)
    Record.Step = Detail_Factor[0].MasterId.Step + Record.Step
    return new Promise(resolve => {
        var list = $pnp.sp.web.lists.getByTitle("Discount_Master");
        list.items.getById(Record.ID).update({
            Step: Record.Step
        }).then(function (item) {

            resolve(item);
        });
    });
}
function update_Detail(Record) {

    return new Promise(resolve => {
        var list = $pnp.sp.web.lists.getByTitle("Discount_Detail");
        list.items.getById(Record.ID).update({
            DiscountVal: Record.DiscountVal.toString()
        }).then(function (item) {

            resolve(item);
        });
    });
}
//Create 
function create_UsersBranch(Record) {
    return new Promise(resolve => {
        $pnp.sp.web.lists.getByTitle("Discount_UsersBranch").items.add({
            Title: Record.LoginTitle,
            UserId: Record.LoginName,
            BranchId: Record.Branch
        }).then(function (item) {

            resolve(item);
        }).catch(error => {
            console.log(error)
            resolve(error);
        })
    });
}
function create_BudgetIncrease(Record) {
    return new Promise(resolve => {
        $pnp.sp.web.lists.getByTitle("Discount_BudgetIncrease").items.add({
            Title: Record.Title,
            UserIncreaserId: Record.UserIncreaserId,
            UsersBranchId: Record.UserBranchId,
            dsc: Record.dsc,
            BudgetPrice: Record.BudgetPrice,
            DateCreated: today,
            IsIncrease: Record.IsIncrease
        }).then(function (item) {
            resolve(item);
        }).catch(error => {
            console.log(error)
            resolve(error);
        })
    });
}
function create_Log(Record, ConfirmatorId) {

    var x = new Date()
    // var x1=x.getMonth() + 1+ "/" + x.getDate() + "/" + x.getYear(); 
    var x1 = x.getHours() + ":" + x.getMinutes() + ":" + x.getSeconds();

    return new Promise(resolve => {
        $pnp.sp.web.lists.getByTitle("Discount_Log").items.add({
            Title: "Record",
            MasterIdId: Record.ID,
            Result: (Record.result == "true" ? "تایید" : "عدم تایید"),
            Dsc: Record.description,
            DateConfirm: foramtDate(today) + "  -  " + x1,
            ConfirmIdId: ConfirmatorId,
        }).then(function (item) {
            resolve(item);
        }).catch(error => {
            console.log(error)
            resolve(error);
        })
    });
}
function create_Master(Record, sum) {

    return new Promise(resolve => {
        $pnp.sp.web.lists.getByTitle("Discount_Master").items.add({
            Title: Record.SaleDocCode,
            SaleDocCode: Record.SaleDocCode,
            OrderDate: Record.OrderDate,
            FinalDate: Record.FinalDate,
            SaleDOcstate: Record.SaleDOcstate,
            CustomerCode: Record.CustomerCode,
            sum: sum,
            UserId: _spPageContextInfo.userId,
            IdUser: _spPageContextInfo.userId,
            DateCreated: today,
            CID: CurrentCID
        }).then(function (item) {
            resolve(item);
        }).catch(error => {
            console.log(error)
            resolve(error);
        })
    });
}
function create_Detail(Record, MasterId) {

    return new Promise(resolve => {
        $pnp.sp.web.lists.getByTitle("Discount_Detail").items.add({
            Title: "Record",
            MasterIdId: MasterId,
            Productcode: Record.Productcode,
            FinalPriceWithoutTax: Record.FinalPriceWithoutTax,
            FinalPriceWithTax: Record.FinalPriceWithTax,
            DiscountPrice: Record.DiscountPrice,
            VDiscount_Price: Record.VDiscount_Price,
            GDiscount_Price: Record.GDiscount_Price,
            CDiscount_Price: Record.CDiscount_Price,
            TaxesPercent: Record.TaxesPercent,
            VdisPercent: Record.VdisPercent,
            Gdispercent: Record.Gdispercent,
            Cdispercent: Record.Cdispercent,
            UnitPrice: Record.UnitPrice,
            Famount: Record.Famount,
            NoInpack: Record.NoInpack,
            SuppName: Record.SuppName,
            SuppCode: Record.SuppCode,
            ProductName: Record.ProductName,
            SaleDocTypeDesc: Record.SaleDocTypeDesc,
            FinalBox: Record.FinalBox,
            DiscountVal: Record.DiscountVal.toString()
        }).then(function (item) {
            resolve(item);
        }).catch(error => {
            console.log(error)
            resolve(error);
        })
    });
}


//-------------کاربران ثبت کننده تخفیف    223---------------------- Users in Group
function IsUserInGroup(id) {
    //  کاربران ثبت کننده تخفیف    223
    return new Promise(resolve => {
        $.ajax({
            url: portalAddress + "/_api/web/sitegroups/getbyId(" + id + ")/users",
            method: "GET",
            asyn: true,
            crossDomain: true,
            headers: { "Accept": "application/json; odata=verbose" },
            success: function (data) {

                resolve(data)
            },
            error: function (data) {

            }
        });
    });
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

//--------------------------------------------------------------------Utility

