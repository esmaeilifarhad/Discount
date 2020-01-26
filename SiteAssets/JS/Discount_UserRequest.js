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



    showCartabl();

});
//-----------------------

function groupTypes() {
    var types = {};

    for (var i = 0; i < $scope.foodPlans.length; i++) {
        var groupName = $scope.foodPlans[i].fD_Date;
        if (!types[groupName]) {
            types[groupName] = [];
        }
        types[groupName].push({ id: $scope.foodPlans[i].f_FTID, title: $scope.foodPlans[i].fT_Title });
    }
    myArray = [];
    for (var groupName in types) {
        myArray.push({ group: groupName, types: types[groupName] });
    }
}

//--------------------------------

async function showCartabl() {
    $("#ShowUsers .table").remove()
    var UsersInGroup = await IsUserInGroup(223)
    UsersInGroup = UsersInGroup.d.results

    var Discount_ServerBranch = await Get_Discount_ServerBranch();
    var UsersBranch = await Get_UsersBranch()
    var BudgetIncrease = await Get_BudgetIncrease()
    var Detail_DiscountVal = await Get_Detail_DiscountVal()

    var MyLinks = ""
    MyLinks += "<select>"
    for (let index = 0; index < Discount_ServerBranch.length; index++) {

        MyLinks += "<option value=" + Discount_ServerBranch[index].Id + ">" + Discount_ServerBranch[index].Title + "</option>"
    }
    MyLinks += "</select>"


    var table = "<table class='table'>"
    table += "<tr><th>ردیف</th><th>کاربر</th><th>شعبه</th><th>بودجه</th><th>افزایش بودجه</th><th>کاهش بودجه</th></tr>"
    for (let index = 0; index < UsersInGroup.length; index++) {

        var resUsersBranch = UsersBranch.find(x => x.User.Id == UsersInGroup[index].Id);
        if (resUsersBranch == undefined) {

            table += "<tr class='rows' LoginTitle='" + removeComma(UsersInGroup[index].Title.toString()) + "' LoginName=" + UsersInGroup[index].Id + " type='C' dataId=" + 0 + "><td>" + (index + 1) + "</td><td>" + UsersInGroup[index].Title + "</td>"
            table += "<td>" + MyLinks + "</td>"
            table += "<td>0</td>"
            table += "<td>افزایش</td>"
            table += "<td>کاهش</td>"
            table += "</tr>"
        }
        else {

            table += "<tr class='rows' LoginTitle='" + removeComma(UsersInGroup[index].Title.toString()) + "' LoginName=" + UsersInGroup[index].Id + " type='U' dataId=" + resUsersBranch.Id + "><td>" + (index + 1) + "</td><td>" + UsersInGroup[index].Title + "</td>"
            table += "<td><select>"
            for (let index2 = 0; index2 < Discount_ServerBranch.length; index2++) {

                var resServerBranch = UsersBranch.find(x =>
                    x.Branch.Id == Discount_ServerBranch[index2].Id
                    &&
                    x.User.Id == UsersInGroup[index].Id);

                if (resServerBranch == undefined) {

                    table += "<option value=" + Discount_ServerBranch[index2].Id + ">" + Discount_ServerBranch[index2].Title + "</option>"
                }
                else {
                    table += "<option value=" + Discount_ServerBranch[index2].Id + " selected>" + Discount_ServerBranch[index2].Title + "</option>"
                }
            }
            table += "</select></td>"

           

         
            //-------------------
            var types = {};

            for (var i = 0; i < BudgetIncrease.length; i++) {
                
                
                var groupName = BudgetIncrease[i].UsersBranch.Id;
                
                
                if (!types[groupName]) {
                    types[groupName] = [];
                }
                
                
                types[groupName].push({ BudgetPrice: BudgetIncrease[i].BudgetPrice,IsIncrease:BudgetIncrease[i].IsIncrease });
                
            }
            
            myArray = [];
            for (var groupName in types) {
                myArray.push({ group: groupName, types: types[groupName] });
            }
            
            //--------------------------------------

            var resBudgetIncrease = myArray.find(x => x.group == resUsersBranch.Id);
            
            if (resBudgetIncrease == undefined) {
                table += "<td>0</td>"
            }
            else {
                
                var sum=0
                for (let j = 0; j < resBudgetIncrease.types.length; j++) {
                    if(resBudgetIncrease.types[j].IsIncrease==true)
                    {
                        sum+=resBudgetIncrease.types[j].BudgetPrice
                    }
                    else
                    {
                        sum-=resBudgetIncrease.types[j].BudgetPrice
                    }
                    
                    
                }
                debugger
                console.log(Detail_DiscountVal)
                var minus=0
                for (let index3 = 0; index3 < Detail_DiscountVal.length; index3++) {
                    minus += parseInt(Detail_DiscountVal[index3].DiscountVal);
                }
                table += "<td style=color:"+((sum- minus)>0?"green":"red")+">" +(sum- minus)+ "</td>"
            }

            table += "<td><span onclick='showModalIncreaseBudget(" + resUsersBranch.Id + ")' style='color:green' class='fa fa-plus'></span></td>"
            table += "<td><span onclick='showModalDecreaseBudget(" + resUsersBranch.Id + ")' style='color:red' class='fa fa-minus'></span></td>"
            table += "</tr>"
        }
    }
    table += "</table>"

    $("#ShowUsers").append(table)

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
            select("UsersBranch/Title,UsersBranch/Id,Id,Title,BudgetPrice,DateCreated,IsIncrease").
            expand("UsersBranch").
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
function update_UsersBranch(Record) {

    return new Promise(resolve => {
        var list = $pnp.sp.web.lists.getByTitle("Discount_UsersBranch");
        list.items.getById(Record.ID).update({
            Title: Record.LoginTitle,
            UserId: Record.LoginName,
            BranchId: Record.Branch,
            IdUser:Record.IdUser
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
            BranchId: Record.Branch,
            IdUser:Record.IdUser
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
            IsIncrease:Record.IsIncrease
        }).then(function (item) {
            resolve(item);
        }).catch(error => {
            console.log(error)
            resolve(error);
        })
    });
}

//-----------------------------

function showModalIncreaseBudget(Id) {
    _ID_Discount_UsersBranch = Id
    $("#ModalIncreaseBudget").modal();
}
function showModalDecreaseBudget(Id) {
    _ID_Discount_UsersBranch = Id
    $("#ModalIncreaseBudget").modal();
}
async function IncreaseBudget() {
    var Budget = parseInt($("input[name=Budget]").val());
    var Record = { Title: "test", UserIncreaserId: _spPageContextInfo.userId, UserBranchId: _ID_Discount_UsersBranch, dsc: "dsc", BudgetPrice: Budget,IsIncrease:true }

    var res = await create_BudgetIncrease(Record)
    alert("با موفقیت ذخیره شد")
    $("#ModalIncreaseBudget").modal('toggle');
    showCartabl()
}
async function DecreaseBudget() {
    var Budget = parseInt($("input[name=Budget]").val());
    var Record = { Title: "test", UserIncreaserId: _spPageContextInfo.userId, UserBranchId: _ID_Discount_UsersBranch, dsc: "dsc", BudgetPrice: Budget,IsIncrease:false }

    var res = await create_BudgetIncrease(Record)
    alert("با موفقیت ذخیره شد")
    $("#ModalIncreaseBudget").modal('toggle');
    showCartabl()
}
//-------------------------------------save
// async function Save() {
//    // $.LoadingOverlay("show");
//    
//     var t = await save2();
//     
//     //showKalaPolicy();
//    // $.LoadingOverlay("hide");
// }

async function Save() {

    // return new Promise(resolve => {

    var count = $("#ShowUsers table .rows").length;
    $("#ShowUsers table .rows").each(async function (i) {
        var Id = $(this).attr("dataId")
        var type = $(this).attr("type")
        var LoginName = $(this).attr("LoginName")
        var LoginTitle = $(this).attr("LoginTitle")
        var Branch = $(this).find("select option:selected").val();
        var Branchtxt = $(this).find("select option:selected").text();

        if (type == "C") {

            // _RecordSave.push({ ID: Id, type: type, Branch: Branch, LoginName: LoginName, Branchtxt: Branchtxt })
            var record = { ID: Id, type: type, Branch: Branch, LoginName: LoginName, Branchtxt: Branchtxt, LoginTitle: LoginTitle,IdUser:LoginName }
            var res11 = await create_UsersBranch(record)
            if (i + 1 >= count) {

                // this will be executed at the end of the loop
                resolve("finish");
            }

        }
        else if (type == "U") {
            // _RecordSave.push({ ID: Id, type: type, Branch: Branch, LoginName: LoginName, Branchtxt: Branchtxt })
            var record = { ID: Id, type: type, Branch: Branch, LoginName: LoginName, Branchtxt: Branchtxt, LoginTitle: LoginTitle,IdUser:LoginName }
            var res22 = await update_UsersBranch(record)
            console.log(i + " - " + count)
            if (i + 1 >= count) {
                alert("ذخیره انجام شد")

                showCartabl();
            }
        }
        else {
            alert("موردی برای ذخیره یافت نشد")
        }


    })


    // });
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
function getUserInfo() {

    // Get the people picker object from the page.
    var peoplePicker = this.SPClientPeoplePicker.SPClientPeoplePickerDict.peoplePickerDiv_TopSpan;

    // Get information about all users.
    var users = peoplePicker.GetAllUserInfo();
    var userInfo = '';
    for (var i = 0; i < users.length; i++) {
        var user = users[i];
        for (var userProperty in user) {
            userInfo += userProperty + ':  ' + user[userProperty] + '<br>';
        }
    }
    $('#resolvedUsers').html(userInfo);

    // Get user keys.
    var keys = peoplePicker.GetAllUserKeys();
    $('#userKeys').html(keys);

    // Get the first user's ID by using the login name.
    getUserId(users[0].Key);
}

//--------------------------------------------------------------------Utility
function calDayOfWeek(date) {
    var mounth = ""
    var rooz = ""
    var arrayDate = date.split("/")
    mounth = (parseInt(arrayDate[1]) <= 9) ? "0" + parseInt(arrayDate[1]) : parseInt(arrayDate[1])
    rooz = (parseInt(arrayDate[2]) <= 9) ? "0" + parseInt(arrayDate[2]) : parseInt(arrayDate[2])

    date = arrayDate[0] + mounth + rooz;

    //date = date.replace(/\//g, '');
    date = date.substr(date.length - 6); // 13980203=> 980203

    const m = moment();
    const numberWeek = moment(date, 'jYYjMMjDD').weekday();
    let day;
    switch (numberWeek) {
        case 0:
            day = "یکشنبه";
            break;
        case 1:
            day = "دوشنبه";
            break;
        case 2:
            day = "سه شنبه";
            break;
        case 3:
            day = "چهارشنبه";
            break;
        case 4:
            day = "پنج شنبه";
            break;
        case 5:
            day = "جمعه";
            break;
        case 6:
            day = "شنبه";
    }
    return day;
}
//980809  input parameter
function foramtDate(str) {
    if (str.length == 6) {
        return "13" + str.slice(0, 2) + "/" + str.slice(2, 4) + "/" + str.slice(4, 6)
    }

}
function splitString(str) {
    if (str == null) return ""
    return str.split(";#")
}
//سه رقم سه رقم جدا کنه برای پول   SeparateThreeDigits
function SeparateThreeDigits(str) {
    var x = parseInt(str);
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");

    // return parseInt(str);

}
function removeComma(str) {

    var noCommas = str.replace(/,/g, '')
    //  asANumber = +noCommas;
    return noCommas
}
function removeLastChar(str) {
    return str.slice(0, -1)
}
//-----------------------
