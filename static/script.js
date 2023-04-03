function GetPay(price, pic, name) {
    // Clear the payment information.
    const paymentElement = document.getElementById('Pay');
    paymentElement.innerHTML = '';

    // Determine the selected payment method.
    const paymentType = document.getElementById('payMethod').selectedOptions[0].innerHTML;

    // Build the payment data object.
    const paymentData = {
        'paymentTypes': {
            'gpay': 'Y',
            'card': 'Y',
            'portmone': 'Y',
            'token': 'N',
            'clicktopay': 'Y',
            'createtokenonly': 'N',
        },
        'priorityPaymentTypes': {
            'gpay': '3',
            'card': '3',
            'portmone': '1',
            'token': '0',
            'clicktopay': '0',
            'createtokenonly': '0',
        },
        'payee': {
            'payeeId': '3048',
            'login': '',
            'dt': '',
            'signature': '',
            'shopSiteId': '',
        },
        'order': {
            'description': `Ромашка ${name}`,
            'shopOrderNumber': 'SHP-00445401',
            'billAmount': (Number(price) * Number(document.getElementById('count').value)).toString(),
            'attribute1': '1',
            'attribute2': '2',
            'attribute3': '3',
            'attribute4': '4',
            'attribute5': '',
            'successUrl': '',
            'failureUrl': '',
            'preauthFlag': 'N',
            'billCurrency': 'UAH',
            'encoding': '',
        },
        'token': {
            'tokenFlag': 'N',
            'returnToken': 'N',
            'token': '',
            'cardMask': '',
            'otherPaymentMethods': 'Y',
            'sellerToken': '',
        },
        'payer': {
            'lang': 'uk',
            'emailAddress': 'test@ukr.net',
        },
        'style': {
            'type': 'light',
            'logo': '',
            'backgroundColorHeader': '',
            'backgroundColorButtons': '',
            'colorTextAndIcons': '',
            'borderColorList': '',
            'bcMain': '',
        },
    };

    // Take action based on the selected payment method.
    if (paymentType === 'Portmone') {
        // Submit the payment form for Portmone.
        document.getElementById('paydata').value = JSON.stringify(paymentData);
        document.getElementById('payform').submit();
    } else if (paymentType === 'Mono') {
        // Display the Mono payment image.
        paymentElement.src = pic;
    } else {
        // Display that the payment has been made.
        paymentElement.src = 'https://www.youtube.com/embed/YRvOePz2OqQ?autoplay=1';
    }
}


async function getPostOffices(cityName) {
    try {
        const response = await fetch(`https://api.ukrposhta.ua/address-classifier-ws/1.0/address/search-settlement?search=${cityName}&postcode=&admin_name=&language=en`, {
            headers: {
                'Accept': 'application/json'
            }
        });

        const data = await response.json();

        if (data && data.length > 0) {
            const settlement = data[0];
            const postOfficeResponse = await fetch(`https://api.ukrposhta.ua/address-classifier-ws/1.0/address/search-postoffice?settlementId=${settlement.id}&postcode=&language=en`, {
                headers: {
                    'Accept': 'application/json'
                }
            });

            const postOffices = await postOfficeResponse.json();

            if (postOffices && postOffices.length > 0) {
                return postOffices.map(po => `${po.index} - ${po.name}`);
            } else {
                return 'Відділення пошти не знайдені';
            }
        } else {
            return 'Місто не знайдено';
        }
    } catch (error) {
        console.error(error);
        return 'Сталася помилка при виконанні запиту';
    }
}

function changeAllInAll() {
    let service = document.getElementById('PostService').selectedOptions[0].innerHTML;
    if (service) {
        document.getElementById('postServiceD').innerHTML = service;
    }

    let city = document.getElementById('City').value;
    if (city) {
        document.getElementById('postCityD').innerHTML = city;
    }

    let point = document.getElementById('point').selectedOptions[0].innerHTML;
    if (point) {
        document.getElementById('postPoinD').innerHTML = point;
    }

    let count = document.getElementById('count').value;
    if (count) {
        document.getElementById('countD').innerHTML = count;
    }

    let price = Number(document.getElementById('price').value);
    if (price) {
        let sum = price * count;
        document.getElementById('sumD').innerHTML = sum;
    }

    let client = document.getElementById('client').value;
    if (client) {
        document.getElementById('clientD').innerHTML = client;
    }
}


