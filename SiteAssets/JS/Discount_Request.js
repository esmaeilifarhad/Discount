var _CurrentIdDetail = 0
var CurrentCID = 0;
var CurrentPID = 0;
var CurrentName = ""
var CurrentDep = ""
var CurrentPLoginName = ""
var today = "";

var portalAddress = _spPageContextInfo.webAbsoluteUrl;
var _ServiceObj = {}
var _ServerBranch = []
var _ID_Discount_UsersBranch = 0
var _RecordSave = []
var _Factor;
var _CurrentBudget

var _LogTransactionArray = []
var _Transaction = {}
var LogTransactionObj = {}
var _showLogStatus = false

// //-------------------------------------------

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


    ShowUserInfo();

    //showFormRequest();
   

});
//-----------------------------------------------------------

async function showFormRequest() {

    Obj_Discount_BaseData.OrderBy = "Id"
    Obj_Discount_BaseData.Is_Increase = true
    Obj_Discount_BaseData.Filter = "(Code eq " + 1 + ")"
    var Discount_BaseData = await get_Records(Obj_Discount_BaseData)

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
    table += "<td><select id='DarTaahod'>"
    // for (let index = 0; index < Discount_BaseData.length; index++) {
    table += "<option value=" + Discount_BaseData[0].Id + ">" + Discount_BaseData[0].Title + "</option>"

    // }
    table += "</select></td>"
    table += "</tr>"
    table += "</table>"
    $("#ShowFactorHeader table").remove()
    $("#ShowFactorHeader h3").remove()
    $("#ShowFactorHeader").append(table)
    table = "<p><input style='background-color:  #29d663;' type='button' value='ذخیره' onclick='SaveFactor()' /></p>"
    table += "<table><tr><td>اعمال در کل فاکتور</td>" +
        "<td><input type='text' placeholder='درصد' id='effectTotalFactorPercent' /></td>" +
        "<td><input style='background-color:  #29d663;' type='button' value='اعمال' onclick='effectTotalFactor()' /></td></tr></table>"
    table += "<table class='table-bordered detailsFactor'>"
    table += "<tr>" +
        "<th>ردیف</th>" +
        "<th>کانال فروش</th><th>کد کالا</th><th>نام کالا</th>" +
        "<th>کد تامین کننده</th>" +
        "<th>نام تامین کننده</th>" +
        "<th>کد برند</th>" +
        "<th>نام برند</th>" +
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
        table += "<td>" + Factor[index].BrandId + "</td>"
        table += "<td>" + Factor[index].BrandDesc + "</td>"
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
        table += "<td style='color:black'>" +
            "<input type='number' class='discountVal'  " +
            "onchange='CalulateDarsad(this," + Factor[index].Famount + "," + Factor[index].UnitPrice + ")'/></td>"
        table += "<td class='MeghdarTakhfif'><span>...</span></td>"

        table += "<td><span  onclick='showDetail(" + Factor[index].Productcode + ")' style='color:blue' class='fa fa-info'></span></td>"
        table += "</tr>"

        //console.log(Factor[index])
    }
    $("#ShowFactorDetail table").remove()
    $("#ShowFactorDetail p").remove()
    $("#ShowFactorDetail").append(table)
}
async function ShowUserInfo() {

    Obj_Discount_ServerBranch.OrderBy = "CurrentBudget"
    Obj_Discount_ServerBranch.Is_Increase = false
    Obj_Discount_ServerBranch.Filter = "(User/Id eq " + _spPageContextInfo.userId + ")"
    var Discount_ServerBranch = await get_Records(Obj_Discount_ServerBranch)



    if (Discount_ServerBranch.length > 1) {
        alert("شما مسول دو تا شعبه میباشد")
        return
    }
    if (Discount_ServerBranch.length > 1) {
        alert("هیچ شعبه ای به شما اختصاص داده نشده است")
        return
    }




    _ServiceObj = { IP_Server: Discount_ServerBranch[0].IP_Server, DB: Discount_ServerBranch[0].DataBaseName, ServerBranchId: Discount_ServerBranch[0].Id }
    InsertToInsertSaleDocsMarketingDiscounts()
  
    var table = "<table class='table'>"
    table += "<tr class='rows'>"
    table += "<td class='onvan'>نام</td><td>" + Discount_ServerBranch[0].User.Title + "</td>"
    table += "</tr>"
    table += "<tr class='rows'>"
    table += "<td class='onvan'>شعبه</td><td>" + Discount_ServerBranch[0].TitleBranch + "</td>"
    table += "</tr>"
    table += "<tr class='rows' style='color:red'>"
    table += "<td class='onvan' >دارایی</td><td>" + SeparateThreeDigits(Discount_ServerBranch[0].CurrentBudget) + "</td>"
    table += "</tr>"
    table += "<tr class='rows'>"
    table += "<td class='onvan'>تاریخچه تراکنش ها</td><td><input type='button' value='نمایش' style='background-color:#59b351'  onclick='showLogBudget(" +
        "{UserTitle:\"" + Discount_ServerBranch[0].User.Title + "\"," +
        "ServerBranchId:" + Discount_ServerBranch[0].Id + "," +
        "ServerBranchTitle:\"" + Discount_ServerBranch[0].TitleBranch + "\"}" +
        ")'/></td>"
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
async function showLogBudget(Obj) {

    //--------------------------------toggle show & hide
    if (_showLogStatus == false) {
        _showLogStatus = true
    }
    else {
        _showLogStatus = false
    }
    //-------------------------------

    /*
لاگ مربوط به تاریخچه بودجه شعبه
*/
    Obj_Discount_BudgetIncrease.OrderBy = "Id"
    Obj_Discount_BudgetIncrease.Is_Increase = false
    Obj_Discount_BudgetIncrease.Filter = "(ServerBranch/Id eq " + Obj.ServerBranchId + ")"
    var BudgetIncrease = await get_Records(Obj_Discount_BudgetIncrease)

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


    Obj_Discount_Detail.OrderBy = "Id"
    Obj_Discount_Detail.Is_Increase = false
    // Obj_Discount_Detail.Filter =""
    Obj_Discount_Detail.Filter = "(ServerBranch/Id eq " + Obj.ServerBranchId + ")"
    var DiscountVal = await get_Records(Obj_Discount_Detail)



    var types = {};
    for (let index2 = 0; index2 < DiscountVal.length; index2++) {

        var SaleDocCode = DiscountVal[index2].MasterId.SaleDocCode;
        if (!types[SaleDocCode]) {
            types[SaleDocCode] = [];
        }

        types[SaleDocCode].push({ id: DiscountVal[index2].Id, UnitPrice: DiscountVal[index2].UnitPrice, Famount: DiscountVal[index2].Famount, DiscountVal: DiscountVal[index2].DiscountVal, DateCreate: DiscountVal[index2].MasterId.DateCreated });
        _sum -= (DiscountVal[index2].DiscountVal * DiscountVal[index2].Famount * DiscountVal[index2].UnitPrice) / 100;
    }
    var sumDiscountVal
    for (var SaleDocCode in types) {
        sumDiscountVal = 0
        for (let index = 0; index < types[SaleDocCode].length; index++) {

            var MablaghTakhfifi = (parseFloat(types[SaleDocCode][index].DiscountVal) * parseFloat(types[SaleDocCode][index].UnitPrice) * parseFloat(types[SaleDocCode][index].Famount)) / 100
            sumDiscountVal += parseInt(MablaghTakhfifi);
        }
        _LogTransactionArray.push({ type: 0, type2: "فاکتور", BudgetPrice: sumDiscountVal, SaleDocCode: SaleDocCode, DateCreate: types[SaleDocCode][0].DateCreate })
    }


    _Transaction = { types: types, LogTransactionArray: _LogTransactionArray }


    _CurrentBudget = _sum



    _LogTransactionArray.sort(function (a, b) {
        var a1 = a.DateCreate, b1 = b.DateCreate;
        if (a1 == b1) return 0;
        return a1 > b1 ? 1 : -1;
    });



    var table = "<h3>تاریخچه</h3><table class='table'>"
    table += "<tr><th>نوع</th><th>مبلغ</th><th>تاریخ</th><th>فاکتور</th><th>مسئول مربوطه</th></tr>"

    for (let index = 0; index < _LogTransactionArray.length; index++) {
        table += "<tr  style=color:" + (_LogTransactionArray[index].type == 1 ? "green" : "red") + ">" +
            "<td>" + _LogTransactionArray[index].type2 + "</td>" +
            "<td>" + SeparateThreeDigits(_LogTransactionArray[index].BudgetPrice) + "</td>" +
            "<td>" + foramtDate(_LogTransactionArray[index].DateCreate) + "</td>" +
            "<td>" + (_LogTransactionArray[index].SaleDocCode == undefined ? "..." : _LogTransactionArray[index].SaleDocCode) + "</td>" +
            "<td>" + (_LogTransactionArray[index].WhoIncrease == undefined ? "..." : _LogTransactionArray[index].WhoIncrease) + "</td>" +
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

//-------------------------------------Find Factor
async function FindFactor() {
    $.LoadingOverlay("show");

    var Factor = $("input[name='factorSearch']").val();
    _ServiceObj.Factor = Factor
    _ServiceObj.typeWebService="findFactor"
    var Factor = await serviceDiscount(_ServiceObj);

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

    // var TypeTakhfif = $("#DarTaahod option:selected").val();


    Obj_Discount_Confirm.OrderBy = "Id"
    Obj_Discount_Confirm.Is_Increase = false
    Obj_Discount_Confirm.Filter = "(ConfirmRow/Row eq " + 1 + ") and (ServerBranch/Id eq " + _ServiceObj.ServerBranchId + ")"
    // var Discount_Confirm = await get_Records(Obj_Discount_Confirm)


    Obj_Discount_ServerBranch.OrderBy = "Id"
    Obj_Discount_ServerBranch.Is_Increase = false
    Obj_Discount_ServerBranch.ID = _ServiceObj.ServerBranchId
    // var  Discount_ServerBranch = await get_RecordByID(Obj_Discount_ServerBranch)

    Obj_Discount_Master.OrderBy = "Id"
    Obj_Discount_Master.Is_Increase = false
    Obj_Discount_Master.Filter = "(SaleDocCode eq " + _Factor[0].SaleDocCode + ")"
    // var Discount_Master = await get_Records(Obj_Discount_Master)

    var results = await Promise.all([
        get_RecordByID(Obj_Discount_ServerBranch),
        get_Records(Obj_Discount_Master),
        get_Records(Obj_Discount_Confirm)
    ]);

    var Discount_ServerBranch = results[0]
    var Discount_Master = results[1]
    var Discount_Confirm = results[2]

    var _sum = 0
    $("#ShowFactorDetail table  .rows").each(function () {

        var DataId = $(this).attr("DataId")

        if ($(this).find(".discountVal").val() != "") {
            var discountVal = parseFloat($(this).find(".discountVal").val())
            var Famount = parseFloat($(this).find(".Famount").text())
            var UnitPrice = parseFloat($(this).find(".UnitPrice").text())

            _Factor[DataId].DiscountVal = parseFloat($(this).find(".discountVal").val())
            _sum += Math.round((discountVal * Famount * UnitPrice) / 100)

        }
        else {
            _Factor[DataId].DiscountVal = 0
        }

    })

    var arrayMessage = checkValidation(Discount_Master, _sum, Discount_ServerBranch)

    if (arrayMessage.length > 0) {
        ShowMessage(arrayMessage)
    }
    else {
        if (Discount_ServerBranch.CurrentBudget < _sum) {
            $.LoadingOverlay("hide");
            var res = await customConfirm({ sum: _sum, CurrentBudget: Discount_ServerBranch.CurrentBudget })
            if (res.value == true) {
                $.LoadingOverlay("show");
            }
            else {
                $.LoadingOverlay("hide");
                $('#btnSave').prop('disabled', false);
                return;
            }
        }

        var statusSave = false;
        //----master

        // _Factor[0].TypeTakhfif = TypeTakhfif

        
        var obj = {
            Title: _Factor[0].Title,
            SaleDocCode: _Factor[0].SaleDocCode,
            OrderDate: _Factor[0].OrderDate,
            FinalDate: _Factor[0].FinalDate,
            SaleDOcstate: _Factor[0].SaleDOcstate,
            CustomerCode: _Factor[0].CustomerCode,
            // sum: Math.round(_sum),
            UserId: _spPageContextInfo.userId,
            IdUser: _spPageContextInfo.userId,
            TitleUser: _spPageContextInfo.userLoginName,
            DateCreated: today,
            // Step: 1,
            StatusWorkFlowId: 4,/*در گردش*/
            CID: CurrentCID,
            // TypeTakhfifId: TypeTakhfif,
            // IDTypeTakhfif: TypeTakhfif,
            ServerBranchId: _ServiceObj.ServerBranchId,
            TimeCreated: CurrentTime(),
            
            SaleDocId:parseFloat(_Factor[0].SaleDocId)
        }


        /*-----------ویرایش موجودی شعبه----------------- */
        Obj_Discount_ServerBranch.ID = _ServiceObj.ServerBranchId
        var get_Discount_ServerBranch = await get_RecordByID(Obj_Discount_ServerBranch)

        var price = get_Discount_ServerBranch.CurrentBudget - Math.round(_sum)
        var update_Discount_ServerBranch = await update_Record(obj.ServerBranchId, { CurrentBudget: price }, "Discount_ServerBranch")
        /*-----------create Master----------------- */
        var Master = await create_Record(obj, "Discount_Master")
        var MasterId = Master.data.ID

        //----detail

        for (let index = 0; index < _Factor.length; index++) {

            var obj = {
                Title: "Record2",
                MasterIdId: MasterId,
                Productcode: _Factor[index].Productcode,
                FinalPriceWithoutTax: _Factor[index].FinalPriceWithoutTax,
                FinalPriceWithTax: _Factor[index].FinalPriceWithTax,
                DiscountPrice: _Factor[index].DiscountPrice,
                VDiscount_Price: _Factor[index].VDiscount_Price,
                GDiscount_Price: _Factor[index].GDiscount_Price,
                CDiscount_Price: _Factor[index].CDiscount_Price,
                TaxesPercent: _Factor[index].TaxesPercent,
                VdisPercent: _Factor[index].VdisPercent,
                Gdispercent: _Factor[index].Gdispercent,
                Cdispercent: _Factor[index].Cdispercent,
                UnitPrice: _Factor[index].UnitPrice,
                Famount: _Factor[index].Famount,
                NoInpack: _Factor[index].NoInpack,
                SuppName: _Factor[index].SuppName,
                SuppCode: _Factor[index].SuppCode,
                ProductName: _Factor[index].ProductName,
                SaleDocTypeDesc: _Factor[index].SaleDocTypeDesc,
                FinalBox: _Factor[index].FinalBox,
                DiscountVal: _Factor[index].DiscountVal.toString(),
                DateCreated: todayShamsy8char(),
                ServerBranchId: _ServiceObj.ServerBranchId,
                BrandId: _Factor[index].BrandId,
                BrandDesc: _Factor[index].BrandDesc,
                Step: 1,
                TypeTakhfifId: 1,/*در تعهد شعبه */
                StatusWorkFlowId: 4,/*در گردش*/
                CurrentConfirmId: Discount_Confirm[0].Confirmator.Id,
            }

            var Detail = await create_Record(obj, "Discount_Detail")
            if (Detail == "error") {
                statusSave = false
            }
            else {
                statusSave = true
            }


        }

        if (statusSave == true) {
            ShowUserInfo();
            $.LoadingOverlay("hide");
            $('#btnSave').prop('disabled', false);
            //alert("با موفقیت ذخیره شد")
            showAlert()
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
    $(thiss).parent().next().append("<span>" + SeparateThreeDigits(Math.round((val * Famount * UnitPrice) / 100)) + "</span>")
    // alert(SeparateThreeDigits((val*Famount*Famount)/100))
}
function effectTotalFactor() {


    var x = $("#effectTotalFactorPercent").val()
    $("#ShowFactorDetail .detailsFactor tr").each(function () {
        $(".discountVal").val(x)
        var Famount = $(this).find(".Famount").text()
        var UnitPrice = $(this).find(".UnitPrice").text()
        $(this).find(".MeghdarTakhfif").empty()
        $(this).find(".MeghdarTakhfif").append("<span>" + SeparateThreeDigits(Math.round((x * Famount * UnitPrice) / 100)) + "</span>")
        //$(this).val(x)
        
    })

}
function checkValidation(Discount_Master, _sum, Discount_ServerBranch) {

    var arrayMessage = []
    if (Discount_Master.length > 0) {

        arrayMessage.push({ message: "برای این فاکتور تخفیف گرفته شده است" })
    }
    if (_sum == 0) {

        arrayMessage.push({ message: "هیچ تخفیفی در نظر گرفته نشده است" })
    }
    // if (_sum > Discount_ServerBranch.CurrentBudget) {
    //     arrayMessage.push({ message: "بودجه شما کافی نمیباشد" })
    // }
    return arrayMessage
}
function customConfirm(obj) {

    return new Promise(resolve => {
        Swal.fire({
            title: "<p style='text-align: justify;'>احتراما مقدار تخفیف فاکتور جاری  " +
                "<span style='color:red'>" +
                SeparateThreeDigits(obj.sum) + "</span>" +
                " کمتر از دارایی  " + "<span style='color:red'>" +
                SeparateThreeDigits(obj.CurrentBudget) + "</span>" +
                " میباشد</p>",
            text: "در صورت موافقت بر روی دکمه  ادامه  کلیک نمایید",
            icon: 'info',
            showCancelButton: true,
            cancelButtonText: 'توقف',
            confirmButtonColor: '#3085d6!important',
            cancelButtonColor: 'red!important',
            confirmButtonText: 'ادامه'
        }).then((result) => {
            resolve(result)
        })
    });
}
async function myRequest() {
    $.LoadingOverlay("show");
    Obj_Discount_Master.OrderBy = "Id"
    Obj_Discount_Master.Is_Increase = false

    Obj_Discount_Master.Filter = "(IdUser eq " + _spPageContextInfo.userId + ")"

    var results = await Promise.all([

        get_Records(Obj_Discount_Master),

    ]);

    var Discount_Master = results[0]
    console.log(Discount_Master)
    var table = "<table class='table-bordered table'>"
    table += "<tr><th>شماره فاکتور</th>"+
    "<th>تاریخ</th>"+
    "<th>ساعت</th>"+
    "<th>وضعیت</th>"+
    "<th>شعبه</th>"+
    "<th>کد مشتری</th>"+
    "</tr>"
    for (let index = 0; index < Discount_Master.length; index++) {
        table += "<tr>"
        table += "<td>" + Discount_Master[index].SaleDocCode + "</td>"+
        "<td>" +foramtDate(Discount_Master[index].DateCreated) + "</td>"+
        "<td>" +foramtTime(Discount_Master[index].TimeCreated) + "</td>"+
        "<td>"+Discount_Master[index].StatusWorkFlow.Title+ "</td>"+
        "<td>"+Discount_Master[index].ServerBranch.Title+ "</td>"+
        "<td>"+Discount_Master[index].CustomerCode+ "</td>"
        
        

        table += "</tr>"
    }
    table += "<table>"
    $("#ShowFactorHeader").empty()
    $("#ShowFactorDetail").empty()
    $("#ShowFactorDetail").append(table)
    $.LoadingOverlay("hide");
}
async function InsertToInsertSaleDocsMarketingDiscounts(){
    
    _ServiceObj.typeWebService="InsertSaleDocsMarketingDiscounts"
    _ServiceObj.SaleDocId="200128.671"
    _ServiceObj.SqlQuery="insert into SaleDocsMarketingDiscounts"+
                "(SaleDocId,PortalStatus)"+
                "select "+ _ServiceObj.SaleDocId + ","+5+
                " SELECT SCOPE_IDENTITY() AS NewID";
                debugger
    var Factor = await serviceDiscount(_ServiceObj);
    console.log(Factor.lstInvoice[0].IdSaleDocsMarketingDiscounts)
var IdSaleDocsMarketingDiscounts=parseInt();
    var CreatePromise = []
    CreatePromise.push(update_Record(115,
        {
            IdSaleDocsMarketingDiscounts:Factor.lstInvoice[0].IdSaleDocsMarketingDiscounts,
        },
        "Discount_Master"))
        var results = await Promise.all(CreatePromise);
    debugger
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
//--------------------------------------------------------------------web service
function serviceDiscount(_ServiceObj) {

    return new Promise(resolve => {
        var serviceURL = "https://portal.golrang.com/_vti_bin/SPService.svc/DiscountData"
        // var request = { SaleDocCode: Factor, IpServer: "192.168.10.201", DB: "ISS" }
       // var typeWebService="findFactor"
        var request = { SaleDocCode: _ServiceObj.Factor, IpServer: _ServiceObj.IP_Server,
             DB: _ServiceObj.DB,
             typeWebService:_ServiceObj.typeWebService,
             SaleDocId:_ServiceObj.SaleDocId,
             SqlQuery:_ServiceObj.SqlQuery
             }
        
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
                debugger
                resolve(data);

            },
            error: function (a) {
                debugger
                console.log(a);
            }
        });
    })
}


