var Obj_Discount_Log = {
    NameList: "Discount_Log",
    Select: "DetailId/Id,DetailId/Title,MasterId/Title,MasterId/Id,ConfirmId/Title,ConfirmId/Id,ConfirmId/Moshakhasat,Id,Title,Result,Dsc,DateConfirm,TimeConfirm",
    Filter: "",
    Expand: "MasterId,ConfirmId,DetailId",
    OrderBy: "Id",
    Is_Increase: true
}
const Obj_Discount_ServerBranch = {
    NameList: "Discount_ServerBranch",
    Select: "User/Id,User/Title,Moavenat/Title,Moavenat/Id,Id,Title,IP_Server,TitleBranch,DataBaseName,CurrentBudget,IP_Server",
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
    Select: "Confirmator/Title,Confirmator/Id,ServerBranch/Title,ServerBranch/Id,ConfirmRow/Title,ConfirmRow/Id,ConfirmRow/Row,ConfirmRow/Role,Id,Title",
    Filter: "",
    Expand: "Confirmator,ServerBranch,ConfirmRow",
    OrderBy: "Moavenat/Title",
    Is_Increase: true
}
const Obj_Discount_Master = {
    NameList: "Discount_Master",
    Select: "ServerBranch/Id,ServerBranch/Title,User/Id,User/Title,StatusWorkFlow/Id,StatusWorkFlow/Title," +
        "Id,Title,SaleDocCode,OrderDate,TitleUser,TitleUser,CustomerCode,DateCreated,TimeCreated,SendNotification,SaleDocId,IdSaleDocsMarketingDiscounts",
    Filter: "",
    Expand: "User,ServerBranch,StatusWorkFlow",
    OrderBy: "Id",
    Is_Increase: true
}
const Obj_Discount_Detail = {
    NameList: "Discount_Detail",
    Select: "CurrentConfirm/Id,CurrentConfirm/Title,StatusWorkFlow/Id,StatusWorkFlow/Title,ServerBranch/CurrentBudget,ServerBranch/Title,ServerBranch/Id,MasterId/IdUser,MasterId/SaleDocCode,MasterId/Id,MasterId/Title," +
        "MasterId/Id,MasterId/Title,MasterId/SaleDocCode,MasterId/OrderDate,MasterId/FinalDate,MasterId/CustomerCode," +
        "MasterId/CID,MasterId/TitleUser,MasterId/SaleDocId," +
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
        "Id,Title,DiscountVal,MasterId/DateCreated,MasterId/TimeCreated,Famount,UnitPrice,lastDsc,SaledocItemId",
    Filter: "",
    Expand: "MasterId,ServerBranch,StatusWorkFlow,CurrentConfirm",
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
const Obj_WorkFlow = {
    NameList: "Discount_WorkFlow",
    Select: "Id,Title,currentStep,nextStep,BaseData/Title,BaseData/Id,BaseData/Order,BaseData/Code,BaseDataPart/Title,BaseDataPart/Id,BaseDataPart/Order,BaseDataPart/Code",
    Filter: "",
    Expand: "BaseData,BaseDataPart",
    OrderBy: "Id",
    Is_Increase: true
}
const Obj_Discount_ConfirmRows = {
    NameList: "Discount_ConfirmRows",
    Select: "Id,Title,Row,Role",
    Filter: "",
    Expand: "",
    OrderBy: "Id",
    Is_Increase: true
}
const Obj_Discount_Moavenat = {
    NameList: "Discount_Moavenat",
    Select: "User/Title,User/Id,Id,Title,CurrentBudget",
    Filter: "",
    Expand: "User",
    OrderBy: "CurrentBudget",
    Is_Increase: true
}
const Obj_Discount_BudgetIncrease = {
    NameList: "Discount_BudgetIncrease",
    Select: "ServerBranch/Title,ServerBranch/Id,Moavenat/Title,Moavenat/Id,Id,Title,BudgetPrice,TimeCreated,DateCreated,IsIncrease,dsc",
    Filter: "",
    Expand: "Moavenat,ServerBranch",
    OrderBy: "DateCreated",
    Is_Increase: true
}
const Obj_Discount_IncreaseBudget = {
    NameList: "Discount_IncreaseBudget",
    Select: "Confirmator/Title,Confirmator/Id,"+
    "MarketingDirector/Title,MarketingDirector/Id,MarketingDirector/CurrentBudget,"+
    "MasterId/Title,MasterId/Id,"+
    "Id,Title,price,IsEffect,TimeCreated,DateCreated",
    Filter: "",
    Expand: "Confirmator,MarketingDirector,MasterId",
    OrderBy: "price",
    Is_Increase: true
}


