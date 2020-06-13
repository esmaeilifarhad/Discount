var portalAddress = _spPageContextInfo.webAbsoluteUrl;
var today = todayShamsy8char()
var userId = _spPageContextInfo.userId

async function lstJunc() {
    $.LoadingOverlay("show");
    $("#BrandJunction").empty()
    $("#SupplierJunction").empty()
    $("#ProductTypeJunction").empty()

    Obj_Discount_Junctions_tbls_Marketing.OrderBy = "Id"
    Obj_Discount_Junctions_tbls_Marketing.Is_Increase = true
    Obj_Discount_Junctions_tbls_Marketing.Filter = ""

    Obj_MarketingDirector.OrderBy = "Id"
    Obj_MarketingDirector.Is_Increase = true
    Obj_MarketingDirector.Filter = ""

    Obj_Discount_Brand.OrderBy = "Id"
    Obj_Discount_Brand.Is_Increase = true
    Obj_Discount_Brand.Filter = ""

    Obj_Discount_Supplier.OrderBy = "Id"
    Obj_Discount_Supplier.Is_Increase = true
    Obj_Discount_Supplier.Filter = ""



    //var Discount_Junctions_tbls_Marketing = await get_Records(Obj_Discount_Junctions_tbls_Marketing)

    var results = await Promise.all([
        get_Records(Obj_Discount_Junctions_tbls_Marketing),
        get_Records(Obj_MarketingDirector),
        get_Records(Obj_Discount_Brand),
        get_Records(Obj_Discount_Supplier),
        GetUsersInGroup(portalAddress, 255)
    ]);

    var Discount_Junctions_tbls_Marketing = results[0]
    var Discount_MarketingDirector = results[1]
    var Discount_Brand = results[2]
    var Discount_Supplier = results[3]
    var Discount_Users = results[4]



    /*
        var table = "<table>"
        for (let index = 0; index < Discount_Brand.length; index++) {
            table += "<tr><td>"
            table += "<input type='checkbox' name='vehicle1' value='Bike'><label style='display:inline'>" + Discount_Brand[index].Title + "</label>"
            table += "</td></tr>"
        }
        table += "</table>"
        $("#BrandJunction").empty()
        $("#BrandJunction").append(table)
        */
    //-------------------------------------------------
    var table = "<input onclick='CreateMarketing()' style='background-color:lightblue;float:right;margin:10px' type='button' value='جدید'/><table class='table'>" +
        "<tr><th>نقش</th><th>تایید کننده</th><th>جانشین</th><th>آیا جانشین باید تایید کند</th></tr>"
    for (let index = 0; index < Discount_MarketingDirector.length; index++) {

        table += "<tr>" +
            "<td>" + Discount_MarketingDirector[index].Title + "</td>" +
            "<td>" + Discount_MarketingDirector[index].User.Title + "</td>" +
            "<td>" + Discount_MarketingDirector[index].Substitute_User.Title + "</td>"
        if (Discount_MarketingDirector[index].IsSubstitute == true) {
            table += "<td><input type='checkbox' name='rdbIsSubstitute' checked onclick='UpdateSubstitute({Id:" + Discount_MarketingDirector[index].Id + ",IsSubstitute:" + false + "})'/></td>"
        }
        else {
            table += "<td><input type='checkbox' name='rdbIsSubstitute'  onclick='UpdateSubstitute({Id:" + Discount_MarketingDirector[index].Id + ",IsSubstitute:" + true + "})'/></td>"
        }
        table += "<td><input style='background-color:green' type='button' value='ویرایش' onclick='EditMarketing({Id:" + Discount_MarketingDirector[index].Id + "})'/></td>"
        table += "<td><input style='background-color:red' type='button' value='حذف' onclick='DeleteMarketing({Id:" + Discount_MarketingDirector[index].Id + "})'/></td>" +

            "</tr>"
    }
    table += "</table>"
    $("#MarketingDirectoAssign").empty()
    $("#MarketingDirectoAssign").append(table)

    //---------------------------------------------------


    var table = "<table><tr><td>انتخاب نمایید : </td><td><select id='selectOptionMarketing'  onchange='getvalMarketingDirector(this.value)'>"
    table += "<option>انتخاب نمایید...</option>"
    for (let index = 0; index < Discount_MarketingDirector.length; index++) {

        table += "<option  value=" + Discount_MarketingDirector[index].Id + ">" + Discount_MarketingDirector[index].Title


    }
    table += "</select></td>" +
        "<td><input type='button' style='background-color: rgb(22, 184, 103);margin: 1px;' value='ذخیره' onclick='SaveJunctions()'/><td>"
    "</tr></table>"
    $("#MarketingDirectorJunction").empty()
    $("#MarketingDirectorJunction").append(table)
    //----------------------------------------------
    $.LoadingOverlay("hide");

}
async function UpdateSubstitute(obj) {

    $.LoadingOverlay("show");
    var objj = { IsSubstitute: obj.IsSubstitute }
    var res = await update_Record(obj.Id, objj, "Discount_MarketingDirector")
    lstJunc()
    $.LoadingOverlay("hide");
}
async function CreateMarketing() {

    Obj_MarketingDirector.OrderBy = "Id"
    Obj_MarketingDirector.Is_Increase = true
    Obj_MarketingDirector.Filter = ""

    var results = await Promise.all([
        get_Records(Obj_MarketingDirector),
        GetUsersInGroup(portalAddress, 255)
    ]);


    var Discount_MarketingDirector = results[0]
    var Discount_Users = results[1]

    var table = "<table class='table'>" +
        "<tr><td>عنوان</td><td><input type='text' name='titleModirBazaryaby'/></td></tr>" +
        "<tr><td>تایید کننده</td><td><select id='selectOptionPrinciple'>"
    for (let index = 0; index < Discount_Users.length; index++) {
        table += "<option value=" + Discount_Users[index].Id + ">" + Discount_Users[index].Title + "</option>"
    }
    table += "</select></td></tr>" +
        "<tr><td>تایید کننده جانشین</td><td><select id='selectOptionSubstitute'>"
    for (let index = 0; index < Discount_Users.length; index++) {
        table += "<option value=" + Discount_Users[index].Id + ">" + Discount_Users[index].Title + "</option>"
    }
    table += "</select></td></tr>"
    table += "</table>"

    $("#ModaDetail .modal-header").empty()
    $("#ModaDetail .modal-header").append("<h3>مدیر مارکتینگ جدید</h3>")

    $("#ModaDetail .modal-body").empty()
    $("#ModaDetail .modal-body").append(table)

    $("#ModaDetail .modal-footer").empty()
    $("#ModaDetail .modal-footer").append("<button class='btn btn-danger' type='button' onclick='closeModal()'>بستن</botton>" +
        "<button class='btn btn-success' type='button' onclick='createNewMrketing()'>ذخیره</botton>")
    $("#ModaDetail").modal();

}
async function createNewMrketing() {

    // var x= $("input[name='titleModirBazaryaby']" ).text();
    var titleModirBazaryaby = $("input[name='titleModirBazaryaby']").val();
    if (titleModirBazaryaby == "" || titleModirBazaryaby == null) return
    var title = $("#selectOptionPrinciple option:selected").text();
    var UserId = $("#selectOptionPrinciple option:selected").val();

    var title = $("#selectOptionSubstitute option:selected").text();
    var Substitute_UserId = $("#selectOptionSubstitute option:selected").val();

    var obj = { Title: titleModirBazaryaby, UserId: UserId, Substitute_UserId: Substitute_UserId }
    var res = await create_Record(obj, "Discount_MarketingDirector")
    $("#ModaDetail").modal("toggle");
    lstJunc()

}
async function DeleteMarketing(obj) {

    $.LoadingOverlay("show");
    var res = await Delete_Records(obj.Id, "Discount_MarketingDirector")
    lstJunc()
    $.LoadingOverlay("hide");
}
async function EditMarketing(obj) {
    Obj_MarketingDirector.OrderBy = "Id"
    Obj_MarketingDirector.Is_Increase = true
    Obj_MarketingDirector.Filter = ""

    var results = await Promise.all([
        get_Records(Obj_MarketingDirector),
        GetUsersInGroup(portalAddress, 255)
    ]);


    var Discount_MarketingDirector = results[0]
    var Discount_Users = results[1]

    Obj_MarketingDirector.ID = obj.Id
    var MarketingDirector = await get_RecordByID(Obj_MarketingDirector)

    var table = "<table class='table'>" +
        "<tr><td>عنوان</td><td><input type='text' name='titleModirBazaryaby' value='" + MarketingDirector.Title + "' /></td></tr>" +
        "<tr><td>تایید کننده</td><td><select id='selectOptionPrinciple'>"
    for (let index = 0; index < Discount_Users.length; index++) {
        
        if (MarketingDirector.User.Id == Discount_Users[index].Id)
            table += "<option selected value=" + Discount_Users[index].Id + ">" + Discount_Users[index].Title + "</option>"
        else
            table += "<option  value=" + Discount_Users[index].Id + ">" + Discount_Users[index].Title + "</option>"
    }
    table += "</select></td></tr>" +
        "<tr><td>تایید کننده جانشین</td><td><select id='selectOptionSubstitute'>"
    for (let index = 0; index < Discount_Users.length; index++) {

        if (MarketingDirector.Substitute_User.Id == Discount_Users[index].Id)
            table += "<option selected value=" + Discount_Users[index].Id + ">" + Discount_Users[index].Title + "</option>"
        else
            table += "<option  value=" + Discount_Users[index].Id + ">" + Discount_Users[index].Title + "</option>"


    }
    table += "</select></td></tr>"
    table += "</table>"

    $("#ModaDetail .modal-header").empty()
    $("#ModaDetail .modal-header").append("<h3>مدیر مارکتینگ جدید</h3>")

    $("#ModaDetail .modal-body").empty()
    $("#ModaDetail .modal-body").append(table)

    $("#ModaDetail .modal-footer").empty()
    $("#ModaDetail .modal-footer").append("<button class='btn btn-danger' type='button' onclick='closeModal()'>بستن</botton>" +
        "<button class='btn btn-success' type='button' onclick='UpdateMarketing({Id:" + MarketingDirector.Id + "})'>ویرایش</botton>")
    $("#ModaDetail").modal();


    debugger
}
async function getvalMarketingDirector(MarketingDirectorId) {
    //---------------برند
    Obj_Discount_Brand.OrderBy = "Id"
    Obj_Discount_Brand.Is_Increase = true
    Obj_Discount_Brand.Filter = ""
    //------------تامین کننده
    Obj_Discount_Supplier.OrderBy = "Id"
    Obj_Discount_Supplier.Is_Increase = true
    Obj_Discount_Supplier.Filter = ""
    //------------جدول واسط
    Obj_Discount_Junctions_tbls_Marketing.OrderBy = "Id"
    Obj_Discount_Junctions_tbls_Marketing.Is_Increase = true
    Obj_Discount_Junctions_tbls_Marketing.Filter = "(MarketingDirectorId/Id eq " + MarketingDirectorId + ")"
    //------------گروه محصول
    Obj_Discount_ProductTypes.OrderBy = "Id"
    Obj_Discount_ProductTypes.Is_Increase = true
    Obj_Discount_ProductTypes.Filter = ""



    var results = await Promise.all([
        get_Records(Obj_Discount_Junctions_tbls_Marketing),
        get_Records(Obj_Discount_Brand),
        get_Records(Obj_Discount_Supplier),
        get_Records(Obj_Discount_ProductTypes),

    ]);

    var Discount_Junctions_tbls_Marketing = results[0]
    var Discount_Brand = results[1]
    var Discount_Supplier = results[2]
    var Discount_ProductTypes = results[3]


    //------------------برند
    var table = "<table>" +
        "<tr><th><input type='checkbox' id='selectAll' value='انتخاب هم' title='انتخاب هم' alt='انتخاب همه' onclick='selectAllchk(this,\"" + '#BrandJunction' + "\")' /></th></tr>"



    for (let index = 0; index < Discount_Brand.length; index++) {
        var res = Discount_Junctions_tbls_Marketing.find(x =>
            x.BrandId.Id
            == Discount_Brand[index].Id)

        table += "<tr><td>"
        if (res == undefined)
            table += "<input onclick='CheckDuplicate(this,\"" + 'Brand' + "\")'  type='checkbox' name='vehicle1' value=" + Discount_Brand[index].Id + "><label style='display:inline'>" + Discount_Brand[index].Title + "</label>"
        else
            table += "<input onclick='CheckDuplicate(this,\"" + 'Brand' + "\")'  checked type='checkbox' name='vehicle1' value=" + Discount_Brand[index].Id + "><label style='display:inline'>" + Discount_Brand[index].Title + "</label>"
        table += "</td></tr>"
    }
    table += "</table>"
    $("#BrandJunction").empty()
    $("#BrandJunction").append(table)
    //------------تامین کننده

    var table = "<table>" +
        "<tr><th><input type='checkbox' id='selectAll' value='انتخاب هم' title='انتخاب هم' alt='انتخاب همه' onclick='selectAllchk(this,\"" + '#SupplierJunction' + "\")' /></th></tr>"
    for (let index = 0; index < Discount_Supplier.length; index++) {
        var res = Discount_Junctions_tbls_Marketing.find(x =>
            x.SupplierId.Id
            == Discount_Supplier[index].Id)
        table += "<tr><td>"
        if (res == undefined)
            table += "<input type='checkbox' name='vehicle1' value=" + Discount_Supplier[index].Id + "><label style='display:inline'>" + Discount_Supplier[index].Title + "</label>"
        else
            table += "<input type='checkbox' checked name='vehicle1' value=" + Discount_Supplier[index].Id + "><label style='display:inline'>" + Discount_Supplier[index].Title + "</label>"
        table += "</td></tr>"
    }
    table += "</table>"
    $("#SupplierJunction").empty()
    $("#SupplierJunction").append(table)
    //------------گروه محصول

    var table = "<table>" +
        "<tr><th><input type='checkbox' id='selectAll' value='انتخاب هم' title='انتخاب هم' alt='انتخاب همه' onclick='selectAllchk(this,\"" + '#ProductTypeJunction' + "\")' /></th></tr>"

    for (let index = 0; index < Discount_ProductTypes.length; index++) {
        var res = Discount_Junctions_tbls_Marketing.find(x =>
            x.ProductTypesId.Id
            == Discount_ProductTypes[index].Id)
        table += "<tr><td>"
        if (res == undefined)
            table += "<input type='checkbox' name='vehicle1' value=" + Discount_ProductTypes[index].Id + "><label style='display:inline'>" + Discount_ProductTypes[index].Title + "</label>"
        else
            table += "<input type='checkbox' checked name='vehicle1' value=" + Discount_ProductTypes[index].Id + "><label style='display:inline'>" + Discount_ProductTypes[index].Title + "</label>"
        table += "</td></tr>"
    }
    table += "</table>"
    $("#ProductTypeJunction").empty()
    $("#ProductTypeJunction").append(table)


}
async function SaveJunctions() {
    $.LoadingOverlay("show");
    // var PlackNo = $("#selectOptionMarketing option:selected").text();
    var MarketingDirectorId = $("#selectOptionMarketing option:selected").val();

    //-------------Delete
    Obj_Discount_Junctions_tbls_Marketing.OrderBy = "Id"
    Obj_Discount_Junctions_tbls_Marketing.Is_Increase = true
    Obj_Discount_Junctions_tbls_Marketing.Filter = "((BrandId/Id ne " + null + ") or (SupplierId/Id ne " + null + ") or (ProductTypesId/Id ne " + null + ")) and (MarketingDirectorId/Id eq " + MarketingDirectorId + ")"


    var results = await Promise.all([
        get_Records(Obj_Discount_Junctions_tbls_Marketing),
    ]);
    var Discount_Junctions_tbls_Marketing = results[0]
    var CreatePromise = []
    for (let index = 0; index < Discount_Junctions_tbls_Marketing.length; index++) {
        const element = Discount_Junctions_tbls_Marketing[index];
        CreatePromise.push(Delete_Records(Discount_Junctions_tbls_Marketing[index].Id, "Discount_Junctions_tbls_Marketing"))
    }
    //-------------------------Insert
    //-----Insert Brand
    $("#BrandJunction table tr td input").each(async function () {

        if ($(this)[0].checked == true) {
            var obj = { BrandIdId: parseInt($(this)[0].value), MarketingDirectorIdId: parseInt(MarketingDirectorId), Title: "fery" }

            CreatePromise.push(create_Record(obj, "Discount_Junctions_tbls_Marketing"))
        }

    })
    //----------insert Supplier
    $("#SupplierJunction table tr td input").each(async function () {

        if ($(this)[0].checked == true) {
            var obj = { SupplierIdId: parseInt($(this)[0].value), MarketingDirectorIdId: parseInt(MarketingDirectorId), Title: "fery" }

            CreatePromise.push(create_Record(obj, "Discount_Junctions_tbls_Marketing"))
        }

    })
    //----------insert ProductTypes
    $("#ProductTypeJunction table tr td input").each(async function () {

        if ($(this)[0].checked == true) {
            var obj = { ProductTypesIdId: parseInt($(this)[0].value), MarketingDirectorIdId: parseInt(MarketingDirectorId), Title: "fery" }

            CreatePromise.push(create_Record(obj, "Discount_Junctions_tbls_Marketing"))
        }

    })

    var results = await Promise.all(CreatePromise);

    
    $.LoadingOverlay("hide");
    showAlert();
    getvalMarketingDirector(MarketingDirectorId)
}
async function selectAllchk(s, type) {

    var res = $(s)[0].checked;
    if (res == true) {
        $(type + " table tr td input").each(function () {

            $(this)[0].checked = true
        })

    }
    else {
        $(type + " table tr td input").each(function () {

            $(this)[0].checked = false
        })
    }

}
async function UpdateMarketing(obj) {

    var titleModirBazaryaby = $("input[name='titleModirBazaryaby']").val();
    if (titleModirBazaryaby == "" || titleModirBazaryaby == null) return
    var title = $("#selectOptionPrinciple option:selected").text();
    var UserId = $("#selectOptionPrinciple option:selected").val();

    var title = $("#selectOptionSubstitute option:selected").text();
    var Substitute_UserId = $("#selectOptionSubstitute option:selected").val();

    var object = { Title: titleModirBazaryaby, UserId: UserId, Substitute_UserId: Substitute_UserId }
    var res = await update_Record(obj.Id, object, "Discount_MarketingDirector")
    $("#ModaDetail").modal("toggle");
    lstJunc()


}






