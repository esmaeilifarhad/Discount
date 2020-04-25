var Obj_Initial = {}
var _Factor = [];
var _arrayMessage = [];
var _ServiceObj = {}
// var _CurrentBudget;

//-----------------------------------
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

    var Discount_Detail = []
    var Discount_Detail1 = await ShowTaskKartablForAllStep()
    for (let index = 0; index < Discount_Detail1.length; index++) {
        Discount_Detail.push(Discount_Detail1[index])
    }

    var Discount_Detail2 = await ShowTaskKartablForBrandStep()
    for (let index = 0; index < Discount_Detail2.length; index++) {
        Discount_Detail.push(Discount_Detail2[index])
    }

    //UniqeMasterArrayr
    ShowTaskCartablTable(Discount_Detail)

    ShowTaskIncreaseBudget()
    //------------------------------------------------------
    // ShowTaskCartablTable(Discount_Master)
    $.LoadingOverlay("hide");
}
async function ShowTaskCartablTable(Discount_Detail) {
    // Obj_Discount_Detail.OrderBy = "Id"
    // Obj_Discount_Detail.Is_Increase = false
    // Obj_Discount_Detail.Filter = "(CurrentConfirm/Id eq " + _spPageContextInfo.userId + ")"
    // var Discount_Detail = await get_Records(Obj_Discount_Detail)

    // 

    var table = "<table class='table'>"
    table += "<tr><th>ردیف</th><th>شماره فاکتور</th><th>شعبه</th><th>تاریخ سفارش</th>" +
        "<th>کاربر ثبت کننده</th>" +
        "<th>کد مشتری</th>" +
        "<th>مرحله</th>" +
        "<th>تاریخ ثبت درخواست</th>" +
        "<th>نمایش فاکتور</th>" +
        "</tr>"
    for (let index = 0; index < Discount_Detail.length; index++) {

        table += "<tr BrandId=" + Discount_Detail[index].BrandId + "><td>" + (index + 1) + "</td>" +
            "<td>" + Discount_Detail[index].MasterId.SaleDocCode + "</td>" +
            "<td>" + Discount_Detail[index].ServerBranch.Title + "</td>" +
            "<td>" + foramtDate(Discount_Detail[index].MasterId.OrderDate) + "</td>" +
            // "<td>" + SeparateThreeDigits(Discount_Detail[index].MasterId.sum) + "</td>" +
            "<td>" + Discount_Detail[index].MasterId.TitleUser + "</td>" +
            "<td>" + Discount_Detail[index].MasterId.CustomerCode + "</td>" +
            "<td>" + Discount_Detail[index].Step + "</td>" +
            "<td>" + foramtDate(Discount_Detail[index].MasterId.DateCreated) + " - " + foramtTime(Discount_Detail[index].MasterId.TimeCreated) + "</td>" +
            "<td>" +
            "<input value='نمایش' type='button' style='background-color: #97161b!important;' " +
            "onclick='ShowFactorDetail(" +
            "{BranchTitle:\"" + Discount_Detail[index].ServerBranch.Title + "\"," +
            "MasterId:" + Discount_Detail[index].MasterId.Id + "," +
            "ServerBranchId:" + Discount_Detail[index].ServerBranch.Id + "," +
            "CustomerCode:" + Discount_Detail[index].MasterId.CustomerCode + "," +
            "BrandId:\"" + Discount_Detail[index].BrandId + "\"," +
            "Step:" + Discount_Detail[index].Step + "}" +
            ")' />" +
            "</td>" +
            "</tr>"
    }

    table += "</table>"

    $("#ShowCartabl table").remove()

    $("#ShowCartabl").append(table)
}
async function ShowTaskKartablForAllStep() {


    Obj_Discount_Confirm.OrderBy = "Id"
    Obj_Discount_Confirm.Is_Increase = false
    Obj_Discount_Confirm.Filter = "(Confirmator/Id eq " + _spPageContextInfo.userId + ")"
    var Discount_Confirm = await get_Records(Obj_Discount_Confirm)


    var Filter = "";
    for (let index = 0; index < Discount_Confirm.length; index++) {
        Filter += "((StatusWorkFlow/Id eq " + 4 + ") and " +
            "(ServerBranch/Id eq " + Discount_Confirm[index].ServerBranch.Id + ") and " +
            "(Step eq " + Discount_Confirm[index].ConfirmRow.Row + ")) or"
    }
    Filter = removeCountChar(Filter, 3)

    Obj_Discount_Detail.OrderBy = "Id"
    Obj_Discount_Detail.Is_Increase = false
    Obj_Discount_Detail.Filter = Filter
    var Discount_Detail = await get_Records(Obj_Discount_Detail)
    /*یکی کردن تمام تسک های مربوط به یک فرد با شرط اینکه مرحله و مسترآیدی درست باشد*/
    var UniqeMasterArrayr = []
    for (let index = 0; index < Discount_Detail.length; index++) {
        var isExist = UniqeMasterArrayr.find(x =>
            x.MasterId.Id == Discount_Detail[index].MasterId.Id && x.Step == Discount_Detail[index].Step);
        if (isExist == undefined)
            UniqeMasterArrayr.push(Discount_Detail[index])
    }
    return new Promise(resolve => {
        resolve(UniqeMasterArrayr)
    });
}
async function ShowTaskKartablForBrandStep() {

    //---------------------------------------فقط برندهای مربوط به خودم را مشاهده میکنم
    Obj_MarketingDirector.OrderBy = "Id"
    Obj_MarketingDirector.Is_Increase = false
    Obj_MarketingDirector.Filter = "(User/Id eq " + _spPageContextInfo.userId + ")"
    var MarketingDirector = await get_Records(Obj_MarketingDirector)

    var Filter = "";
    for (let index = 0; index < MarketingDirector.length; index++) {
        Filter += "(MarketingDirectorId eq " + MarketingDirector[index].Id + ") or "
    }
    Filter = removeCountChar(Filter, 3)

    Obj_Discount_Brand.OrderBy = "Id"
    Obj_Discount_Brand.Is_Increase = false
    Obj_Discount_Brand.Filter = Filter
    var Discount_Brand = await get_Records(Obj_Discount_Brand)


    Obj_Discount_Detail.OrderBy = "Id"
    Obj_Discount_Detail.Is_Increase = false
    Obj_Discount_Detail.Filter = "(StatusWorkFlow/Id eq " + 4 + ") and (Step eq " + 3 + ") "
    //and (TypeTakhfif/Id eq " + 2 + ")"
    var Discount_Detail = await get_Records(Obj_Discount_Detail)


    Filter = "";
    for (let index = 0; index < Discount_Brand.length; index++) {

        var res = Discount_Detail.find(x =>
            x.BrandId == Discount_Brand[index].BrandId);
        if (res != undefined) {
            Filter += "(BrandId eq " + Discount_Brand[index].BrandId + ") or "
        }
    }
    Filter = removeCountChar(Filter, 4)

    if (Filter == "") {
        Filter = "((StatusWorkFlow/Id eq " + 4 + ") and (Step eq " + 3 + ")) "

    }
    else {
        Filter = "((StatusWorkFlow/Id eq " + 4 + ") and (Step eq " + 3 + ")) and (" + Filter + ")"

    }


    Obj_Discount_Detail.OrderBy = "Id"
    Obj_Discount_Detail.Is_Increase = false
    Obj_Discount_Detail.Filter = Filter
    var Discount_Detail = await get_Records(Obj_Discount_Detail)



    var UniqeMasterArrayr = []
    for (let index = 0; index < Discount_Detail.length; index++) {
        Discount_Detail[index];

        var isExist = UniqeMasterArrayr.find(x =>
            x.MasterId.Id == Discount_Detail[index].MasterId.Id && x.BrandId == Discount_Detail[index].BrandId);
        if (isExist == undefined)
            UniqeMasterArrayr.push(Discount_Detail[index])

    }

    return new Promise(resolve => {
        resolve(UniqeMasterArrayr)
    });


}

