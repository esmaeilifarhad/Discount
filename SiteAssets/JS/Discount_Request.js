var _CurrentIdDetail = 0
var CurrentCID = 0;
var CurrentPID = 0;
var CurrentName = ""
var CurrentDep = ""
var CurrentPLoginName = ""
var today = "";

var portalAddress = _spPageContextInfo.webAbsoluteUrl;
var _ID_Discount_UsersBranch = 0
var _RecordSave = []
var _Factor;
var _CurrentBudget

var _LogTransactionArray = []
var _Transaction = {}
var LogTransactionObj = {}
var _showLogStatus = false
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


    ShowUserInfo();

    //showFormRequest();

});
//-----------------------------------------------------------

async function showFormRequest() {

    // var Factor = await serviceDiscount(298019050);

    //-------------------------------------

    var Factor = _Factor
    var table = "<h3>اطلاعات فاکتور</h3><table class='table'>"

    table += "<tr >"
    table += "<td class='onvan'>شماره فاکتور</td>"
    table += "<td>" + Factor[0].SaleDocCode + "</td>"
    table += "<td class='onvan'>تاریخ درخواست</td>"
    table += "<td>" + foramtDate(Factor[0].OrderDate) + "</td>"
    table += "</tr>"
    table += "<tr>"
    table += "<td class='onvan'>تاریخ قطعی</td>"
    table += "<td>" + foramtDate(Factor[0].FinalDate) + "</td>"
    table += "<td class='onvan'>وضعیت فاکتور</td>"
    table += "<td>" + Factor[0].SaleDOcstate + "</td>"
    table += "</tr>"
    table += "<tr>"
    table += "<td class='onvan'>کدمشتری</td>"
    table += "<td>" + Factor[0].CustomerCode + "</td>"
    table += "<td class='onvan'>نوع درخواست</td>"
    table += "<td><select id='DarTaahod'>" +
        "<option value='shobe'>در تعهد شعبه</option>" +
        "<option value='Markaz'>در تعهد دفتر مرکزی</option>" +
        "<option value='Tolid'>در تعهد شرکت تولیدی</option>" +
        "</select></td>"
    table += "</tr>"
    table += "</table>"

    $("#ShowFactorHeader table").remove()
    $("#ShowFactorHeader h3").remove()

    $("#ShowFactorHeader").append(table)

    table = "<p><input style='background-color:  #29d663;' type='button' value='ذخیره' onclick='SaveFactor()' id='btnSave'/></p>"
    table += "<table class='table-bordered'>"
    table += "<tr>" +
        "<th>ردیف</th>" +
        "<th>کانال فروش</th><th>کد کالا</th><th>نام کالا</th>" +
        "<th>کد تامین کننده</th>" +
        "<th>نام تامین کننده</th>" +
        "<th>تعداد در کارتن</th>" +
        "<th>تعداد</th><th>فی کالا</th>" +
        "<th>درصد تخفیف نوعی</th>" +
        "<th>درصد تخفیف پلکانی</th>" +
        "<th>درصد تخفیف ویژه</th>" +
        "<th>درصد مالیات و عوارض</th>" +
        "<th>مبلغ تخفیف نوعی</th>" +
        "<th>مبلغ تخفیف پلکانی</th>" +
        "<th>مبلغ تخفیف ویژه</th>" +
        "<th>مبلغ کل تخفیفات</th>" +
        "<th>مبلغ نهایی بدون مالیات و عوارض</th>" +
        "<th>مبلغ نهایی با مالیات و عوارض</th>" +
        "<th>درصد تخفیف</th>" +
        "<th>مقدار تخفیف</th><th>نمایش بیشتر</th>" +
        "</tr>"
    for (let index = 0; index < Factor.length; index++) {
        table += "<tr class='rows' DataId=" + index + ">"
        table += "<td>" + (index + 1) + "</td>"
        // table += "<td>" + Factor[index].SaleDocCode + "</td>"
        // table += "<td>" + Factor[index].OrderDate + "</td>"
        // table += "<td>" + Factor[index].FinalDate + "</td>"
        // table += "<td>" + Factor[index].SaleDOcstate + "</td>"
        // table += "<td>" + Factor[index].CustomerCode + "</td>"
        table += "<td>" + Factor[index].SaleDocTypeDesc + "</td>"
        table += "<td>" + Factor[index].Productcode + "</td>"
        table += "<td>" + Factor[index].ProductName + "</td>"

        table += "<td>" + Factor[index].SuppCode + "</td>"
        table += "<td>" + Factor[index].SuppName + "</td>"

        table += "<td>" + Factor[index].NoInpack + "</td>"
        // table += "<td>" + Factor[index].FinalBox + "</td>"
        table += "<td class='Famount'>" + Factor[index].Famount + "</td>"
        table += "<td class='UnitPrice'>" + Factor[index].UnitPrice + "</td>"

        table += "<td>" + Factor[index].Cdispercent + "</td>"
        table += "<td>" + Factor[index].Gdispercent + "</td>"
        table += "<td>" + Factor[index].VdisPercent + "</td>"
        table += "<td>" + Factor[index].TaxesPercent + "</td>"

        table += "<td>" + SeparateThreeDigits(parseInt(Factor[index].CDiscount_Price)) + "</td>"
        table += "<td>" + Factor[index].GDiscount_Price + "</td>"
        table += "<td>" + Factor[index].VDiscount_Price + "</td>"
        table += "<td>" + SeparateThreeDigits(Factor[index].DiscountPrice) + "</td>"



        table += "<td>" + SeparateThreeDigits(Factor[index].FinalPriceWithTax) + "</td>"
        table += "<td>" + SeparateThreeDigits(Factor[index].FinalPriceWithoutTax) + "</td>"
        table += "<td style='color:black'><input type='number' class='discountVal' onkeyUp='tt()' onchange='CalulateDarsad(this," + Factor[index].Famount + "," + Factor[index].UnitPrice + ")'/></td>"
        table += "<td><span>...</span></td>"

        table += "<td><span  onclick='showDetail(" + Factor[index].Productcode + ")' style='color:blue' class='fa fa-info'></span></td>"
        table += "</tr>"

        //console.log(Factor[index])
    }
    $("#ShowFactorDetail table").remove()
    $("#ShowFactorDetail p").remove()
    $("#ShowFactorDetail").append(table)
}
async function ShowUserInfo() {
    var UsersBranch = await Get_UsersBranch();

    var BudgetIncrease = await Get_BudgetIncrease();
    var _sum = 0
    _LogTransactionArray = []
    for (let index = 0; index < BudgetIncrease.length; index++) {

        if (BudgetIncrease[index].IsIncrease == true) {
            _sum += BudgetIncrease[index].BudgetPrice
            LogTransactionObj = { BudgetPrice: BudgetIncrease[index].BudgetPrice, type: 1, type2: "افزایش", WhoIncrease: BudgetIncrease[index].UserIncreaser.Title, DateCreate: BudgetIncrease[index].DateCreated }
        }
        else {
            _sum -= BudgetIncrease[index].BudgetPrice
            LogTransactionObj = { BudgetPrice: BudgetIncrease[index].BudgetPrice, type: 0, type2: "کاهش", WhoIncrease: BudgetIncrease[index].UserIncreaser.Title, DateCreate: BudgetIncrease[index].DateCreated }
        }
        _LogTransactionArray.push(LogTransactionObj)
    }
    // _Transaction={LogTransactionArray:_LogTransactionArray}
    var DiscountVal = await Get_Detail_DiscountVal();

    var types = {};
    for (let index2 = 0; index2 < DiscountVal.length; index2++) {

        var SaleDocCode = DiscountVal[index2].MasterId.SaleDocCode;
        if (!types[SaleDocCode]) {
            types[SaleDocCode] = [];
        }

        types[SaleDocCode].push({ id: DiscountVal[index2].Id,UnitPrice: DiscountVal[index2].UnitPrice,Famount: DiscountVal[index2].Famount, DiscountVal: DiscountVal[index2].DiscountVal, DateCreate: DiscountVal[index2].MasterId.DateCreated });



        // LogTransactionObj = { BudgetPrice: parseInt(DiscountVal[index2].DiscountVal), type: 0, type2: "فاکتور", DateCreate: DiscountVal[index2].MasterId.DateCreated, SaleDocCode: DiscountVal[index2].MasterId.SaleDocCode }

       // (val * Famount * UnitPrice) / 100

        _sum -= (DiscountVal[index2].DiscountVal*DiscountVal[index2].Famount*DiscountVal[index2].UnitPrice)/100;
        //_LogTransactionArray.push(LogTransactionObj)

    }

    var sumDiscountVal
    for (var SaleDocCode in types) {
        sumDiscountVal = 0
        for (let index = 0; index < types[SaleDocCode].length; index++) {
            debugger
            var MablaghTakhfifi=(parseFloat(types[SaleDocCode][index].DiscountVal)* parseFloat(types[SaleDocCode][index].UnitPrice)* parseFloat(types[SaleDocCode][index].Famount))/100
            sumDiscountVal += parseInt(MablaghTakhfifi);

        }

        _LogTransactionArray.push({ type: 0, type2: "فاکتور", BudgetPrice: sumDiscountVal, SaleDocCode: SaleDocCode, DateCreate: types[SaleDocCode][0].DateCreate })

    }


    _Transaction = { types: types, LogTransactionArray: _LogTransactionArray }


    _CurrentBudget = _sum

    var table = "<table class='table'>"


    table += "<tr class='rows'>"
    table += "<td class='onvan'>نام</td><td>" + UsersBranch[0].Title + "</td>"
    table += "</tr>"
    table += "<tr class='rows'>"
    table += "<td class='onvan'>شعبه</td><td>" + UsersBranch[0].Branch.Title + "</td>"
    table += "</tr>"
    table += "<tr class='rows' style='color:red'>"
    table += "<td class='onvan' >دارایی</td><td>" + SeparateThreeDigits(_sum) + "</td>"
    table += "</tr>"
    table += "<tr class='rows'>"
    table += "<td class='onvan'>تاریخچه تراکنش ها</td><td><input type='button' value='نمایش' style='background-color:#59b351'  onclick='showLogBudget()'/></td>"
    table += "</tr>"
    table += "</table>"
    $("#ShowUser table").remove()
    $("#ShowUser").append(table)

}
//--------------------------------------------------------------Modal
function showDetail(thiss) {

    var res = _Factor.find(x => x.Productcode == thiss);

    var table = "<table class='table'>"
    table += "<tr><td>تعداد در کارتن قطعی</td><td>" + res.FinalBox + "</td></tr>"
    table += "<tr><td>مبلغ نهایی با مالیات و عوارض</td><td>" + SeparateThreeDigits(res.FinalPriceWithoutTax) + "</td></tr>"

    table += "</table>"

    $("#ModaDetail .modal-body table").remove()
    $("#ModaDetail .modal-body").append(table)

    $("#ModaDetail").modal();
}
function showLogBudget() {
    //--------------------------------toggle shoe & hide
    if (_showLogStatus == false) {
        _showLogStatus = true
    }
    else {
        _showLogStatus = false
    }
    //-------------------------------

    //objects
    //var array = [{id:'12', name:'Smith', value:1},{id:'13', name:'Jones', value:2}];
    _LogTransactionArray.sort(function (a, b) {
        var a1 = a.DateCreate, b1 = b.DateCreate;
        if (a1 == b1) return 0;
        return a1 > b1 ? 1 : -1;
    });



    var table = "<h3>تاریخچه</h3><table class='table'>"
    table += "<tr><th>نوع</th><th>مبلغ</th><th>تاریخ</th><th>فاکتور</th><th>مسئول مربوطه</th></tr>"


    for (let index = 0; index < _LogTransactionArray.length; index++) {
        table += "<tr  style=color:" + (_LogTransactionArray[index].type == 1 ? "green" : "red") + ">"+
        "<td>" + _LogTransactionArray[index].type2 + "</td>"+
        "<td>" + SeparateThreeDigits(_LogTransactionArray[index].BudgetPrice) + "</td>"+
        "<td>" + foramtDate(_LogTransactionArray[index].DateCreate) + "</td>"+
        "<td>" + (_LogTransactionArray[index].SaleDocCode == undefined ? "..." : _LogTransactionArray[index].SaleDocCode) + "</td>"+
        "<td>" + (_LogTransactionArray[index].WhoIncrease == undefined ? "..." : _LogTransactionArray[index].WhoIncrease) + "</td>"+
        "</tr>"
    }

    table += "</table>"
    if (_showLogStatus == false) {
        $("#ShowLogBudget h3").remove()
        $("#ShowLogBudget table").remove()
    }
    else {
        $("#ShowLogBudget").append(table)
    }




}
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
    $('#btnSave').prop('disabled', false);
}
//--------------------------------------------------------------------CRUD

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
//Discount_Master
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
            TitleUser: _spPageContextInfo.userLoginName,
            DateCreated: today,
            Step: 1,
            CID: CurrentCID,
            TypeTakhfif: Record.TypeTakhfif
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

