function GetTransaction(name , price , id){
    let data = '{
          "paymentTypes":{"card":"Y","portmone":"Y","token":"N",
                          "clicktopay":"Y","createtokenonly":"N"},
          "priorityPaymentTypes":{"card":"1","portmone":"2",
                                  "token":"0","clicktopay":"1","createtokenonly":"0"},
          "payee":{"payeeId":"3048","login":"","dt":"","signature":"", "shopSiteId":""},
          "order":{"description":"Test Payment","shopOrderNumber":"SHP-00445401",
                   "billAmount":"10","attribute1":"1","attribute2":"2","attribute3":"3",
                   "attribute4":"4","attribute5":"","successUrl":"","failureUrl":"",
                   "preauthFlag":"N","billCurrency":"UAH", "encoding":""},
          "token":{"tokenFlag":"N","returnToken":"N","token":"","cardMask":"",
                   "otherPaymentMethods":"Y","sellerToken":""},
          "payer":{"lang":"uk", "emailAddress":"test@ukr.net"},
          "style":{"type":"light","logo":"","backgroundColorHeader":"",
                   "backgroundColorButtons":"","colorTextAndIcons":"",
                   "borderColorList":"","bcMain":""}
        }'