var _CurrentIdDetail = 0
var CurrentCID = 0;
var CurrentPID = 0;
var CurrentName = ""
var CurrentDep = ""
var CurrentPLoginName = ""
var today = "";

var portalAddress = _spPageContextInfo.webAbsoluteUrl;

var _ServerBranch = []
var Confirmss = []
var _IDServerBranch = 0



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



    ShowBranch();
    $(".chosen").chosen();
    //showFormRequest();

});
//-----------------------------------------------------------


async function ShowBranch() {
    _ServerBranch = await Get_Discount_ServerBranch();
    var table = "<table class='table'>"
    table += "<tr>" +
        "<th>ردیف</th>" +
        "<th>نام شعبه</th>" +
        "</tr>"
    for (let index = 0; index < _ServerBranch.length; index++) {
        table += "<tr class='rows'>"
        table += "<td >" + (index + 1) + "</td>"
        table += "<td >" + _ServerBranch[index].Title + "</td>"
        table += "<td><input type='button'  onclick='showDetail(" + _ServerBranch[index].ID + ")' style='background-color:#e4b79e' value='نمایش تاییدکنندگان'/></td>"
        table += "</tr>"
    }
    table += "</table>"
    $("#showCreateBranch table").remove()
    $("#showCreateBranch").append(table)

}
//--------------------------------------------------------------Modal
async function showDetail(ID_IServerBranch) {
    _IDServerBranch = ID_IServerBranch
    /*
255   کاربران تایید کننده تخفیف  
*/
    var users = await GetUsersInGroup(portalAddress, 255)
    Confirmss = []
    Confirmss = await Get_Confirm()





    var ConfirmRowss = await Get_Discount_ConfirmRows()

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
        var res = "<select class='chosen'><option></option>"
        for (let index2 = 0; index2 < users.length; index2++) {
            var res2 = Confirmss.find(x =>
                x.Confirmator.Id ==
                users[index2].Id
                &&
                x.ConfirmRow.Id ==
                ConfirmRowss[index].Id
            );
            if (res2 == undefined) {
                res += "<option value='" + users[index2].Id + "'>" + splitString(users[index2].Title, "(")[0] + "</option>"
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


    OpenDialog();
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

function Get_Confirm() {
    return new Promise(resolve => {
        $pnp.sp.web.lists.
            getByTitle("Discount_Confirm").
            items.
            select("ConfirmRow/Title,ConfirmRow/Id,ServerBranch/Title,ServerBranch/Id,Confirmator/Title,Confirmator/Id,Id,Title").
            filter("(ServerBranch/Id eq " + _IDServerBranch + ")").
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

function create_Confirm(Record) {
    
    return new Promise(resolve => {
        $pnp.sp.web.lists.getByTitle("Discount_Confirm").items.add({
            Title: Record.Title,
            ServerBranchId: Record.ServerBranchId,
            ConfirmRowId: Record.ConfirmRowId,
            ConfirmatorId: Record.ConfirmatorId
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

            var discountVal = parseFloat($(this).find(".discountVal").val())
            var Famount = parseFloat($(this).find(".Famount").text())
            var UnitPrice = parseFloat($(this).find(".UnitPrice").text())

            _Factor[DataId].DiscountVal = parseFloat($(this).find(".discountVal").val())
            _sum += (discountVal * Famount * UnitPrice) / 100
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

   
    var val = $(thiss).val()
    
    $(thiss).parent().next().find("span").remove()
    $(thiss).parent().next().append("<span>" + SeparateThreeDigits((val * Famount * UnitPrice) / 100) + "</span>")
   
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

            if(res2==undefined)
            {
            //create
            var res = await create_Confirm({ Title: peopleTitle, ServerBranchId: _IDServerBranch, ConfirmRowId: parseInt(DataId), ConfirmatorId: parseInt(peopleId) })
            }
            else
            {
                debugger
            //update
            var res = await update_Confirm({ID:res2.Id, Title: peopleTitle, ServerBranchId: _IDServerBranch, ConfirmRowId: parseInt(DataId), ConfirmatorId: parseInt(peopleId) })
            }
        }
    })
    
    $.LoadingOverlay("hide");
    $("#window").data("kendoWindow").close();
    $('#btnSave').prop('disabled', false);
}
//-------------کاربران ثبت کننده تخفیف    223---------------------- Users in Group

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


