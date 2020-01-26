
var CurrentCID = 0;
var CurrentPID = 0;
var CurrentName = ""
var CurrentDep = ""
var CurrentPLoginName = ""
var today = "";

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
            _usersInConfirm.push({ Step: Confirm[index].Step, ConfirmatorId: Confirm[index].Confirmator.Id })
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
        table += "<tr><td>" + (index + 1) + "</td>" +
            "<td>" + Master[index].SaleDocCode + "</td>" +
            "<td>" + foramtDate(Master[index].OrderDate) + "</td>" +
            "<td>" + SeparateThreeDigits(Master[index].sum) + "</td>" +
            "<td>" + Master[index].TitleUser + "</td>" +
            "<td>" + Master[index].CustomerCode + "</td>" +
            "<td>" + Master[index].Step + "</td>" +
            "<td>" + foramtDate(Master[index].DateCreated) + "</td>" +
            "<td><input value='نمایش' type=button style='background-color: #97161b!important;' onclick='ShowFactorDetail(" + Master[index].ID + ")'></input></td>" +
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
    $('#btnSave').prop('disabled', false);
}
async function ShowFactorDetail(id) {
    var Detail_Factor = await Get_Detail_Factor(id)
    var HeaderFactor = "<table class='table'>"
    HeaderFactor += "<tr><td>کد فاکتور : " + Detail_Factor[0].MasterId.SaleDocCode + "</td><td>کد مشتری : " + Detail_Factor[0].MasterId.CustomerCode + "</td><td>تاریخ  : " + foramtDate(Detail_Factor[0].MasterId.OrderDate) + "</td></tr>"
    HeaderFactor += "<tr><td>مبلغ تخفیف : " + Detail_Factor[0].MasterId.sum + "</td><td>مرحله : " + Detail_Factor[0].MasterId.Step + "</td><td>ثبت کننده  : " + Detail_Factor[0].MasterId.TitleUser + "</td></tr>"
    HeaderFactor += "</table>"
    $("#head1 table").remove()
    $("#head1").append(HeaderFactor)


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
 
            "<td>" + Detail_Factor[index].GDiscount_Price + "</td>"+
            "<td>" + Detail_Factor[index].VDiscount_Price + "</td>"+
            "<td>" + SeparateThreeDigits(Detail_Factor[index].DiscountPrice) + "</td>"+
            "<td>" + SeparateThreeDigits(Detail_Factor[index].FinalPriceWithTax) + "</td>"+
            "<td>" + SeparateThreeDigits(Detail_Factor[index].FinalPriceWithoutTax) + "</td>"+
            "<td style='color:red'> " + SeparateThreeDigits(Detail_Factor[index].DiscountVal) +
            "</tr>"


    }
    DetailFactor += "</table>"
    $("#Detail1 table").remove()
    $("#Detail1").append(DetailFactor)


    var myWindow = $("#window"),
        undo = $("#newRecord");
    myWindow.kendoWindow({
        width: "1200px",
        title: "فرم تایید کالا",
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
            filter(filter).
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

