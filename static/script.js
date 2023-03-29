let sum = 0

function GetPay(price,pic,name ){
    document.getElementById('Pay').innerHTML = '';
    if (document.getElementById('payMethod').selectedOptions[0].innerHTML == 'Portmone'){
        sum = Number(price)*Number(document.getElementById('count').value);
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
    }   else if (document.getElementById('payMethod').selectedOptions[0].innerHTML == 'Mono'){
        document.getElementById('Pay').src = pic;
    }   else {
        document.getElementById('Pay').innerHTML = 'Оплачено';
    }


}

function changeAllInAll(){
    try{
        let service = document.getElementById('PostService').selectedOptions[0].innerHTML;
        document.getElementById('postServiceD').innerHTML = service;
    }
    catch {
        console.error('ABOBA ALERT')
    }
    try{
        let city = document.getElementById('City').value;
        document.getElementById('postCityD').innerHTML = city;
    }
    catch {
        console.error('ABOBA ALERT')
    }
    try {
        let point = document.getElementById('point').selectedOptions[0].innerHTML;
        document.getElementById('postPoinD').innerHTML = point;
    }
    catch (e){
        console.error(e)
    }
    try {
        let count = document.getElementById('count').value;
        document.getElementById('countD').innerHTML = count;
    }
    catch{
        console.error('ABOBA ALERT')
    }
    try{
        let sum = Number(document.getElementById('price').value)*Number(document.getElementById('count').value);
        document.getElementById('sumD').innerHTML = sum;
    }
    catch {
        console.error('ABOBA ALERT')
    }
    try {
        let client = document.getElementById('client').value;
        document.getElementById('clientD').innerHTML = client;
    }
    catch{
        console.error('ABOBA ALERT')
    }

}


function sendRewiew(id){
    var data = {
        "id" : id,
        "email" : document.getElementById('Email').value,
        "review" : document.getElementById('detail').value,
        "rate" : document.getElementById('Rate').value
    }
    var sock = new XMLHttpRequest();
    sock.open("POST" , window.location.origin + '/review/' + id , true);
    console.log(window.location.origin + '/review/' + id)
    sock.setRequestHeader("Content-Type", "application/json");
    sock.onreadystatechange = function () {
        if (sock.readyState === 4 && sock.status === 200) {
            console.log('OK');
        }
    }
    sock.send(JSON.stringify(data))
}


async function getPoint(value){
    let select = document.getElementById('point')
    select.innerHTML = '';
    let data = {
        "apiKey": "3270f929a4f77936d060671f12818552",
        "modelName": "Address",
        "calledMethod": "getWarehouses",
        "methodProperties": {"CityName" : value,"Language" : "UA"}
     }
    var xhr = new XMLHttpRequest();
    xhr.open("POST", 'https://api.novaposhta.ua/v2.0/json/', true);
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4 && xhr.status === 200) {
            JSON.parse(xhr.responseText)["data"].forEach(function(element){
                var opt = document.createElement('option');
                opt.value = element['Description'];
                opt.innerHTML = element['Description'];
                select.appendChild(opt);
            })
        }
    };
    xhr.send(JSON.stringify(data));
}

changePostService(document.getElementById('PostService'))

function changePostService(element){
    if (element.selectedOptions[0].innerHTML == 'Нова Пошта'){
        document.getElementById("NewPost").style.display = 'block';
        document.getElementById("UkrPost").style.display = 'none';
    } else if (element.selectedOptions[0].innerHTML == 'Укр Пошта'){
        document.getElementById("NewPost").style.display = 'none';
        document.getElementById("UkrPost").style.display = 'block';        
    } else{
        document.getElementById("NewPost").style.display = 'none';
        document.getElementById("UkrPost").style.display = 'none';     
    }
}
