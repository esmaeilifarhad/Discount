var Obj_Initial = {}
var _Factor = [];
// var _CurrentBudget;

//-----------------------------------
var Obj_Discount_Log = {
    NameList: "Discount_Log",
    Select: "MasterId/Title,MasterId/Id,ConfirmId/Title,ConfirmId/Id,ConfirmId/Moshakhasat,Id,Title,Result,Dsc,DateConfirm,TimeConfirm",
    Filter: "",
    Expand: "MasterId,ConfirmId",
    OrderBy: "Id",
    Is_Increase: true
}
const Obj_Discount_ServerBranch = {
    NameList: "Discount_ServerBranch",
    Select: "User/Id,User/Title,Moavenat/Title,Moavenat/Id,Id,Title,IP_Server,TitleBranch,DataBaseName,CurrentBudget",
    Filter: "",
    Expand: "Moavenat,User",
    OrderBy: "Moavenat/Title",
    Is_Increase: true
}
const Obj_Discount_BaseData = {
    NameList: "Discount_BaseData",
    Select: "Id,Title,Code,Order",
    Filter: "",
    Expand: "",
    OrderBy: "Order",
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
const Obj_Discount_Master = {
    NameList: "Discount_Master",
    Select: "ServerBranch/Id,ServerBranch/Title,User/Id,User/Title,TypeTakhfif/Id,TypeTakhfif/Title,IDTypeTakhfif,StatusWorkFlow/Id,StatusWorkFlow/Title," +
        "Id,Title,SaleDocCode,OrderDate,TitleUser,TitleUser,CustomerCode,Step,DateCreated,sum,TimeCreated",
    Filter: "",
    Expand: "User,ServerBranch,TypeTakhfif,StatusWorkFlow",
    OrderBy: "Id",
    Is_Increase: true
}

const Obj_Discount_Detail = {
    NameList: "Discount_Detail",
    Select: "ServerBranch/Id,MasterId/IdUser,MasterId/SaleDocCode,MasterId/Id,MasterId/Title," +
        "MasterId/Id,MasterId/Title,MasterId/SaleDocCode,MasterId/OrderDate,MasterId/IDTypeTakhfif ,MasterId/FinalDate,MasterId/CustomerCode," +
        "MasterId/sum,MasterId/Step,MasterId/CID,MasterId/TitleUser," +
        "Id,Title,ProductName,DiscountVal," +
        "FinalPriceWithoutTax,FinalPriceWithTax,DiscountPrice,BrandId,BrandDesc,VDiscount_Price,GDiscount_Price,CDiscount_Price,Step," +
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
        "Id,Title,DiscountVal,MasterId/DateCreated,Famount,UnitPrice",
    Filter: "",
    Expand: "MasterId,ServerBranch",
    OrderBy: "Id",
    Is_Increase: true
}

const Obj_Discount_Brand = {
    NameList: "Discount_Brand",
    Select: "Id,Title,BrandId,MarketingDirector/Id,MarketingDirector/Title,MarketingDirector/CurrentBudget",
    Filter: "",
    Expand: "MarketingDirector",
    OrderBy: "Id",
    Is_Increase: true
}

const Obj_MarketingDirector = {
    NameList: "Discount_MarketingDirector",
    Select: "Id,Title,User/Id,User/Title,CurrentBudget",
    Filter: "",
    Expand: "User",
    OrderBy: "Id",
    Is_Increase: true
}

$(document).ready(function () {
    Initial()
    ShowTaskCartabl();
});
//-----------------------------------------------------------
function Initial() {
    //-----npm initial header Request
    $pnp.setup({
        headers: {
            "Accept": "application/json; odata=verbose"
        }
    });
    //-------------
    Obj_Initial.CurrentCID = sessionStorage.getItem("CID");
    Obj_Initial.CurrentPID = sessionStorage.getItem("PID");
    Obj_Initial.CurrentName = sessionStorage.getItem("PFName");
    Obj_Initial.CurrentDep = sessionStorage.getItem("DName");
    Obj_Initial.CurrentPLoginName = sessionStorage.getItem("CurrentPLoginName");
    Obj_Initial.today = todayShamsy8char()
    Obj_Initial.userId = _spPageContextInfo.userId
    Obj_Initial.webAbsoluteUrl = _spPageContextInfo.webAbsoluteUrl;

}
async function ShowTaskCartabl() {
    $.LoadingOverlay("show");

    Obj_Discount_Confirm.OrderBy = "Id"
    Obj_Discount_Confirm.Is_Increase = false
    Obj_Discount_Confirm.Filter = "(Confirmator/Id eq " + _spPageContextInfo.userId + ")"
    var Discount_Confirm = await get_Records(Obj_Discount_Confirm)


    var Filter = "";
    for (let index = 0; index < Discount_Confirm.length; index++) {
        Filter += "(StatusWorkFlow/Id eq " + 4 + ") and (ServerBranch/Id eq " + Discount_Confirm[index].ServerBranch.Id + ") and (Step eq " + Discount_Confirm[index].ConfirmRow.Row + ") or"
    }
    Filter = removeCountChar(Filter, 3)

    Obj_Discount_Master.OrderBy = "Id"
    Obj_Discount_Master.Is_Increase = false
    Obj_Discount_Master.Filter = Filter
    var Discount_Master = await get_Records(Obj_Discount_Master)


    //---------------------------------------فقط برندهای مربوط به خودم را مشاهده میکنم
    Obj_MarketingDirector.OrderBy = "Id"
    Obj_MarketingDirector.Is_Increase = false
    Obj_MarketingDirector.Filter = "(User/Id eq " + _spPageContextInfo.userId + ")"
    var MarketingDirector = await get_Records(Obj_MarketingDirector)

    var CreatePromise = []
    for (let index = 0; index < MarketingDirector.length; index++) {
        Obj_Discount_Brand.OrderBy = "Id"
        Obj_Discount_Brand.Is_Increase = false
        Obj_Discount_Brand.Filter = "(MarketingDirector/Id eq " + MarketingDirector[index].Id + ")"

        CreatePromise.push(get_Records(Obj_Discount_Brand))
    }

    var Discount_Brand = await Promise.all(CreatePromise);



    var CreatePromise = []
    for (let index2 = 0; index2 < Discount_Brand.length; index2++) {
        if (Discount_Brand[index2].length == 0) continue
        for (let index = 0; index < Discount_Brand[index2].length; index++) {

            Obj_Discount_Detail.OrderBy = "Id"
            Obj_Discount_Detail.Is_Increase = false
            Obj_Discount_Detail.Filter = "(Step eq " + 3 + ") and " +
                "(MasterId/IDTypeTakhfif eq " + 2 + ") and " +
                "(BrandId eq " + Discount_Brand[index2][index].BrandId + ")"
            CreatePromise.push(get_Records(Obj_Discount_Detail))
        }
    }

    var results = await Promise.all(CreatePromise);

    for (let index = 0; index < results.length; index++) {
        if (results[index].length > 0) {

            Obj_Discount_Master.ID = results[index][0].MasterId.Id
            var Discount_Master2 = await get_RecordByID(Obj_Discount_Master)
            Discount_Master2.BrandId = results[index][0].BrandId
            Discount_Master.push(Discount_Master2)
        }
    }
    //------------------------------------------------------
    ShowTaskCartablTable(Discount_Master)
    $.LoadingOverlay("hide");

}
function ShowTaskCartablTable(Discount_Master) {
    var table = "<table class='table'>"
    table += "<tr><th>ردیف</th><th>SaleDocCode</th><th>OrderDate</th>" +
        "<th>sum</th><th>TitleUser</th>" +
        "<th>CustomerCode</th>" +
        "<th>Step</th>" +
        "<th>DateCreated</th>" +
        "<th>نمایش فاکتور</th>" +
        "</tr>"
    for (let index = 0; index < Discount_Master.length; index++) {

        table += "<tr BrandId=" + Discount_Master[index].BrandId + "><td>" + (index + 1) + "</td>" +
            "<td>" + Discount_Master[index].SaleDocCode + "</td>" +
            "<td>" + foramtDate(Discount_Master[index].OrderDate) + "</td>" +
            "<td>" + SeparateThreeDigits(Discount_Master[index].sum) + "</td>" +
            "<td>" + Discount_Master[index].TitleUser + "</td>" +
            "<td>" + Discount_Master[index].CustomerCode + "</td>" +
            "<td>" + Discount_Master[index].Step + "</td>" +
            "<td>" + foramtDate(Discount_Master[index].DateCreated) + " - " + foramtTime(Discount_Master[index].TimeCreated) + "</td>" +
            "<td>" +
            "<input value='نمایش' type='button' style='background-color: #97161b!important;' " +
            "onclick='ShowFactorDetail(" +
            "{BranchTitle:\"" + Discount_Master[index].ServerBranch.Title + "\"," +
            "MasterId:" + Discount_Master[index].Id + "," +
            "ServerBranchId:" + Discount_Master[index].ServerBranch.Id + "," +
            "CustomerCode:" + Discount_Master[index].CustomerCode + "," +
            "BrandId:\"" + Discount_Master[index].BrandId + "\"," +
            "Step:" + Discount_Master[index].Step + "}" +
            ")' />" +
            "</td>" +
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
async function ShowFactorDetail(obj) {

    Obj_Discount_BaseData.OrderBy = "Id"
    Obj_Discount_BaseData.Is_Increase = true
    Obj_Discount_BaseData.Filter = "(Code eq " + 1 + ")"
    // var Discount_BaseData = await get_Records(Obj_Discount_BaseData)


    Obj_Discount_Detail.OrderBy = "Id"
    Obj_Discount_Detail.Is_Increase = false
    Obj_Discount_Detail.Filter = "(MasterId/Id eq " + obj.MasterId + ")"
    // var Detail_Factor = await get_Records(Obj_Discount_Detail)

    Obj_Discount_Master.OrderBy = "Id"
    Obj_Discount_Master.Is_Increase = false
    Obj_Discount_Master.ID = obj.MasterId
    // var Discount_Master = await get_RecordByID(Obj_Discount_Master)

    Obj_Discount_ServerBranch.OrderBy = "CurrentBudget"
    Obj_Discount_ServerBranch.Is_Increase = false
    Obj_Discount_ServerBranch.ID = obj.ServerBranchId
    // var Discount_ServerBranch = await get_RecordByID(Obj_Discount_ServerBranch)

    Obj_Discount_Log.OrderBy = "Id"
    Obj_Discount_Log.Is_Increase = false
    Obj_Discount_Log.Filter = "(MasterId/Id eq " + obj.MasterId + ")"
    // var Log = await get_Records(Obj_Discount_Log)


    Obj_Discount_Confirm.OrderBy = "Id"
    Obj_Discount_Confirm.Is_Increase = false
    Obj_Discount_Confirm.Filter = "(Confirmator/Id eq " + _spPageContextInfo.userId + ") and" +
        " (ServerBranch/Id eq " + obj.ServerBranchId + ") and " +
        "(ConfirmRow/Row eq " + obj.Step + ")"


    Obj_Discount_Brand.OrderBy = "Id"
    Obj_Discount_Brand.Is_Increase = false
    Obj_Discount_Brand.Filter = (obj.BrandId == "undefined" ? "" : "(BrandId eq " + obj.BrandId + ") ")
    // var MarketingDirector = await get_Records(Obj_MarketingDirector)




    var results = await Promise.all([
        get_Records(Obj_Discount_BaseData),
        get_Records(Obj_Discount_Detail),
        get_RecordByID(Obj_Discount_Master),
        get_RecordByID(Obj_Discount_ServerBranch),
        get_Records(Obj_Discount_Log),
        get_Records(Obj_Discount_Confirm),
        get_Records(Obj_Discount_Brand)
    ]);
    var Discount_BaseData = results[0]
    var Detail_Factor = results[1]
    var Discount_Master = results[2]
    var Discount_ServerBranch = results[3]
    var Log = results[4]
    var Discount_Confirm = results[5]
    var Discount_Brand = results[6]





    ShowHeaderbranch(Discount_ServerBranch, Discount_Confirm, Discount_Brand, obj)

    ShowHeaderFactor(Discount_Master, Discount_BaseData, Detail_Factor)

    ShowDetailFactor(Detail_Factor, obj)

    ShowDecision(obj, Detail_Factor, Discount_Confirm, Discount_Brand)

    ShowLog(Log)

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
async function save(obj) {
    $('.btnSave').prop('disabled', true);
    $.LoadingOverlay("show");

    var arrayDetails = []

    var description = $("#Decision1 textarea").val()
    var result = $("input[name='decide']:checked").val()
    var TypeTakhfif = $("#DarTaahod option:selected").val();



    Obj_Discount_ServerBranch.OrderBy = "CurrentBudget"
    Obj_Discount_ServerBranch.Is_Increase = false
    Obj_Discount_ServerBranch.ID = obj.ServerBranchId
    // var Discount_ServerBranch = await get_RecordByID(Obj_Discount_ServerBranch)
    //------------------------------
    Obj_Discount_Master.OrderBy = "Id"
    Obj_Discount_Master.Is_Increase = false
    Obj_Discount_Master.ID = obj.MasterId
    // var Obj_Discount_Master = await get_RecordByID(Obj_Discount_Master)
    //-------------------------------


    Obj_Discount_Detail.OrderBy = "Id"
    Obj_Discount_Detail.Is_Increase = false
    Obj_Discount_Detail.Filter = "(MasterId/Id eq  " + obj.MasterId + ")"
    //--------------------------------
    var results = await Promise.all([
        get_RecordByID(Obj_Discount_ServerBranch),
        get_RecordByID(Obj_Discount_Master),
        get_Records(Obj_Discount_Detail)
    ]);


    var Discount_ServerBranch = results[0]
    var Discount_Master = results[1]
    var Discount_Detail = results[2]

    var arrayMessage = checkValidation(result, description)

    var OldSum = Discount_Master.sum
    //------محاسبه جمع تخفیف ها
    var NewSum = 0
    $("#Detail1 table  .rows").each(function () {
        var DataId = parseInt($(this).attr("DataId"))
        if ($(this).find(".discountVal").val() != "") {
            var discountVal = parseFloat($(this).find(".discountVal").val())
            var Famount = parseFloat(removeComma($(this).find(".Famount").text()))
            var UnitPrice = parseFloat(removeComma($(this).find(".UnitPrice").text()))
            var priceCal = (discountVal * Famount * UnitPrice) / 100
            NewSum += Math.round(priceCal)
            arrayDetails.push({ ID: DataId, discountVal: discountVal })
        }
        else {
            arrayDetails.push({ ID: DataId, discountVal: discountVal })
        }
    })

    if (arrayMessage.length > 0) {
        ShowMessage(arrayMessage)
    }


    else {
        //--------------اگر بودجه کمتر بود پیغام میدهد

        if (result == "1") {
            if (Discount_ServerBranch.CurrentBudget < NewSum) {
                $.LoadingOverlay("hide");
                var res = await customConfirm({ sum: NewSum, CurrentBudget: Discount_ServerBranch.CurrentBudget })
                if (res.value == true) {
                    $.LoadingOverlay("show");
                }
                else {
                    $.LoadingOverlay("hide");
                    $('.btnSave').prop('disabled', false);
                    return;
                }
            }
        }
        //--------------------------------------------
        var NextStep = FindNextStep(Discount_Master, result, TypeTakhfif)

        //---------------------------------------

        var objDiscountServerBranch = {}

        //--تایید
        if (result == "1" && (Discount_Master.Step == 1 || Discount_Master.Step == 2) && TypeTakhfif == "1") {
            objDiscountServerBranch.CurrentBudget = (OldSum < NewSum ?
                (Discount_ServerBranch.CurrentBudget - (NewSum - OldSum)) :
                (Discount_ServerBranch.CurrentBudget + (OldSum - NewSum)))
        }
        /*
        عدم تایید
        و کل بودجه به شعبه باید برگردد
        */
        if (result == "2" && (Discount_Master.Step == 1 || Discount_Master.Step == 2)) {
            objDiscountServerBranch.CurrentBudget = Discount_ServerBranch.CurrentBudget + OldSum
        }
        /*
اگر قبلا در تعهد شعبه بوده و الان بخواد در تعهد دفتر مرکزی بشه باید کل بودجه به شعبه برگردد
        */
        debugger
        if (TypeTakhfif == "2" && Discount_Master.TypeTakhfif.Id == 1) {
            objDiscountServerBranch.CurrentBudget = Discount_ServerBranch.CurrentBudget + OldSum
        }

        //------------------------------------------------------------

        var CreatePromise = []
        for (let index = 0; index < arrayDetails.length; index++) {
            CreatePromise.push(
                update_Record(arrayDetails[index].ID,
                    {
                        DiscountVal: arrayDetails[index].discountVal.toString(),
                        Step: NextStep.NextStep,
                        StatusWorkFlowId: NextStep.StatusWorkFlow
                    },
                    "Discount_Detail"))
        }
        CreatePromise.push(
            update_Record(obj.ServerBranchId,
                {
                    CurrentBudget: objDiscountServerBranch.CurrentBudget
                },
                "Discount_ServerBranch"
            ))
        CreatePromise.push(
            update_Record(obj.MasterId,
                {
                    sum: NewSum,
                    TypeTakhfifId: parseInt(TypeTakhfif),
                    IDTypeTakhfif: parseInt(TypeTakhfif),
                    Step: NextStep.NextStep,
                    StatusWorkFlowId: NextStep.StatusWorkFlow
                },
                "Discount_Master"
            ))
        CreatePromise.push(create_Record({
            Title: "Record",
            MasterIdId: obj.MasterId,
            Result: (result == "1" ? "تایید" : "عدم تایید"),
            Dsc: description,
            DateConfirm: todayShamsy8char(),
            TimeConfirm: CurrentTime(),
            ConfirmIdId: obj.ConfirmId,

        }, "Discount_Log"))
        var results = await Promise.all(CreatePromise);

        //-------------------------------
        $.LoadingOverlay("hide");
        showAlert()
        $("#window").data("kendoWindow").close();
        ShowTaskCartabl();
        $.LoadingOverlay("hide");

    }


}
/*
درخواست دهنده فرم خود را ویرایش میکند
وقتی بر روی دکمه ذخیره کلیک میکند 
*/
async function saveEdit(MasterId) {

    $('#btnSave').prop('disabled', true);
    $.LoadingOverlay("show");
    var arrayMessage = []
    var NewSum = 0

    $("#Detail1 table .rows").each(function () {

        var newObj = {}
        var DataId = $(this).attr("DataId")
        newObj.ID = parseInt(DataId)

        if ($(this).find(".discountVal").val() != "") {
            newObj.DiscountVal = parseInt($(this).find(".discountVal").val())
            NewSum += parseInt($(this).find(".discountVal").val())
        }
        else {
            newObj.DiscountVal = 0

        }
        _Factor.push(newObj)

    })


    if (NewSum == 0) {

        arrayMessage.push({ message: "هیچ تخفیفی در نظر گرفته نشده است" })
    }
    _CurrentBudget = await getCurrentBudget()
    if (NewSum > _CurrentBudget) {
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

function showAlert() {
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
function checkValidation(result, description, arrayDetails) {

    var arrayMessage = []
    if (result == undefined) {
        arrayMessage.push({ message: "لطفا نتیجه را مشخص نمایید" })
    }

    if (result == 2 && description.trim() == "") {
        arrayMessage.push({ message: "لطفا در صورت عدم تایید توضیحات را پر نمایید." })
    }


    return arrayMessage
}
function CalulateDarsad(thiss, Famount, UnitPrice) {

    //console.log($(thiss))
    var val = $(thiss).val()
    //console.log($(thiss).parent().next().find("span"))
    $(thiss).parent().next().find("span").remove()
    $(thiss).parent().next().append("<span>" + SeparateThreeDigits((val * Famount * UnitPrice) / 100) + "</span>")
    // alert(SeparateThreeDigits((val*Famount*Famount)/100))
}
function FindNextStep(Discount_Master, result, TypeTakhfif) {
    /*
  value=1 تایید
  value=2 عدم تایید
  value=3 نیاز به اصلاح
  value=4 نیاز به تخفیف مدیریتی
  ------------------
  1    در تعهد شعبه
  2    در تعهد دفتر مرکزی
  3    در تعهد شرکت تولیدی 
  -------------------StatusWorkFlow
  4    درگردش
  5    پایان
  6    تایید نشده
  ---------------------
    */
    var objResult = {}
    // تایید
    if (result == "1") {
        if (TypeTakhfif == "2" && Discount_Master.Step == 1) {
            objResult.NextStep = 3
            objResult.StatusWorkFlow = 4
        }
        if (TypeTakhfif == "1" && Discount_Master.Step == 1) {
            objResult.NextStep = 2
            objResult.StatusWorkFlow = 4
        }
        if (TypeTakhfif == "1" && Discount_Master.Step == 2) {
            objResult.NextStep = 2
            objResult.StatusWorkFlow = 5
        }
        if (TypeTakhfif == "2" && Discount_Master.Step == 2) {
            objResult.NextStep = 3
            objResult.StatusWorkFlow = 4
        }
    }
    //عدم تایید
    if (result == "2") {
        objResult.StatusWorkFlow = 6
        objResult.NextStep = 0
    }
    if (result == "3") {

    }
    if (result == "4") {

    }

    return objResult
}

//--------------------------------------نمایش بخش های مختلف فاکتور
/*نمایش هدر بودجه جاری و مشخصات شعبه */
function ShowHeaderbranch(Discount_ServerBranch, Discount_Confirm, Discount_Brand, obj) {

    if (obj.Step == 3) {
        var Headerbranch = "<table class='table'>" +
            "<tr><td>مدیر بازاریابی : " + Discount_Brand[0].MarketingDirector.Title + "</td>" +
            "<td>بودجه مدیر : " + SeparateThreeDigits(Discount_Brand[0].MarketingDirector.CurrentBudget) + "</td>" +
            // "<td>نقش : " + Discount_Confirm[0].ConfirmRow.Title + "</td>" +
            // "<td>مرحله : " + Discount_Confirm[0].ConfirmRow.Row + "</td>" +
            "</tr></table>"
        $("#branch1 table").remove()
        $("#branch1").append(Headerbranch)
    }
    else {
        var Headerbranch = "<table class='table'>" +
            "<tr><td>شعبه : " + Discount_ServerBranch.Title + "</td>" +
            "<td>بودجه شعبه : " + SeparateThreeDigits(Discount_ServerBranch.CurrentBudget) + "</td>" +
            "<td>نقش : " + Discount_Confirm[0].ConfirmRow.Title + "</td>" +
            "<td>مرحله : " + Discount_Confirm[0].ConfirmRow.Row + "</td>" +
            "</tr></table>"
        $("#branch1 table").remove()
        $("#branch1").append(Headerbranch)
    }
}
/*نمایش هدر فاکتور */
function ShowHeaderFactor(Discount_Master, Discount_BaseData, Detail_Factor) {
    var SumTotal = 0
    for (let index = 0; index < Detail_Factor.length; index++) {
        SumTotal += parseInt(Detail_Factor[index].DiscountVal);
    }

    var HeaderFactor = "<table class='table'>"
    HeaderFactor += "<tr><td>کد فاکتور : " + Discount_Master.SaleDocCode + "</td><td>کد مشتری : " + Discount_Master.CustomerCode + "</td><td>تاریخ  : " + foramtDate(Discount_Master.OrderDate) + "</td></tr>"
    HeaderFactor += "<tr><td style='color:red'>مجموع مبلغ تخفیف : " + SeparateThreeDigits(Discount_Master.sum/*Detail_Factor[0].MasterId.sum*/) + "</td>" +
        "<td>مرحله : " + Discount_Master.Step + "</td>" +
        "<td>ثبت کننده  : " + Discount_Master.TitleUser + "</td>"
    HeaderFactor += "<td>نوع درخواست : <select id='DarTaahod'>"
    for (let index = 0; index < Discount_BaseData.length; index++) {

        if (Discount_BaseData[index].Id == Discount_Master.TypeTakhfif.Id) {
            HeaderFactor += "<option  value=" + Discount_BaseData[index].Id + " selected>" + Discount_BaseData[index].Title + "</option>"
        }
        else {
            HeaderFactor += "<option value=" + Discount_BaseData[index].Id + ">" + Discount_BaseData[index].Title + "</option>"
        }

    }
    HeaderFactor += "</select></td>"
    "</tr>"
    HeaderFactor += "</table>"
    $("#head1 table").remove()
    $("#head1").append(HeaderFactor)
}
function ShowDetailFactor(Detail_Factor, obj) {
    debugger
    /* در صورتی که درکارتابل بود این قسمت نمایش داده میشود و لی اگر صفر بود منظور خود درخواست دهنده است که باید ویرایش نماید */
    if (Detail_Factor[0].MasterId.Step > 0) {


        var DetailFactor = "<table class='table'>"
        DetailFactor += "<tr><th>Step</th><th>کد فاکتور</th><th>نام کالا</th><th>نام تامین کننده کالا </th><th>عنوان برند</th><th>تعداد در کاتن</th>" +
            "<th>تعداد</th><th>فی کالا</th><th>مبلغ تخفیف پلکانی</th><th>مبلغ تخفیف ویژه</th>" +
            "<th>مبلغ کل تخفیفات</th><th>مبلغ نهایی بدون مالیات و عوارض</th><th>مبلغ نهایی با مالیات و عوارض</th>" +
            "<th>درصد تخفیف</th><th>درصد تخفیف</th><th>مبلغ تخفیف</th></tr>"
        for (let index = 0; index < Detail_Factor.length; index++) {

            /*
    برند های مربوط به خود را مشاهده نکند
    */
            if (obj.BrandId != Detail_Factor[index].BrandId && obj.Step == 3) {
                
                    continue;
                }
             

                DetailFactor += "<tr class='rows' BrandId=" + Detail_Factor[index].BrandId + "  DataId=" + Detail_Factor[index].Id + ">" +
                    "<td> " + Detail_Factor[index].Step + "</td>" +
                    "<td> " + Detail_Factor[index].Id + "</td>" +
                    "<td> " + Detail_Factor[index].ProductName + "</td>" +
                    "<td> " + Detail_Factor[index].SuppName + "</td>" +
                    "<td> " + Detail_Factor[index].BrandDesc + "</td>" +
                    "<td>" + Detail_Factor[index].NoInpack + "</td>" +
                    "<td class='Famount'>" + Detail_Factor[index].Famount + "</td>" +
                    "<td class='UnitPrice'>" + SeparateThreeDigits(Detail_Factor[index].UnitPrice) + "</td>" +
                    "<td>" + Detail_Factor[index].GDiscount_Price + "</td>" +
                    "<td>" + Detail_Factor[index].VDiscount_Price + "</td>" +
                    "<td>" + SeparateThreeDigits(Detail_Factor[index].DiscountPrice) + "</td>" +
                    "<td>" + SeparateThreeDigits(Detail_Factor[index].FinalPriceWithTax) + "</td>" +
                    "<td>" + SeparateThreeDigits(Detail_Factor[index].FinalPriceWithoutTax) + "</td>"
                DetailFactor += "<td style='color:red'> " + Detail_Factor[index].DiscountVal

                if (obj.BrandId == Detail_Factor[index].BrandId && obj.Step == 3) {
                    DetailFactor += "<td style='color:black'><input  value=" + Detail_Factor[index].DiscountVal + " type='number' class='discountVal'  onchange='CalulateDarsad(this," + Detail_Factor[index].Famount + "," + Detail_Factor[index].UnitPrice + ")'/></td>"
                }
                if (obj.BrandId != Detail_Factor[index].BrandId && obj.Step == 3) {
                    DetailFactor += "<td style='color:black'><input disabled value=" + Detail_Factor[index].DiscountVal + " type='number' class='discountVal'  onchange='CalulateDarsad(this," + Detail_Factor[index].Famount + "," + Detail_Factor[index].UnitPrice + ")'/></td>"
                }
                if (obj.Step != 3) {
                    DetailFactor += "<td style='color:black'><input  value=" + Detail_Factor[index].DiscountVal + " type='number' class='discountVal'  onchange='CalulateDarsad(this," + Detail_Factor[index].Famount + "," + Detail_Factor[index].UnitPrice + ")'/></td>"
                }

                // "<td style='color:black'><input value=" + Detail_Factor[index].DiscountVal + " type='number' class='discountVal'  onchange='CalulateDarsad(this," + Detail_Factor[index].Famount + "," + Detail_Factor[index].UnitPrice + ")'/></td>" +
                DetailFactor += "<td><span>" + SeparateThreeDigits(
                    Math.round(
                        (parseFloat(Detail_Factor[index].DiscountVal) *
                            parseFloat(Detail_Factor[index].Famount) *
                            parseFloat(Detail_Factor[index].UnitPrice)) / 100
                    )
                ) + "</span></td>" +
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
    }
    function ShowDecision(obj, Detail_Factor, Discount_Confirm, MarketingDirector) {

        /* در صورتی که درکارتابل بود این قسمت نمایش داده میشود و لی اگر صفر بود منظور خود درخواست دهنده است که باید ویرایش نماید */
        if (Detail_Factor[0].MasterId.Step > 0) {
            var DecisionDiv = "<table class='table'>"
            DecisionDiv += "<tr>" +
                "<td>توضیحات</td>" +
                "<td><textarea  rows=4 cols=100  name='comment' form='usrform'    placeholder='توضیحات ...'></textarea></td>" +
                "</tr>" +
                "<tr>" +
                "<td>نتیجه</td>" +
                "<td>" +
                "<input type='radio' name='decide' value=1> تایید" +
                "<input type='radio' name='decide' value=2> عدم تایید" +
                "<br/>" +
                "<input type='radio' name='decide' value=3> نیاز به اصلاح" +
                "<input type='radio' name='decide' value=4> نیاز به تخفیف مدیریتی" +
                "<br></td></tr>" +
                "<tr><td colspan=2><button class='btnSave'    style='background-color:rgb(167, 16, 23)!important; border-radius: 17px;'   onclick='save({" +
                "MasterId:" + obj.MasterId + "," +
                "ServerBranchId:" + obj.ServerBranchId + "," +
                "ConfirmId:" + (obj.Step == 3 ? MarketingDirector[0].Id : Discount_Confirm[0].Id) + "," +
                "Step:" + obj.Step +
                "})' " +
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
                "<tr><td colspan=2><button class='btnSave'    style='background-color:rgb(167, 16, 23)!important; border-radius: 17px;'   onclick='saveEdit(" + obj.MasterId + ")' " +
                "type='button' class='btn btn-success'>ویرایش</button></td>"
            "</tr>"
            DecisionDiv += "</table>"
        }
        $("#Decision1 table").remove()
        $("#Decision1").append(DecisionDiv)
    }
    async function ShowLog(Log) {
        var LogForm = "<table class='table'>"
        LogForm += "<tr>" +
            "<th>تایید کننده</th>" +
            "<th>نتیجه</th>" +
            "<th>توضیحات</th>" +
            "<th>تاریخ</th>" +
            "<th>زمان</th>" +
            "</tr>"
        for (let index = 0; index < Log.length; index++) {
            LogForm += "<tr>" +
                "<td>" + Log[index].ConfirmId.Title + "</td>" +
                "<td>" + Log[index].Result + "</td>" +
                "<td>" + Log[index].Dsc + "</td>" +
                "<td>" + foramtDate(Log[index].DateConfirm) + "</td>" +
                "<td>" + foramtTime(Log[index].TimeConfirm) + "</td>" +
                "</tr>"
        }
        LogForm += "</table>"
        $("#Log1 table").remove()
        $("#Log1").append(LogForm)
    }
    //--------------------------
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
    //---------------------------CRUD


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

    //-------------کاربران ثبت کننده تخفیف    223---------------------- Users in Group
    function IsUserInGroup(id) {
        //  کاربران ثبت کننده تخفیف    223
        return new Promise(resolve => {
            $.ajax({
                url: Obj_Initial.webAbsoluteUrl + "/_api/web/sitegroups/getbyId(" + id + ")/users",
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

