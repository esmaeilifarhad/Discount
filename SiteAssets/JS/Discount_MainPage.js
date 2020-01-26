var _CurrentIdDetail = 0
var CurrentCID = 0;
var CurrentPID = 0;
var CurrentName = ""
var CurrentDep = ""
var CurrentPLoginName = ""
var today = "";
var _exchangeRate = 0
var _Mojoodi_AnbarICT = 0;

var _UserInGroupos = []
var _checkedItem = []
var _usersInConfirm = []
var _MojoodiAnbarICT = []
var _MojoodyAnbarInPap = 0;
var _MojoodyAnbarInPortal = 0;
var portalAddress = _spPageContextInfo.webAbsoluteUrl;
/*
List Name :

Discount_Links
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
    var _usersInConfirm = []


    const m = moment();
    today = moment().format('jYYYY/jM/jD');//Today
    $(".today").append("<span>تاریخ امروز : </span><span>   " + today + "</span>")

    var todayarray = today.split("/")
    mounth = (parseInt(todayarray[1]) <= 9) ? "0" + parseInt(todayarray[1]) : parseInt(todayarray[1])
    rooz = (parseInt(todayarray[2]) <= 9) ? "0" + parseInt(todayarray[2]) : parseInt(todayarray[2])
    year = todayarray[0].substring(2, 4)
    today = year + "" + mounth + "" + rooz


    showCartabl();

});
//-------------------------------------------------------

async function showCartabl() {
    $("#tableres2 table  .rowData").remove()
    //---------------------
    var Links = await Get_Links();

    //----------------------------------------


    //----------------------------------------------


    var MyLinks = ""

    MyLinks += "<div class='animated swing infinite' style='height: 50px;  animation-duration: 2.5s; text-decoration: none;'>"
    for (let index = 0; index < Links.length; index++) {

        if (Links[index].BackgroundImageLocation == null || Links[index].LinkLocation == null) continue

        MyLinks += "<a target='_blank' class='navbar-brand' href='" + Links[index].LinkLocation.Url + "'>"
        MyLinks += "<img style='margin: 0 auto;max-width: 90px;' class='img-circle' src='" + Links[index].BackgroundImageLocation.Url + "' height='65' alt='mdb logo'>"

        MyLinks += "<p   style='background-color: white;padding: 5px;border-radius: 5px;'>"
        MyLinks += "<span >" + Links[index].Title + "</span>"
      
        MyLinks += "</p>"
        MyLinks += "</a>"

    }
    MyLinks += "</div>"

    $("#showLinks .navbar").append(MyLinks);
    //console.log(MyLinks)



}
//-------------------------------------------------------CRUD

function Get_Links() {
    return new Promise(resolve => {
        $pnp.sp.web.lists.
            getByTitle("Discount_Links").
            items.select().
            // expand("MasterId").
            //filter("(StatusWF eq 'درگردش')").
            orderBy("TileOrder", false).
            get().
            then(function (items) {
                resolve(items);
            });
    });
}


//-----------------------------


//----------------------------------------------------web services




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

//---------------------------------------------------------Utility
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
    var noCommas = str.replace(/,/g, ''),
        asANumber = +noCommas;
    return asANumber
}
function removeLastChar(str) {
    return str.slice(0, -1)
}
//-----------------------