function sendReview(id) {
    const data = {
        id: id,
        email: document.getElementById('Email').value,
        review: document.getElementById('detail').value,
        rate: document.getElementById('Rate').value
    };

    postReview(data)
        .then(() => {
            console.log('OK');
        })
        .catch(error => {
            console.error(error);
            alert('Під час відправки відгуку сталася помилка!');
        });
}

async function postReview(data) {
    const response = await fetch(`/review/${data.id}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    });

    if (!response.ok) {
        throw new Error('Сталася помилка під час відправки запиту на сервер!');
    }
}


async function getPoint(value) {
    const select = document.getElementById('point');
    select.innerHTML = '';

    const data = {
        "apiKey": "3270f929a4f77936d060671f12818552",
        "modelName": "Address",
        "calledMethod": "getWarehouses",
        "methodProperties": {"CityName": value, "Language": "UA"}
    };

    try {
        const response = await fetch('https://api.novaposhta.ua/v2.0/json/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });

        const json = await response.json();

        if (json.success) {
            const warehouses = json.data.map(({Description}) => Description);

            warehouses.forEach((description) => {
                const option = document.createElement('option');
                option.value = description;
                option.innerHTML = description;
                select.appendChild(option);
            });
        } else {
            throw new Error(json.errors[0].errorMessage);
        }
    } catch (error) {
        console.error(error.message);
    }
}

async function signup() {
    user = document.getElementById('inputName').value;
    email = document.getElementById('inputEmail').value;
    tel = document.getElementById('inputPhone').value;
    pass1 = document.getElementById('inputPassword').value;
    pass2 = document.getElementById('confirmPassword').value;
    alert = document.getElementById('alertjs')
    if (pass1 == pass2 && user != '' && email != '' && tel != '' && pass1 != '') {
        alert.style.display = 'none';
        var data = {
            'type': 'create',
            'body': {
                'user': user,
                'email': email,
                'tel': tel,
                'password': pass1
            }
        }
        const response = await fetch(`/accounts`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });
        if (!response.ok) {
            alert.style.display = 'block';
            alert.innerHTML = 'Сталася помилка на сервері. Спробуйте пізніше.'
        } else {
            let text = await response.text();
            console.log(text)
            if (text == 'BAD') {
                window.location.reload();
            } else {
                setCookie('email', email, 20);
                setCookie('password', text, 20);
                window.location.reload('/');
            }
        }
    } else {
        alert.style.display = 'block';
        alert.innerHTML = 'Перевір правильність даних!'
    }

}

function setCookie(cname, cvalue, exdays) {
    const d = new Date();
    d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
    let expires = "expires=" + d.toUTCString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}

function getCookie(cname) {
    let name = cname + "=";
    let decodedCookie = decodeURIComponent(document.cookie);
    let ca = decodedCookie.split(';');
    for (let i = 0; i < ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}

async function chackUser() {
    const email = await getCookie('email');
    const password = await getCookie('password');
    if (email != '' && password != '') {
        var data = {
            'type': 'create',
            'body': {
                'email': email,
                'password': password
            }
        }
        const response = await fetch(`/accounts`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });
        if (!response.ok) {
            alert.style.display = 'block';
            alert.innerHTML = 'Сталася помилка на сервері. Спробуйте пізніше.'
        } else {
            let text = await response.text();
            console.log(text)
            if (text == 'BAD') {
                window.sessionStorage.setItem()
            } else {
                setCookie('email', email, 20);
                setCookie('password', text, 20);
                window.location.reload('/');
            }
        }
    } else {
        alert.style.display = 'block';
        alert.innerHTML = 'Перевір правильність даних!'
    }
}

function changePostService(element) {
    if (element.selectedOptions[0].innerHTML == 'Нова Пошта') {
        document.getElementById("NewPost").style.display = 'block';
        document.getElementById("UkrPost").style.display = 'none';
    } else if (element.selectedOptions[0].innerHTML == 'Укр Пошта') {
        document.getElementById("NewPost").style.display = 'none';
        document.getElementById("UkrPost").style.display = 'block';
    } else {
        document.getElementById("NewPost").style.display = 'none';
        document.getElementById("UkrPost").style.display = 'none';
    }
}

changePostService(document.getElementById('PostService'))

