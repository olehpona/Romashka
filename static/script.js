function GetPay(price,id,name ){
    let sum = Number(price)*Number(document.getElementById('count').value);
    let data = {
        "paymentTypes":{"gpay":"Y","card":"Y","portmone":"Y","token":"N",
                        "clicktopay":"Y","createtokenonly":"N"},
        "priorityPaymentTypes":{"gpay":"3","card":"3","portmone":"1",
                                "token":"0","clicktopay":"0","createtokenonly":"0"},
        "payee":{"payeeId":"3048","login":"","dt":"","signature":"", "shopSiteId":""},
        "order":{"description":"Ромашка " + name,"shopOrderNumber":"SHP-00445401",
                 "billAmount":sum.toString(),"attribute1":"1","attribute2":"2","attribute3":"3",
                 "attribute4":"4","attribute5":"","successUrl":"","failureUrl":"",
                 "preauthFlag":"N","billCurrency":"UAH", "encoding":""},
        "token":{"tokenFlag":"N","returnToken":"N","token":"","cardMask":"",
                 "otherPaymentMethods":"Y","sellerToken":""},
        "payer":{"lang":"uk", "emailAddress":"test@ukr.net"},
        "style":{"type":"light","logo":"","backgroundColorHeader":"",
                 "backgroundColorButtons":"","colorTextAndIcons":"",
                 "borderColorList":"","bcMain":""}
        }
    document.getElementById('paydata').value = JSON.stringify(data);
    document.getElementById('payform').submit();

}