async function ShowTaskIncreaseBudget() {


    Obj_Discount_Confirm.OrderBy = "Id"
    Obj_Discount_Confirm.Is_Increase = false
    Obj_Discount_Confirm.Filter = "(Confirmator/Id eq " + _spPageContextInfo.userId + ") and (ConfirmRow/Role eq 'MAD')"
    var Discount_Confirm = await get_Records(Obj_Discount_Confirm)

    if (Discount_Confirm.length == 0) return
    var filterIncreaseBudget = ""
    for (let index = 0; index < Discount_Confirm.length; index++) {

        filterIncreaseBudget += "(IsEffect eq false) and (Confirmator/Id eq " + Discount_Confirm[index].Id + ") or ";

    }

    filterIncreaseBudget = removeCountChar(filterIncreaseBudget, 3)

    Obj_Discount_IncreaseBudget.OrderBy = "Id"
    Obj_Discount_IncreaseBudget.Is_Increase = false
    Obj_Discount_IncreaseBudget.Filter = filterIncreaseBudget
    var Discount_IncreaseBudget = await get_Records(Obj_Discount_IncreaseBudget)


    // 

    var table = "<table class='table tblIncreaseBudget'>"
    table += "<tr><th>ردیف</th>" +
        "<th>عنوان</th>" +
        "<th>بودجه درخواستی</th>" +
        "<th>تاریخ</th>" +
        "<th>چک</th>" +
        "<th>درخواست دهنده</th>" +
        "<th>بودجه جاری</th>" +
        "<th><input type='checkbox' id='selectAll' value='انتخاب همه' title='انتخاب همه' alt='انتخاب همه' onclick='selectAllchk(this)' /></th>" +
        "<th><buttton type='button' value='تایید'   class='btn btn-success' onclick='ConfirmIncreaseBudget({confirm:true})'>تایید</button></th>" +
        "<th><buttton type='button'  value='رد'  class='btn btn-danger'  onclick='ConfirmIncreaseBudget({confirm:false})'>رد</button></th>" +

        "</tr>"
    for (let index = 0; index < Discount_IncreaseBudget.length; index++) {

        table += "<tr MarketingDirectorId=" + Discount_IncreaseBudget[index].MarketingDirector.Id + " IdIncreaseBudget=" + Discount_IncreaseBudget[index].Id + ">" +
            "<td>" + (index + 1) + "</td>" +
            "<td>" + Discount_IncreaseBudget[index].Title + "</td>" +
            "<td><input name='price' type='text' value='" + SeparateThreeDigits(Discount_IncreaseBudget[index].price) + "' onkeyup='changeInputToThreeDigit(this)'/></td>" +
            "<td>" + foramtDate(Discount_IncreaseBudget[index].DateCreated) + " - " + foramtTime(Discount_IncreaseBudget[index].TimeCreated) + "</td>" +
            "<td>" + Discount_IncreaseBudget[index].IsEffect + "</td>" +
            "<td name='MarketingDirectorTitle'>" + Discount_IncreaseBudget[index].MarketingDirector.Title + "</td>" +
            "<td name='CurrentBudget'>" + SeparateThreeDigits(Discount_IncreaseBudget[index].MarketingDirector.CurrentBudget) + "</td>" +
            "<td><input IdIncreaseBudget=" + Discount_IncreaseBudget[index].Id + " type='checkbox' name='chkk'/></td>" +
            "</tr>"
    }
    table += "</table>"

    $("#ShowCartabl .tblIncreaseBudget").remove()

    $("#ShowCartabl").append(table)
}
async function selectAllchk(thiss) {
    var res = $(thiss)[0].checked;
    if (res == true) {
        $(".tblIncreaseBudget  tr td input[name='chkk']").each(function () {

            $(this)[0].checked = true
        })

    }
    else {
        $(".tblIncreaseBudget  tr td input[name='chkk']").each(function () {
            $(this)[0].checked = false
        })
    }

}
async function ConfirmIncreaseBudget(obj) {
    $.LoadingOverlay("show");
    var IdIncreaseBudget = 0
    var MarketingDirectorId = 0
    var result = ""
    var count = $(".tblIncreaseBudget  tr").length
    if (count == 1) {
        $.LoadingOverlay("hide");

        showAlert("احتراما موردی برای تایید وجود ندارد", 4000, 'info')
        return

    }
    var i = 0
    var CreatePromise = []
    var Price = []
    $(".tblIncreaseBudget  tr").each(async function () {


        IdIncreaseBudget = $(this).attr("IdIncreaseBudget")
        MarketingDirectorId = parseInt($(this).attr("MarketingDirectorId"))
        // console.log(IdIncreaseBudget)

        result = ""
        if ($(this).find("td").find("input[name='chkk']")[0] != undefined) {

            result = $(this).find("td").find("input[name='chkk']")[0].checked
            if (result == true) {

                var price = $(this).find("td").find("input[name='price']")[0].value
                var CurrentBudget = $(this).find("td[name='CurrentBudget']")[0].textContent
                var MarketingDirectorTitle = $(this).find("td[name='MarketingDirectorTitle']")[0].textContent


                if (Price[MarketingDirectorId] == undefined) {
                    Price[MarketingDirectorId] = parseInt(removeComma(CurrentBudget)) + parseInt(removeComma(price))
                }
                else {
                    Price[MarketingDirectorId] = parseInt(removeComma(price)) + Price[MarketingDirectorId]
                }




                CreatePromise.push(update_Record(MarketingDirectorId,
                    {
                        CurrentBudget: Price[MarketingDirectorId],
                    },
                    "Discount_MarketingDirector"))
                CreatePromise.push(update_Record(parseInt(IdIncreaseBudget),
                    {
                        IsEffect: true,
                    },
                    "Discount_IncreaseBudget"))


                //---------------لاگ               
                var objBudgetIncrease = {
                    dsc: " مقدار " + price + " توسط " + _spPageContextInfo.userLoginName + " به " + MarketingDirectorTitle + " اضافه شد ",
                    IsIncrease: true,
                    BudgetPrice: price,
                    Title: "مدیر  بازاریبابی",
                    MarketingDirectorId: MarketingDirectorId,
                    DateCreated: today,
                    TimeCreated: CurrentTime(),
                    UserIncreaserId: _spPageContextInfo.userId
                }
                // var createDiscount_BudgetIncrease = await create_Record(obj, "Discount_BudgetIncrease")

                // Obj_MarketingDirector.ID = obj.MarketingDirectorId
                // var MarketingDirector = await get_RecordByID(Obj_MarketingDirector)


                // var results = await Promise.all([
                //     create_Record(objBudgetIncrease, "Discount_BudgetIncrease"),
                //    get_RecordByID(Obj_MarketingDirector)
                // ]);

                CreatePromise.push(create_Record(objBudgetIncrease, "Discount_BudgetIncrease"))
                // var MarketingDirector = results[1]
                //--------------------------


            }
        }

        i += 1

        if (i == count) {

            var results = await Promise.all(CreatePromise);
            showAlert("با موفقیت اعمال شد")
            $.LoadingOverlay("hide");
            ShowTaskCartabl()
        }
    })

}
//--------------------------------------------------------------Modal
function ShowMessage() {
    return new Promise(resolve => {
        var table = "<table class='table table-bordered'>"
        for (let index = 0; index < _arrayMessage.length; index++) {
            //const element = array[index];
            table += "<tr><td>" + (index + 1) + "</td><td>" + _arrayMessage[index].message + "</td></tr>"
        }
        table += "</table>"
        $("#ModaDetail .modal-body table").remove()
        $("#ModaDetail .modal-body").append(table)
        $("#ModaDetail").modal();

        $.LoadingOverlay("hide");
        $('.btnSave').prop('disabled', false);
        _arrayMessage = []
        resolve("Finish")
    })

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


    Obj_WorkFlow.OrderBy = "Id"
    Obj_WorkFlow.Is_Increase = true
    Obj_WorkFlow.Filter = "(currentStep eq " + obj.Step + ")"

    var results = await Promise.all([
        get_Records(Obj_Discount_BaseData),
        get_Records(Obj_Discount_Detail),
        get_RecordByID(Obj_Discount_Master),
        get_RecordByID(Obj_Discount_ServerBranch),
        get_Records(Obj_Discount_Log),
        get_Records(Obj_Discount_Confirm),
        get_Records(Obj_Discount_Brand),
        get_Records(Obj_WorkFlow)
    ]);
    var Discount_BaseData = results[0]
    var Detail_Factor = results[1]
    var Discount_Master = results[2]
    var Discount_ServerBranch = results[3]
    var Log = results[4]
    var Discount_Confirm = results[5]
    var Discount_Brand = results[6]
    var Discount_WorkFlow = results[7]

    ShowHeaderbranch(Discount_ServerBranch, Discount_Confirm, Discount_Brand, obj)

    ShowHeaderFactor(Discount_Master, Discount_BaseData, Detail_Factor, Discount_WorkFlow)

    ShowDetailFactor(Detail_Factor, obj, Log)

    ShowDecision(obj, Detail_Factor, Discount_Confirm, Discount_Brand)

    ShowLog(Log)
    ShowAllFactor(Detail_Factor)

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
async function saveForTaskhfifNiaz(obj) {

    $.LoadingOverlay("show");

    var price = $("#TaskhfifNiaz").val()

    Obj_Discount_Confirm.OrderBy = "Id"
    Obj_Discount_Confirm.Is_Increase = false
    Obj_Discount_Confirm.Filter = "(ConfirmRow/Role eq 'MAD') and (ServerBranch/Id eq " + obj.ServerBranchId + ")"
    var Discount_Confirm = await get_Records(Obj_Discount_Confirm)

    var res = await create_Record(
        {
            Title: "افزایش بودجه",
            MasterIdId: obj.MasterId,
            price: price,
            IsEffect: false,
            DateCreated: todayShamsy8char(),
            TimeCreated: CurrentTime(),
            MarketingDirectorId: obj.MarketingDirectorId,
            ConfirmatorId: Discount_Confirm[0].Id,
        },
        "Discount_IncreaseBudget")
    showAlert()
    $.LoadingOverlay("hide");
    $("#window").data("kendoWindow").close();
    ShowTaskCartabl()
}
async function save(obj) {

    $('.btnSave').prop('disabled', true);
    $.LoadingOverlay("show");

    var arrayDetails = []
    var utilityObj = {}

    utilityObj.description = $("#Decision1 textarea").val()
    utilityObj.result = $("input[name='decide']:checked").val()
    // utilityObj.TypeTakhfif = $("#DarTaahod option:selected").val();

    //--------------------------------------
    var resVal = checkValidation(utilityObj)
    if (_arrayMessage.length > 0) {
        ShowMessage()
        return
    }
    //----------------------------------------

    Obj_Discount_ServerBranch.OrderBy = "CurrentBudget"
    Obj_Discount_ServerBranch.Is_Increase = false
    Obj_Discount_ServerBranch.ID = obj.ServerBranchId
    // var Discount_ServerBranch = await get_RecordByID(Obj_Discount_ServerBranch)
    //------------------------------
    Obj_Discount_Master.OrderBy = "Id"
    Obj_Discount_Master.Is_Increase = false
    Obj_Discount_Master.ID = obj.MasterId
    // var Obj_Discount_Master = await get_RecordByID(Obj_Discount_Master)
    //--------------------------
    Obj_Discount_Detail.OrderBy = "Id"
    Obj_Discount_Detail.Is_Increase = false
    Obj_Discount_Detail.Filter = "(MasterId/Id eq  " + obj.MasterId + ")"
    //--------------------------------
    Obj_WorkFlow.OrderBy = "CurrentBudget"
    Obj_WorkFlow.Is_Increase = false
    Obj_WorkFlow.ID = utilityObj.result
    // var Discount_ServerBranch = await get_RecordByID(Obj_Discount_ServerBranch)

    //---------------------------------
    Obj_MarketingDirector.OrderBy = "Id"
    Obj_MarketingDirector.Is_Increase = false
    Obj_MarketingDirector.ID = obj.MarketingDirectorId
    // var MarketingDirector = await get_RecordByID(Obj_MarketingDirector)


    var results = await Promise.all([
        get_RecordByID(Obj_Discount_ServerBranch),
        get_RecordByID(Obj_Discount_Master),
        get_Records(Obj_Discount_Detail),
        get_RecordByID(Obj_WorkFlow),
        get_RecordByID(Obj_MarketingDirector)
    ]);


    var Discount_ServerBranch = results[0]
    var Discount_Master = results[1]
    var Discount_Detail = results[2]
    var Discount_WorkFlow = results[3]
    var MarketingDirector = results[4]



    Obj_WorkFlow.OrderBy = "Id"
    Obj_WorkFlow.Is_Increase = false
    Obj_WorkFlow.Filter = "(currentStep eq " + Discount_WorkFlow.nextStep + ")"
    // var Discount_WorkFlow_Next = await get_Records(Obj_WorkFlow)


    Obj_Discount_Confirm.OrderBy = "Id"
    Obj_Discount_Confirm.Is_Increase = false
    Obj_Discount_Confirm.Filter = "(ConfirmRow/Row eq " + Discount_WorkFlow.nextStep + ") and (ServerBranch/Id eq " + Discount_ServerBranch.Id + ")"
    // var Discount_Confirm = await get_Records(Obj_Discount_Confirm)

    var results = await Promise.all([
        get_Records(Obj_WorkFlow),
        get_Records(Obj_Discount_Confirm)
    ]);

    var Discount_WorkFlow_Next = results[0]
    var Discount_Confirm = results[1]

    //-------------------------------
    var OldSum = 0
    for (let index = 0; index < _Factor.length; index++) {

        OldSum += Math.round((_Factor[index].DiscountVal * _Factor[index].Famount * _Factor[index].UnitPrice) / 100);

    }
    utilityObj.OldSum = OldSum
    //----------------------------------------------------محاسبه جمع تخفیف ها
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
    utilityObj.NewSum = NewSum
    //----------------------------------------------------
    checkBudget(Discount_WorkFlow, Discount_ServerBranch, utilityObj, MarketingDirector)



    if (_arrayMessage.length > 0) {
        ShowMessage()
        return
    }

    //--------------اگر بودجه کمتر بود پیغام میدهد و کاربر در صورت تایید از این مرحله رد میشود

    if (utilityObj.result == "1") {
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

    /*
            //-------------------
            Obj_Discount_Master.OrderBy = "Id"
            Obj_Discount_Master.Is_Increase = false
            Obj_Discount_Master.ID = obj.MasterId
            // var New_Discount_Master = await get_RecordByID(Obj_Discount_Master)
    
            //-------------------------- در مستر وضعیت فاکتور
    
            Obj_Discount_Detail.OrderBy = "Id"
            Obj_Discount_Detail.Is_Increase = false
            Obj_Discount_Detail.Filter = "(MasterId/Id eq  " + obj.MasterId + ")"
            //  var Discount_Detail = await get_Records(Obj_Discount_Detail)
    
            var results = await Promise.all([
                get_RecordByID(Obj_Discount_Master),
                get_Records(Obj_Discount_Detail)
            ]);
            var New_Discount_Master = results[0]
            var Discount_Detail = results[1]
    */

    var status = 6 //تایید نشده
    if (Discount_WorkFlow.BaseData.Id == 4) {
        status = 4
    }
    else {
        //  Discount_WorkFlow.BaseData.Id

        for (let index = 0; index < Discount_Detail.length; index++) {

            var res = arrayDetails.find(x => x.ID == Discount_Detail.Id);
            if (res == undefined) {

                if (Discount_Detail[index].StatusWorkFlow.Id == 4)//در گردش
                {
                    status = 4
                    break
                }
                else if (Discount_Detail[index].StatusWorkFlow.Id == 5)//پایان
                {
                    status = 5

                }
            }
            else {
                if (Discount_Detail[index].StatusWorkFlow.Id == 5)
                    status = 5
            }
        }
    }

    var resultPap = await InsertToInsertSaleDocsMarketingDiscounts(Discount_Master, status)
    /*در صورتی که مرحله نهایی بود 
باید در پپ ویرایش انجام شود
table :  saledocItems  
field : Vdispercent
*/

    if (Discount_WorkFlow.BaseData.Id == 5) {

        var CreatePromise = []
        for (let index = 0; index < Discount_Detail.length; index++) {
            //--search in Detail
            // var res = Discount_Detail.find(x => x.Id === arrayDetails[index].Id);
            var res = arrayDetails.find(x => x.ID == Discount_Detail[index].Id);
            if (res == undefined) {

            }
            else {
                debugger
                var objSaledocItems = {}
                objSaledocItems.Vdispercent = res.discountVal.toString()
                objSaledocItems.SaleDocItemId = Discount_Detail[index].SaledocItemId
                objSaledocItems.SaleDocId = Discount_Detail[index].MasterId.SaleDocId
                CreatePromise.push(
                    UpdateSaledocItems(objSaledocItems)
                )
            }

        }

        var results = await Promise.all(CreatePromise);
        debugger
        //  var resultPap = await  UpdateSaledocItems(obj)
    }

    var objData = await ChangeBudget(utilityObj, Discount_WorkFlow, Discount_WorkFlow_Next, Discount_ServerBranch, obj)



    var CreatePromise = []
    for (let index = 0; index < arrayDetails.length; index++) {
        CreatePromise.push(
            update_Record(arrayDetails[index].ID,
                {
                    DiscountVal: arrayDetails[index].discountVal.toString(),
                    Step: Discount_WorkFlow.nextStep,
                    StatusWorkFlowId: Discount_WorkFlow.BaseData.Id,
                    TypeTakhfifId: parseInt(utilityObj.TypeTakhfif),
                    CurrentConfirmId: (Discount_WorkFlow.nextStep == 3 ? MarketingDirector.User.Id : Discount_Confirm[0].Confirmator.Id),
                    lastDsc: utilityObj.description,
                    SendNotification: true
                },
                "Discount_Detail"))
    }
    if (objData.ServerBranchCurrentBudget != undefined) {
        CreatePromise.push(
            update_Record(obj.ServerBranchId,
                {
                    CurrentBudget: objData.ServerBranchCurrentBudget
                },
                "Discount_ServerBranch"
            ))
    }



    if (objData.MarketingDirectorCurrentBudget != undefined) {
        CreatePromise.push(
            update_Record(obj.MarketingDirectorId,
                {

                    CurrentBudget: parseInt(objData.MarketingDirectorCurrentBudget),
                },
                "Discount_MarketingDirector"
            ))
    }
    CreatePromise.push(create_Record({
        Title: "کلی",
        MasterIdId: obj.MasterId,
        Result: Discount_WorkFlow.Title,
        Dsc: utilityObj.description,
        DateConfirm: todayShamsy8char(),
        TimeConfirm: CurrentTime(),
        ConfirmIdId: obj.ConfirmId,

    }, "Discount_Log"))

    for (let index = 0; index < arrayDetails.length; index++) {
        CreatePromise.push(
            create_Record(
                {
                    DetailIdId: arrayDetails[index].ID,
                    Title: "با جزئیات",
                    MasterIdId: obj.MasterId,
                    Result: Discount_WorkFlow.Title,
                    Dsc: utilityObj.description,
                    DateConfirm: todayShamsy8char(),
                    TimeConfirm: CurrentTime(),
                    ConfirmIdId: obj.ConfirmId,
                },
                "Discount_Log"))
    }

    var results = await Promise.all(CreatePromise);



    // -----------------------------وضعیت فاکتور در مستر

    var results = await update_Record(obj.MasterId, {
        StatusWorkFlowId: status,
        SendNotification: true
    },
        "Discount_Master"
    )




    //-------------------------------
    //  $.LoadingOverlay("hide");
    showAlert()
    $("#window").data("kendoWindow").close();
    ShowTaskCartabl();
    $.LoadingOverlay("hide");




}
/*
درخواست دهنده فرم خود را ویرایش میکند
وقتی بر روی دکمه ذخیره کلیک میکند 
*/
async function saveEdit(MasterId) {

    $('#btnSave').prop('disabled', true);
    $.LoadingOverlay("show");
    // var _arrayMessage = []
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

        _arrayMessage.push({ message: "هیچ تخفیفی در نظر گرفته نشده است" })
    }
    _CurrentBudget = await getCurrentBudget()
    if (NewSum > _CurrentBudget) {
        _arrayMessage.push({ message: "بودجه شما کافی نمیباشد" + " بودجه شما   " + SeparateThreeDigits(_CurrentBudget) + " میباشد. " })
    }
    if (_arrayMessage.length > 0) {
        ShowMessage()
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
// function showAlert() {
//     const Toast = Swal.mixin({
//         toast: true,
//         // position: 'top-end',
//         showConfirmButton: false,
//         timer: 2000,
//         timerProgressBar: true,
//         onOpen: (toast) => {
//             toast.addEventListener('mouseenter', Swal.stopTimer)
//             toast.addEventListener('mouseleave', Swal.resumeTimer)
//         }
//     })

//     Toast.fire({
//         icon: 'success',
//         title: 'درخواست شما با موفقیت ذخیره شد'
//     })
// }
function checkValidation(utilityObj) {

    // var arrayMessage = []
    if (utilityObj.result == undefined) {
        _arrayMessage.push({ message: "لطفا نتیجه را مشخص نمایید" })
    }

    if (utilityObj.description.trim() == "") {
        _arrayMessage.push({ message: "لطفا توضیحات را پر نمایید." })
    }


    // return arrayMessage
}
function checkBudget(Discount_WorkFlow, Discount_ServerBranch, utilityObj, MarketingDirector) {

    //-------------------------اگر مرحله پایانی بود وشرایط را نداشت اجازه ثبت ندهیم
    if ((Discount_WorkFlow.currentStep == 1 || Discount_WorkFlow.currentStep == 2)
        && Discount_WorkFlow.BaseData.Id == 5
        && Discount_ServerBranch.CurrentBudget < utilityObj.NewSum) {
        /*
    ------------------------------------result
    value=1 تایید
    value=2 عدم تایید
    value=3 نیاز به اصلاح
    value=4 نیاز به تخفیف مدیریتی
    -------------------------------------TypeTakhfif
    1    در تعهد شعبه
    2    در تعهد دفتر مرکزی
    3    در تعهد شرکت تولیدی 
    ------------------------------------StatusWorkFlow
    4    درگردش
    5    پایان
    6    تایید نشده
    ---------------------
    */

        _arrayMessage.push({ message: " احتراما بودجه کافی نمیباشد شما میتوانید این درخواست را به دفتر مرکزی انتقال دهید." })

    }

    if (MarketingDirector.CurrentBudget < utilityObj.NewSum &&
        Discount_WorkFlow.currentStep == 3 &&
        Discount_WorkFlow.BaseData.Id == 5) {
        _arrayMessage.push({ message: " احتراما بودجه کافی نمیباشد" })
    }
}
function CalulateDarsad(thiss, Famount, UnitPrice) {

    var val = $(thiss).val()
    $(thiss).parent().next().find("span").remove()
    $(thiss).parent().next().append("<span>" + SeparateThreeDigits(Math.round((val * Famount * UnitPrice) / 100)) + "</span>")

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
            // arrayDetails.push({ ID: DataId, discountVal: discountVal })
        }
        else {
            // arrayDetails.push({ ID: DataId, discountVal: discountVal })
        }
    })

    $("#sumTakhfif span").remove()
    $("#sumTakhfif").append("<span>" + SeparateThreeDigits(NewSum) + "</span>")

    var MarketingDirectorCurrentBudget = $("#MarketingDirectorCurrentBudget").text()
    $("#TaskhfifNiaz").val(SeparateThreeDigits(NewSum - MarketingDirectorCurrentBudget > 0 ? NewSum - MarketingDirectorCurrentBudget : 0))
    //("#MarketingDirectorCurrentBudget span").text()

}
async function ChangeBudget(utilityObj, Discount_WorkFlow, Discount_WorkFlow_Next, Discount_ServerBranch, obj) {
    var objData = {}




    if (Discount_WorkFlow_Next[0].BaseDataPart.Id == Discount_WorkFlow.BaseDataPart.Id && Discount_WorkFlow.BaseDataPart.Id == 1 && Discount_WorkFlow.BaseData.Id == 4) {
        if (utilityObj.OldSum < utilityObj.NewSum) {
            objData.ServerBranchCurrentBudget = Discount_ServerBranch.CurrentBudget - (utilityObj.NewSum - utilityObj.OldSum)
        }
        else if (utilityObj.OldSum > utilityObj.NewSum) {
            objData.ServerBranchCurrentBudget = Discount_ServerBranch.CurrentBudget + (utilityObj.OldSum - utilityObj.NewSum)
        }
        else {
            objData.ServerBranchCurrentBudget = Discount_ServerBranch.CurrentBudget
        }

    }
    //در بخش شعبه تایید نشده باشد
    else if (Discount_WorkFlow.BaseData.Id == 6 && Discount_WorkFlow.BaseDataPart.Id == 1) {
        objData.ServerBranchCurrentBudget = Discount_ServerBranch.CurrentBudget + utilityObj.OldSum
    }
    else if (Discount_WorkFlow_Next[0].BaseDataPart.Id != Discount_WorkFlow.BaseDataPart.Id) {
        objData.ServerBranchCurrentBudget = Discount_ServerBranch.CurrentBudget + utilityObj.OldSum
    }
    else if (Discount_WorkFlow.BaseDataPart.Id == 2 && Discount_WorkFlow.BaseData.Id == 5) {

        Obj_MarketingDirector.OrderBy = "Id"
        Obj_MarketingDirector.Is_Increase = false
        Obj_MarketingDirector.ID = obj.MarketingDirectorId
        var MarketingDirector = await get_RecordByID(Obj_MarketingDirector)
        //MarketingDirector.CurrentBudget
        objData.MarketingDirectorCurrentBudget = MarketingDirector.CurrentBudget - utilityObj.NewSum

    }




    return objData


}
// async function FindNextStep(Discount_Master, utilityObj) {