//-------------------------------------Find Factor
async function FindFactor() {
    $.LoadingOverlay("show");

    var Factor = $("input[name='factorSearch']").val();

    var Factor = await serviceDiscount(Factor);

    Factor = Factor.lstInvoice
    _Factor = Factor
    if (Factor.length == 0) {
        $("#ShowFactorHeader table").remove()
        $("#ShowFactorDetail table").remove()
        $("#ShowFactorDetail p").remove()
        $("#ShowFactorHeader h3").remove()
        $("#ShowFactorHeader").append("<h3>فاکتور مورد نظر یافت نشد</h3>")
        $.LoadingOverlay("hide");

    }
    else {
        $.LoadingOverlay("hide");
        showFormRequest()
    }

    //alert(Factor)
}
async function SaveFactor() {
    $('#btnSave').prop('disabled', true);
    $.LoadingOverlay("show");

    //var DarTaahod = $("#DarTaahod option:selected").text();
    var TypeTakhfif = $("#DarTaahod option:selected").val();


    var arrayMessage = []
    var _sum = 0
    $("#ShowFactorDetail table  .rows").each(function () {

        var DataId = $(this).attr("DataId")

        if ($(this).find(".discountVal").val() != "") {
            
            var discountVal=parseFloat($(this).find(".discountVal").val())
            var Famount=parseFloat($(this).find(".Famount").text())
            var UnitPrice=parseFloat($(this).find(".UnitPrice").text())

            _Factor[DataId].DiscountVal = parseFloat($(this).find(".discountVal").val())
            _sum += (discountVal*Famount*UnitPrice)/100
        }
        else {
            _Factor[DataId].DiscountVal = 0
        }

    })
    var Master_IsDuplicate = await Get_Master_IsDuplicate(_Factor[0].SaleDocCode);
    if (Master_IsDuplicate.length > 0) {

        arrayMessage.push({ message: "برای این فاکتور تخفیف گرفته شده است" })
        //return;
    }
    if (_sum == 0) {

        arrayMessage.push({ message: "هیچ تخفیفی در نظر گرفته نشده است" })
    }
    if (_sum > _CurrentBudget) {
        arrayMessage.push({ message: "بودجه شما کافی نمیباشد" })
    }
    if (arrayMessage.length > 0) {
        ShowMessage(arrayMessage)
    }
    else {

        var statusSave = false;
        //----master

        _Factor[0].TypeTakhfif = TypeTakhfif

        var Master = await create_Master(_Factor[0], _sum)
        var MasterId = Master.data.ID

        //----detail

        for (let index = 0; index < _Factor.length; index++) {

            var Detail = await create_Detail(_Factor[index], MasterId)
            statusSave = true
        }

        if (statusSave == true) {
            ShowUserInfo();
            $.LoadingOverlay("hide");
            $('#btnSave').prop('disabled', false);
            alert("با موفقیت ذخیره شد")
        }

        else {
            $.LoadingOverlay("hide");
            $('#btnSave').prop('disabled', false);
            alert("خطا در ثبت")
        }
    }

}
function CalulateDarsad(thiss, Famount, UnitPrice) {

    //console.log($(thiss))
    var val = $(thiss).val()
    //console.log($(thiss).parent().next().find("span"))
    $(thiss).parent().next().find("span").remove()
    $(thiss).parent().next().append("<span>"+SeparateThreeDigits((val * Famount * UnitPrice) / 100)+"</span>")
    // alert(SeparateThreeDigits((val*Famount*Famount)/100))
}
// function tt(thiss){
//     alert("zz")
// }
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