//     return new Promise(resolve => {
//         //  console.log(_Factor)

//         /*
//       value=1 تایید
//       value=2 عدم تایید
//       value=3 نیاز به اصلاح
//       value=4 نیاز به تخفیف مدیریتی
//       ------------------
//       1    در تعهد شعبه
//       2    در تعهد دفتر مرکزی
//       3    در تعهد شرکت تولیدی 
//       -------------------StatusWorkFlow
//       4    درگردش
//       5    پایان
//       6    تایید نشده
//       ---------------------
//         */
//         var objResult = {}
//         // تایید
//         if (utilityObj.result == "1") {
//             if (utilityObj.TypeTakhfif == "2" && _Factor[0].Step == 1) {
//                 objResult.NextStep = 3
//                 objResult.StatusWorkFlow = 4
//             }
//             if (utilityObj.TypeTakhfif == "1" && _Factor[0].Step == 1) {
//                 objResult.NextStep = 2
//                 objResult.StatusWorkFlow = 4
//             }
//             if (utilityObj.TypeTakhfif == "1" && _Factor[0].Step == 2) {
//                 objResult.NextStep = 2
//                 objResult.StatusWorkFlow = 5
//             }
//             if (utilityObj.TypeTakhfif == "2" && _Factor[0].Step == 2) {
//                 objResult.NextStep = 3
//                 objResult.StatusWorkFlow = 4
//             }

//             if (utilityObj.TypeTakhfif == "2" && _Factor[0].Step == 3) {
//                 objResult.NextStep = 3
//                 objResult.StatusWorkFlow = 5
//             }
//         }
//         //عدم تایید
//         if (utilityObj.result == "2") {
//             objResult.StatusWorkFlow = 6
//             objResult.NextStep = 0
//         }
//         //نیاز به اصلاح
//         if (utilityObj.result == "3") {

//             if (utilityObj.TypeTakhfif == "1" && _Factor[0].Step == 3) {
//                 objResult.NextStep = 1
//                 objResult.StatusWorkFlow = 4
//             }
//             if (utilityObj.TypeTakhfif == "2" && _Factor[0].Step == 3) {
//                 _arrayMessage.push({ message: "در صورت انتخاب اصلاح توسط شعبه باید نوع درخواست نیز اصلاح شود." })
//             }

//         }
//         if (utilityObj.result == "4") {

//         }

//         resolve(objResult)

//     })
// }

//--------------------------------------نمایش بخش های مختلف فاکتور
/*نمایش هدر بودجه جاری و مشخصات شعبه */
async function ShowHeaderbranch(Discount_ServerBranch, Discount_Confirm, Discount_Brand, obj) {

    _ServiceObj = { IP_Server: Discount_ServerBranch.IP_Server, DB: Discount_ServerBranch.DataBaseName, ServerBranchId: Discount_ServerBranch.Id }


    if (obj.Step == 3) {
        var Headerbranch = "<table class='table'>" +
            "<tr><td>مدیر بازاریابی : " + Discount_Brand[0].MarketingDirector.Title + "</td>" +
            "<td><span>بودجه مدیر : </span><span id='MarketingDirectorCurrentBudget'>" + SeparateThreeDigits(Discount_Brand[0].MarketingDirector.CurrentBudget) + "</span></td>" +
            // "<td>نقش : " + Discount_Confirm[0].ConfirmRow.Title + "</td>" +
            // "<td>مرحله : " + Discount_Confirm[0].ConfirmRow.Row + "</td>" +
            "</tr></table>"
        $("#branch1 table").remove()
        $("#branch1").append(Headerbranch)
    }
    else if (obj.Step == 4) {
        var Headerbranch = "<table class='table'>" +
            "<tr><td>مدیر عامل </td>" +
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
function ShowHeaderFactor(Discount_Master, Discount_BaseData, Detail_Factor, Discount_WorkFlow) {
    var SumTotal = 0
    for (let index = 0; index < Detail_Factor.length; index++) {
        SumTotal += parseInt(Detail_Factor[index].DiscountVal);
    }

    var HeaderFactor = "<table class='table'>"
    HeaderFactor += "<tr><td>کد فاکتور : " + Discount_Master.SaleDocCode + "</td><td>کد مشتری : " + Discount_Master.CustomerCode + "</td><td>تاریخ  : " + foramtDate(Discount_Master.OrderDate) + "</td></tr>"
    HeaderFactor += "<tr><td style='color:red'><span>مجموع مبلغ تخفیف :</span><span id='sumTakhfif'></span></td>" +
        "<td>مرحله : " + Discount_Master.Step + "</td>" +
        "<td>ثبت کننده  : " + Discount_Master.TitleUser + "</td>"
    HeaderFactor += "<td>نوع درخواست : <select id='DarTaahod'>"
    //     for (let index = 0; index < Discount_BaseData.length; index++) {
    // 
    //         if (Discount_BaseData[index].Id == Discount_Master.TypeTakhfif.Id) {
    HeaderFactor += "<option  value=" + Discount_WorkFlow[0].BaseDataPart.Id + " selected>" + Discount_WorkFlow[0].BaseDataPart.Title + "</option>"
    //  }
    // else {
    //     HeaderFactor += "<option value=" + Discount_BaseData[index].Id + ">" + Discount_BaseData[index].Title + "</option>"
    // }

    // }
    HeaderFactor += "</select></td>"
    "</tr>"
    HeaderFactor += "</table>"
    $("#head1 table").remove()
    $("#head1").append(HeaderFactor)
}
function ShowDetailFactor(Detail_Factor, obj, Log) {

    _Factor = []
    /* در صورتی که درکارتابل بود این قسمت نمایش داده میشود و لی اگر صفر بود منظور خود درخواست دهنده است که باید ویرایش نماید */
    // if (Detail_Factor[0].MasterId.Step > 0) {
    var DetailFactor = "<table class='table'>"
    DetailFactor += "<tr><th>Step</th><th>کد فاکتور</th><th>نام کالا</th><th>نام تامین کننده کالا </th><th>عنوان برند</th><th>تعداد در کاتن</th>" +
        "<th>تعداد</th><th>فی کالا</th><th>مبلغ تخفیف پلکانی</th><th>مبلغ تخفیف ویژه</th>" +
        "<th>مبلغ کل تخفیفات</th><th>مبلغ نهایی بدون مالیات و عوارض</th><th>مبلغ نهایی با مالیات و عوارض</th>" +
        "<th>درصد تخفیف</th><th>درصد تخفیف</th><th>مبلغ تخفیف</th><th>تاریخچه</th></tr>"
    for (let index = 0; index < Detail_Factor.length; index++) {

        var numOfTrue = 0;
        for (var i = 0; i < Log.length; i++) {
            if (Log[i].DetailId.Id == Detail_Factor[index].Id)
                numOfTrue++;
        }

        // var resLog= Log.find(
        //     x =>
        //      x.DetailId.Id == Detail_Factor[index].Id);

        // 

        /*
برند های مربوط به خود را مشاهده نکند
*/

        if (obj.BrandId != Detail_Factor[index].BrandId && obj.Step == 3) {

            continue;
        }
        if (obj.Step != Detail_Factor[index].Step) {

            continue;
        }

        if (Detail_Factor[index].StatusWorkFlow.Id == 6 || Detail_Factor[index].StatusWorkFlow.Id == 5) {
            continue;
        }
        //در بخش ویرایش ازش استفاده میکنم
        _Factor.push(Detail_Factor[index])
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
            "<td><button  style='background-color:rgb(45, 154, 48)!important; border-radius: 17px;padding:3px' " +
            "onclick='showLogDetail({MasterId:" + Detail_Factor[index].MasterId.Id + ",DetailId:" + Detail_Factor[index].Id + "})' type='button'>" + numOfTrue + " مورد</button></td>" +
            "</tr>"
    }

    DetailFactor += "</table>"
    // }
    // //----------------مربوط به ویرایش درخواست دهنده میباشد
    // else {
    //     var DetailFactor = "<table class='table'>"
    //     DetailFactor += "<tr><th>کد فاکتور</th><th>نام کالا</th><th>نام تامین کننده کالا </th><th>تعداد در کاتن</th><th>تعداد</th><th>فی کالا</th><th>مبلغ تخفیف پلکانی</th><th>مبلغ تخفیف ویژه</th><th>مبلغ کل تخفیفات</th><th>مبلغ نهایی بدون مالیات و عوارض</th><th>مبلغ نهایی با مالیات و عوارض</th><th>مبلغ تخفیف</th></tr>"
    //     for (let index = 0; index < Detail_Factor.length; index++) {
    //         DetailFactor += "<tr class='rows' DataId=" + Detail_Factor[index].Id + ">" +
    //             "<td> " + Detail_Factor[index].Id + "</td>" +
    //             "<td> " + Detail_Factor[index].ProductName + "</td>" +
    //             "<td> " + Detail_Factor[index].SuppName + "</td>" +
    //             "<td>" + Detail_Factor[index].NoInpack + "</td>" +
    //             "<td>" + Detail_Factor[index].Famount + "</td>" +
    //             "<td>" + SeparateThreeDigits(Detail_Factor[index].UnitPrice) + "</td>" +
    //             "<td>" + Detail_Factor[index].GDiscount_Price + "</td>" +
    //             "<td>" + Detail_Factor[index].VDiscount_Price + "</td>" +
    //             "<td>" + SeparateThreeDigits(Detail_Factor[index].DiscountPrice) + "</td>" +
    //             "<td>" + SeparateThreeDigits(Detail_Factor[index].FinalPriceWithTax) + "</td>" +
    //             "<td>" + SeparateThreeDigits(Detail_Factor[index].FinalPriceWithoutTax) + "</td>" +
    //             "<td style='color:red'><input type='number' class='discountVal' value='" + Detail_Factor[index].DiscountVal + "'/></td>" +
    //             "</tr>"
    //     }
    //     DetailFactor += "</table>"
    // }

    //------------------------
    var OldSum = 0
    for (let index = 0; index < _Factor.length; index++) {
        OldSum += Math.round((_Factor[index].DiscountVal * _Factor[index].Famount * _Factor[index].UnitPrice) / 100);
    }
    $("#sumTakhfif span").remove()
    $("#sumTakhfif").append("<span>" + SeparateThreeDigits(OldSum) + "</span>")
    //----------------------
    $("#Detail1 table").remove()
    $("#Detail1").append(DetailFactor)
}
async function ShowDecision(obj, Detail_Factor, Discount_Confirm, MarketingDirector) {



    Obj_WorkFlow.OrderBy = "Id"
    Obj_WorkFlow.Is_Increase = false
    Obj_WorkFlow.Filter = "(currentStep eq " + obj.Step + ")"
    var Discount_WorkFlow = await get_Records(Obj_WorkFlow)


    var CurrentBudget = MarketingDirector[0].MarketingDirector.CurrentBudget
    var sumTakhfif = $("#sumTakhfif span").text()
    var TaskhfifNiaz = sumTakhfif - CurrentBudget



    // UniqeMasterArrayr
    /* در صورتی که درکارتابل بود این قسمت نمایش داده میشود و لی اگر صفر بود منظور خود درخواست دهنده است که باید ویرایش نماید */
    // if (Detail_Factor[0].MasterId.Step > 0) {
    var DecisionDiv = "<table class='table'>"
    if (obj.Step == 3) {
        DecisionDiv += "<tr><td>درخواست افزایش بودجه : " +
            "<input id='TaskhfifNiaz' type='text' onkeyup='changeInputToThreeDigit(this)'" +
            "value=" + SeparateThreeDigits(TaskhfifNiaz > 0 ? TaskhfifNiaz : 0) + " />" +
            "<button style='margin-right:8px'  onclick='saveForTaskhfifNiaz({" +
            "MasterId:" + obj.MasterId + "," +
            "ServerBranchId:" + obj.ServerBranchId + "," +
            "MarketingDirectorId:" + MarketingDirector[0].MarketingDirector.Id + "," +
            "ConfirmId:" + (obj.Step == 3 ? MarketingDirector[0].Id : Discount_Confirm[0].Id) + "," +
            "Step:" + obj.Step +
            "})' " +
            "type='button' class='btn btn-success'>ثبت</button></td></tr>"
    }
    DecisionDiv += "<tr><td>توضیحات : " +
        "<textarea  rows=4 cols=100  name='comment' form='usrform'    placeholder='توضیحات ...'></textarea></td>" +
        "</tr>" +
        "<tr>" +
        "<td>نتیجه : "
    DecisionDiv += ""

    for (let index = 0; index < Discount_WorkFlow.length; index++) {
        DecisionDiv += "<input type='radio' name='decide' value=" + Discount_WorkFlow[index].Id + ">" + Discount_WorkFlow[index].Title

    }

    // DecisionDiv += "<input type='radio' name='decide' value=1> تایید"
    // DecisionDiv += "<input type='radio' name='decide' value=2> عدم تایید"
    // if (obj.Step == 3) {
    //     DecisionDiv += "<input type='radio' name='decide' value=3>توسط شعبه اصلاح شود"
    // }

    DecisionDiv += "<br></td></tr>" +
        "<tr><td colspan=2><button class='btnSave'    style='background-color:rgb(167, 16, 23)!important; border-radius: 17px;'   onclick='save({" +
        "MasterId:" + obj.MasterId + "," +
        "ServerBranchId:" + obj.ServerBranchId + "," +
        "MarketingDirectorId:" + MarketingDirector[0].MarketingDirector.Id + "," +
        "ConfirmId:" + (obj.Step == 3 ? MarketingDirector[0].Id : Discount_Confirm[0].Id) + "," +
        "Step:" + obj.Step +
        "})' " +
        "type='button' class='btn btn-success'>ذخیره</button></td>"
    "</tr>"
    DecisionDiv += "</table>"

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
async function showLogDetail(obj) {

    Obj_Discount_Log.OrderBy = "Id"
    Obj_Discount_Log.Is_Increase = false
    Obj_Discount_Log.Filter = "(MasterId/Id eq " + obj.MasterId + ") and (DetailId/Id eq " + obj.DetailId + ")"
    var Log = await get_Records(Obj_Discount_Log)

    var LogForm = "<table class='table table-bordered'>"
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
    // $("#Log1 table").remove()
    // $("#Log1").append(LogForm)
    $("#ModaDetail .modal-header").empty()
    $("#ModaDetail .modal-body").empty()
    $("#ModaDetail .modal-footer").empty()
    $("#ModaDetail .modal-header").append("<h3>تاریخچه اقدامات</h3>")
    $("#ModaDetail .modal-body").append(LogForm)
    $("#ModaDetail .modal-footer").append("<button class='btn btn-danger' type='button' onclick='closeModal()'>بستن</botton>")
    $("#ModaDetail").modal();


}
async function ShowAllFactor(Detail_Factor) {

    var DetailFactor = "<table class='table'>"
    DetailFactor += "<tr><th>Step</th><th>کد فاکتور</th><th>نام کالا</th><th>نام تامین کننده کالا </th><th>عنوان برند</th><th>تعداد در کاتن</th>" +
        "<th>تعداد</th><th>فی کالا</th><th>مبلغ تخفیف پلکانی</th><th>مبلغ تخفیف ویژه</th>" +
        "<th>مبلغ کل تخفیفات</th><th>مبلغ نهایی بدون مالیات و عوارض</th><th>مبلغ نهایی با مالیات و عوارض</th>" +
        "<th>درصد تخفیف</th><th>مبلغ تخفیف</th><th>وضعیت</th><th>در انتظار تایید</th></tr>"
    for (let index = 0; index < Detail_Factor.length; index++) {


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


        // "<td style='color:black'><input value=" + Detail_Factor[index].DiscountVal + " type='number' class='discountVal'  onchange='CalulateDarsad(this," + Detail_Factor[index].Famount + "," + Detail_Factor[index].UnitPrice + ")'/></td>" +
        DetailFactor += "<td><span>" + SeparateThreeDigits(
            Math.round(
                (parseFloat(Detail_Factor[index].DiscountVal) *
                    parseFloat(Detail_Factor[index].Famount) *
                    parseFloat(Detail_Factor[index].UnitPrice)) / 100
            )
        ) + "</span></td>" +
            "<td>" + Detail_Factor[index].StatusWorkFlow.Title + "</td>" +

            "<td>" + Detail_Factor[index].CurrentConfirm.Title + "</td>" +
            "</tr>"
    }

    DetailFactor += "</table>"
    $("#VaziatFactor table").remove()
    $("#VaziatFactor").append(DetailFactor)
}
function closeModal() {

    $('#ModaDetail').modal('toggle');
}
async function InsertToInsertSaleDocsMarketingDiscounts(Discount_Master, status) {
    _ServiceObj.typeWebService = "InsertSaleDocsMarketingDiscounts"

    _ServiceObj.SqlQuery = "update SaleDocsMarketingDiscounts" +
        " set PortalStatus=" + status + "" +
        " where PortalId=" + Discount_Master.Id + " and SaleDocsMarketingDiscountId=" + Discount_Master.IdSaleDocsMarketingDiscounts + ""

    // _ServiceObj.SqlQuery = "if((select count(*) from SaleDocsMarketingDiscounts where  SaleDocId=" + objMaster.SaleDocId + ")>0)" +
    // " begin" +
    // " update SaleDocsMarketingDiscounts" +
    // " set PortalStatus=" + objMaster.StatusWorkFlowId + ",PortalId=" + MasterId + "" +
    // " where SaleDocId=" + objMaster.SaleDocId + "" +
    // " select SaleDocsMarketingDiscountId as NewID from SaleDocsMarketingDiscounts where SaleDocId=" + objMaster.SaleDocId + "" +
    // " end " +
    // " else " +
    // " begin " +
    // " insert into SaleDocsMarketingDiscounts " +
    // " (SaleDocId,PortalStatus,PortalId,Dsc) " +
    // " select " + objMaster.SaleDocId + "," + objMaster.StatusWorkFlowId + "," + MasterId + ",'...'" +
    // " SELECT SCOPE_IDENTITY() AS NewID " +
    // " end ";



    var Factor = await serviceDiscount(_ServiceObj);



}
async function UpdateSaledocItems(obj) {
    _ServiceObj.typeWebService = "InsertSaleDocsMarketingDiscounts"
debugger
    _ServiceObj.SqlQuery = "update SaledocItems" +
        " set vDisPercent=" + obj.Vdispercent + "" +
        " where SaleDocItemId=" + obj.SaleDocItemId + " and SaleDocId=" + obj.SaleDocId + ""
    
    var Factor = await serviceDiscount(_ServiceObj);
    debugger
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
        var request = {
            SaleDocCode: _ServiceObj.Factor, IpServer: _ServiceObj.IP_Server,
            DB: _ServiceObj.DB,
            typeWebService: _ServiceObj.typeWebService,
            SaleDocId: _ServiceObj.SaleDocId,
            SqlQuery: _ServiceObj.SqlQuery
        }
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

