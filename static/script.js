cookie = true;


async function GetPay(id, pic, name) {
    // Clear the payment information.


    // Determine the selected payment method.
    var paymentTypeob = document.getElementById('payMethod');
    if (paymentTypeob) {
        var paymentType = paymentTypeob.selectedOptions[0].innerHTML;
    } else {
        var paymentType = 'null'
    }

    // Build the payment data object.


    if (getCookie('user') !== '' && sessionStorage.getItem('isLogged')) {    // Take action based on the selected payment method.
        if (paymentType === 'Stripe') {
            // Submit the payment form for Portmone.
            var data = {
                id: id,
                email: getCookie('email'),
                count: document.getElementById('count').value.toString()
            }
            var response = await fetch('/api/pay', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            });
            window.location.replace(await response.text())
        } else {
            // Display that the payment has been made.
            var iframe = document.getElementById('video')
            if (iframe) {
                iframe.style.display = 'block';
                iframe.src = 'https://www.youtube.com/embed/YRvOePz2OqQ?autoplay=1';
            } else {
                let data_list = []
                let product_list = JSON.parse(await sessionStorage.getItem("Basket"))['basket'];
                await product_list.forEach(ob => data_list.push(ob));
                let data = {email: getCookie('email'), product: data_list}
                console.log(data)
                var response = await fetch('/api/pay', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(data)
                });
                //document.getElementById('bk_body').innerHTML = '';sessionStorage.setItem('Basket', JSON.stringify({'basket': []}))
                window.location.replace(await response.text())
            }
        }
    } else {
        window.location.replace(window.location.origin + '/accounts/signin')
    }
}


function createTest(img, product, price, id, count) {
    var data = {
        img: img,
        name: product,
        price: price,
        id: id,
        count: count
    }
    sessionStorage.setItem('Basket', JSON.stringify({'basket': [data, data]}))
}

function remove_product_from_busket(el) {
    let changed = JSON.parse(sessionStorage.getItem("Basket"))['basket'].filter(function (ob) {
        console.log(typeof el.getAttribute('for-product'))
        console.log(typeof ob['id'])
        return ob['id'] !== Number(el.getAttribute('for-product'))
    });
    console.log(changed)
    sessionStorage.setItem('Basket', JSON.stringify({'basket': changed}))
    prepareBasket()
}


function prepareBasket() {
    let basket = document.getElementById('bk_body')
    basket.innerHTML = '';
    let product_list = JSON.parse(sessionStorage.getItem("Basket"));
    if (product_list) {
        product_list = product_list['basket'];
        console.log(product_list)
        if (product_list != 0) {
            product_list.forEach((ob) => {
                let child = `
<div style="display: flex; height: fit-content; padding: 10px;max-width: 100%; align-items: center;">
    <img src="${ob['img']}" width="200" height="120" style="width:20vw;height: 15vw;border-radius: 25px;margin: 0.8vh;;">
    <p style="margin: 0.5vh;">${ob['name']}</p>
    <p style="margin: 0.8vh;">${ob['price']} грн</p>
    <input id="count${ob['id']}" for-product="${ob['id']}" onchange="setCount(this)" type="number" style="max-width: 25%; margin: 10px; height:20%;" value="${ob['count']}">
    <button type="button" class="btn-close" aria-label="Close" onclick="remove_product_from_busket(this)" for-product="${ob['id']}"></button>
</div>
            `;
                basket.innerHTML += child;
            })
            document.getElementById('bk_btn').style.display = 'flex'
        } else {
            console.log('a')
            document.getElementById('bk_body').innerHTML = `
        <div class="alert alert-info" id="alert" role="alert">
            Упс тут пусто!
        </div>
        `
            document.getElementById('bk_btn').style.display = 'none'
        }
    } else {
        document.getElementById('bk_body').innerHTML = `
        <div class="alert alert-info" id="alert" role="alert">
            Упс тут пусто!
        </div>`
        document.getElementById('bk_btn').style.display = 'none'

    }
}

async function addProductToBasket(id) {
    let products = JSON.parse(sessionStorage.getItem("Basket"));
    if (products) {
        products = products['basket'];
        let find_index = products.findIndex((ob) =>
            ob['id'] === id
        )

        if (find_index !== -1) {
            products[find_index] = {
                img: products[find_index]['img'],
                name: products[find_index]['name'],
                price: products[find_index]['price'],
                id: products[find_index]['id'],
                count: Number(products[find_index]['count']) + 1
            }

        } else {
            const response = await fetch(`/api/product/${id}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            })
            let json = await response.json();
            let data = {
                img: json['img'],
                name: json['name'],
                price: json['price'],
                id: json['id'],
                count: 1
            }
            await products.push(data)
            console.log(products)
        }
        sessionStorage.setItem('Basket', JSON.stringify({'basket': products}))
    } else {
        const response = await fetch(`/api/product/${id}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        })
        let json = await response.json();
        sessionStorage.setItem('Basket', JSON.stringify({
            'basket': [{
                img: json['img'],
                name: json['name'],
                price: json['price'],
                id: json['id'],
                count: 1
            }]
        }))
    }
    prepareBasket()
}

function setCount(el) {
    let id = Number(el.getAttribute('for-product'))
    let products = JSON.parse(sessionStorage.getItem('Basket'))['basket'];
    let find_index = products.findIndex((ob) => ob['id'] === id)
    console.log(id)
    console.log(find_index)
    products[find_index] = {
        img: products[find_index]['img'],
        name: products[find_index]['name'],
        price: products[find_index]['price'],
        id: products[find_index]['id'],
        count: Number(el.value)
    }
    console.log(products)
    sessionStorage.setItem('Basket', JSON.stringify({'basket': products}))
    prepareBasket()
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

function changeClient() {
    let client = document.getElementById('client').value;
    if (client) {
        document.getElementById('clientD').innerHTML = client;
    }
}

function changePrice() {
    let price = Number(document.getElementById('price').value);
    let count = document.getElementById('count').value;
    if (price && count) {
        let sum = price * count;
        document.getElementById('sumD').innerHTML = sum;
    }
}

function changeCount() {
    let count = document.getElementById('count').value;
    if (count) {
        document.getElementById('countD').innerHTML = count;
    }
    changePrice()
}

function changePoint() {
    let point = document.getElementById('point').selectedOptions[0].innerHTML;
    if (point) {
        document.getElementById('postPointD').innerHTML = point;
    }
}

function changeCity() {
    let city = document.getElementById('City').value;
    if (city) {
        document.getElementById('postCityD').innerHTML = city;
    }
}

function changeService() {
    let service = document.getElementById('PostService').selectedOptions[0].innerHTML;
    if (service) {
        document.getElementById('postServiceD').innerHTML = service;
    }
}

function sendReview(id) {
    const data = {
        id: id,
        email: getCookie('user'),
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
    const response = await fetch(`/api/review/${data.id}`, {
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
    let user = document.getElementById('inputName').value;
    let email = document.getElementById('inputEmail').value;
    let tel = document.getElementById('inputPhone').value;
    let pass1 = document.getElementById('inputPassword').value;
    let pass2 = document.getElementById('confirmPassword').value;
    let alert = document.getElementById('alertjs')
    if (pass1 === pass2 && user !== '' && email !== '' && tel !== '' && pass1 !== '' && pass1.length >= 8) {
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
        const response = await fetch(`/api/accounts`, {
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
                setCookie('user', user, 20);
                alert.style.display = 'block';
                alert.className = 'alert alert-success';
                alert.innerHTML = 'Перевір скриньку! Здається там лист!'
            }
        }
    } else {
        alert.style.display = 'block';
        alert.innerHTML = 'Перевір правильність даних!'
    }

}

function setCookie(cname, cvalue, exdays) {
    if (cookie) {
        const d = new Date();
        d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
        let expires = "expires=" + d.toUTCString();
        document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
    } else {
        return
    }
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

async function signin() {
    const email = document.getElementById('inputEmail').value;
    const password = document.getElementById('inputPassword').value;
    setCookie('email', email, 20);
    await checkUser('login', password);
}

function preparePage() {
    if (sessionStorage.getItem("isLogged") === "true") {
        document.getElementById('login_btn').style.display = 'none';
        document.getElementById('login_user').style.display = 'flex'
        document.getElementById('uname').innerHTML = getCookie('user');
    } else {
        const returned = checkUser('check')
        console.log(returned)
        if (returned === "OK") {
            document.getElementById('login_btn').style.display = 'none';
            document.getElementById('login_user').style.display = 'flex'
            document.getElementById('uname').innerHTML = getCookie('user');
        } else {
            document.getElementById('login_btn').style.display = 'flex';
            document.getElementById('login_user').style.display = 'none'
        }
    }
}

async function checkUser(mode, pass) {
    const email = await getCookie('email');
    const alert = document.getElementById('alertjs')
    let password = '';
    if (mode === 'login') {
        password = pass;
    } else {
        password = await getCookie('password');
    }
    if (email !== '' && password !== '') {
        var data = {
            'type': mode,
            'body': {
                'email': email,
                'password': password
            }
        }
        const response = await fetch(`/api/accounts`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });
        if (!response.ok) {
            if (alert) {
                alert.style.display = 'block';
                alert.innerHTML = 'Сталася помилка на сервері. Спробуйте пізніше.'
            }
        } else {
            let text = await response.json();
            if (text['head'] === 'BAD') {
                console.log('BAD KEY');
                clearCokies();
                sessionStorage.removeItem("isLogged");
                document.cookie = ''
                return "BAD"
            } else {
                let remember = document.getElementById('rememberMe')
                if (remember) {
                    if (document.getElementById('rememberMe').checked) {
                        setCookie('email', text['email'], 20);
                        setCookie('user', text['user'], 20);
                        setCookie('password', text['password'], 20);
                    }
                    sessionStorage.setItem("isLogged", 'true');
                    window.location.replace(window.location.origin)
                    return "OK"
                } else {
                    sessionStorage.setItem("isLogged", 'true');
                    setCookie('email', text['email'], 20);
                    setCookie('user', text['user'], 20);
                    setCookie('password', text['password'], 20);
                    window.location.reload()
                    return "OK"
                }
            }
        }
    } else {
        if (alert) {
            return "BAD"
        }
    }
}

function clearCokies() {
    document.cookie.split(";").forEach(function (c) {
        document.cookie = c.replace(/^ +/, "").replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/");
    });
    sessionStorage.removeItem("isLogged")
}

function changePostService(element) {
    if (element.selectedOptions[0].innerHTML === 'Нова Пошта') {
        document.getElementById("NewPost").style.display = 'block';
        document.getElementById("UkrPost").style.display = 'none';
    } else if (element.selectedOptions[0].innerHTML === 'Укр Пошта') {
        document.getElementById("NewPost").style.display = 'none';
        document.getElementById("UkrPost").style.display = 'block';
    } else {
        document.getElementById("NewPost").style.display = 'none';
        document.getElementById("UkrPost").style.display = 'none';
    }
}

async function prepareUser() {
    let request = {
        email: await getCookie('email')
    }
    console.log(request)
    if (sessionStorage.getItem('isLogged') === 'true') {
        let response = await fetch('/api/accounts/get', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(request)
        })
        let data = await response.json()
        document.getElementById('username').value = data['name'];
        document.getElementById('useremail').value = data['email'];
        document.getElementById('usertel').value = data['tel'];
        let post = data['post']
        if (post['city']) {
            document.getElementById('city').value = post['city'];
            document.getElementById('addr').value = post['addr'];
            document.getElementById('addr2').value = post['addr2'];
            document.getElementById('postcode').value = post['postcode'];
        } else {
            document.getElementById('city').value = '';
            document.getElementById('addr').value = '';
            document.getElementById('addr2').value = '';
            document.getElementById('postcode').value = '';
        }
    }
}

async function saveUser() {
    let user = document.getElementById('username').value;
    let email = document.getElementById('useremail').value;
    let tel = document.getElementById('usertel').value
    if (user != '' && email != '' && tel != '') {
        let data = {
            user: user,
            oldmail: getCookie('email'),
            email: email,
            tel: tel
        }
        let response = await fetch('/api/accounts/update/user/1', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        })
        document.getElementById('user_alert').style.display = 'block';
        document.getElementById('user_alert').className = 'alert alert-warning m-3';
        document.getElementById('user_alert').innerHTML = 'Підтвердіть зміни в email';
    } else {
        document.getElementById('user_alert').style.display = 'block';
        document.getElementById('user_alert').className = 'alert alert-danger m-3';
        document.getElementById('user_alert').innerHTML = 'Перевірте правильність даних!';
    }
    sessionStorage.removeItem('isLogged')
}

async function saveUserPost() {
    let city = document.getElementById('city').value;
    let addr = document.getElementById('addr').value;
    let addr1 = document.getElementById('addr2').value;
    let code = document.getElementById('postcode').value;
    if (city != '' && addr != '' && addr1 != '' && code != '' && code.length == 5 && !isNaN(code)) {
        console.log(Number(code))
        let data = {
            email: getCookie('email'),
            post: {
                city: city,
                addr: addr,
                addr2: addr1,
                postcode: code
            }
        }
        let response = await fetch('/api/accounts/update/post', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        })
        window.location.reload()
    } else {
        if (code.length != 5 || isNaN(code)) {
            document.getElementById('post_alert').style.display = 'block';
            document.getElementById('post_alert').innerHTML = 'Неправильний поштовий індекс!';
        } else {
            document.getElementById('post_alert').style.display = 'block';
            document.getElementById('post_alert').innerHTML = 'Заповніть усі поля!';
        }
    }
}

async function resetPassword() {
    let pass = document.getElementById('pass').value;
    let passc = document.getElementById('passc').value;
    sessionStorage.removeItem('isLogged');
    if (pass === passc && pass.length >= 8) {
        let response = await fetch('/api/accounts/update/password/1', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                email: document.getElementById('inputEmail').value,
                password: pass
            })
        })
        if (await response.text() === 'OK') {
            document.getElementById('success').style.display = 'block';
            document.getElementById('success').innerHTML = 'Лист з підтвердженням відправлено на скриньку';
        } else {
            document.getElementById('err').style.display = 'block';
            document.getElementById('err').innerHTML = 'Ой, щось пішло не так!';
        }
    } else {
        document.getElementById('err').style.display = 'block';
        document.getElementById('err').innerHTML = 'Перевірте правильність написання пароля!';
    }
}

async function userDel() {
    let response = await fetch('/api/accounts/delete/1', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            email: getCookie('email')
        })
    })
    sessionStorage.removeItem('isLogged');
    if (await response.text() === 'OK') {
        document.getElementById('securrity_succes').style.display = 'block';
        document.getElementById('securrity_succes').innerHTML = 'Лист з підтвердженням відправлено на скриньку';
    } else {
        document.getElementById('securrity_alert').style.display = 'block';
        document.getElementById('securrity_alert').innerHTML = 'Ой, щось пішло не так!';
    }
}

async function prepare_order_list() {
    let response = await fetch('/api/accounts/get/orders', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            email: getCookie('email')
        })
    })
    let parent = document.getElementById('orders');
    parent.innerHTML = '';
    let data = await response.json()
    let count = 0
    data.forEach(element => {
        function generate_accordion(products) {
            console.log(products)
            let list = `<div class="accordion-body"><ul class="list-group">`
            products.forEach(element => {
                list += `
                <li class="list-group-item card text-center m-2" >
                <div class="card-body order_product" style="">
                    <img class="card-img" src="${JSON.parse(element.pic_url)[0]}" alt="Card image cap" style="">
                    <div class="mx-5">
                        <p class="card-text">Ціна за одиницю: ${element.price} грн</p>
                        <p class="card-text">Кількість: ${element.quantity}</p>
                        <p class="card-text">Сума: ${Number(element.price) * Number(element.quantity)} грн</p>
                    </div>
                </div>
            </li>
                `
            })
            list += `</ul></div>`
            console.log(list)
            return list
        }

        parent.innerHTML += `<style>

        </style>`
        parent.innerHTML += `
        <div class="accordion my-2" id="accordionPanelsStayOpenExample">
          <div class="accordion-item">
            <h2 class="accordion-header">
              <button class="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#${count}" aria-expanded="false" aria-controls="${count}">
                <div class="d-flex" style="width:100%">
                    <div style="flex: 1 1 33.3%">
                        Статус: ${element.status}
                    </div>
                    <div style="flex: 1 1 33.3%">
                        Сума: ${element.price} грн
                    </div>
                    <div style="flex: 1 1 33.3%">
                        Дата: ${element.date}
                    </div>                                        
                </div>
              </button>
            </h2>
            <div id="${count}" class="accordion-collapse collapse">
                ${generate_accordion(element['products'])}
            </div>
          </div>
        `
        count += 1;

    })
}

async function getFilters() {
    let response = await fetch('/api/product/filters', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: 'ABOBABIBABU'
    });
    let data = await response.json();
    data = data['filters']
    let parent = document.getElementById('filters');
    let parent2 = document.getElementById('filters_off');
    parent.innerHTML = ``;
    data.forEach(el => {
        let category = document.createElement('div');
        category.className = 'accordion-item';
        let header = document.createElement('h2');
        header.className = 'accordion-header'
        header.innerHTML = `
        <button class="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#${el['name']}" aria-expanded="false" aria-controls="${el['name']}"">
            ${el['name']}
        </button>
        `
        let body = document.createElement('div');
        body.id = `${el['name']}`
        body.className = 'accordion-collapse collapse'
        // body.setAttribute('data-bs-parent', '#filters')
        let bodyinner = document.createElement('div');
        bodyinner.className = 'accordion-body d-flex'
        bodyinner.style.flexWrap = 'wrap';
        el['items'].forEach(item => {
            if (item['type'] === 'check') {
                bodyinner.innerHTML += `
                <div class="mb-3" style="width:100%;">
                     <label class="form-check-label" for="${item['name']}">
                        ${item['name']}
                    </label>
                    <input class="form-check-input filter" type="checkbox" value="" id="${item['name']}">
                </div>
                `
            } else if (item['type'] === 'range') {
                bodyinner.innerHTML += `
                <div class="mb-3" style="width:100%;">
                     <label style="width:100%;" class="form-check-label" for="${item['name']}">
                        ${item['name']} (${item['min']} - ${item['max']})
                    </label>
                    <input class="form-range filter" type="range" min="${item['min']}" max="${item['max']}" step="1" value="" id="${item['name']}">
                </div>
                `
            } else {
                console.clear();
            }
        })
        body.appendChild(bodyinner);
        category.appendChild(header);
        category.appendChild(body);
        let category2 = category.cloneNode(true);
        parent.appendChild(category);
        parent2.appendChild(category2);
    })
}

function prepare_filters(parrent_id) {
    let category = document.getElementById(parrent_id).querySelectorAll('.accordion-collapse');
    let filters = {};
    category.forEach(el => {
            let _ = []
            el.querySelectorAll('.filter[type=checkbox]').forEach(checkbox => {
                if (checkbox.checked) {
                    _.push(checkbox.id)
                }
            })
            if (_.length === 0) {
                el.querySelectorAll('.filter[type=checkbox]').forEach(checkbox => {
                    _.push(checkbox.id)
                })
            }

            el.querySelectorAll('.filter[type=range]').forEach(range => {
                _.push(range.id)
            })
            filters[el.id] = _;
        }
    )
    console.log(filters)
    find_by_filters(filters)
}

async function find_by_filters(filters) {
    document.getElementById('search_alert').style.display = 'none';
    document.getElementById('spinner').style.display = 'block';
    let response = await fetch('/api/product/get', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({id: 'all'})
    });
    let products = await response.json();
    console.log(products)
    let filtered = products.filter(el => {
        return Object.keys(filters).every(filterName => {
            return filters[filterName].some(filterValue => {
                return el['filters'][filterName].includes(filterValue);
            });
        });
    })
    let filteredIds = filtered.map(el => el.id);
    get_filtered(filteredIds);
}

async function get_filtered(ids) {
    let params = await new URLSearchParams(window.location.search)
    if (params.has('name')) {
        response = await fetch(`/api/product/get?name=${params.get('name')}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({id: ids})
        });
    } else {
        response = await fetch('/api/product/get', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({id: ids})
        });
    }
    let parent = document.getElementById('items')
    parent.innerHTML = '';
    let items = await response.json()
    console.log(items)
    items.forEach(el => {
        parent.innerHTML += `
            <div class="card" style="margin-bottom: 2vh;">
        <img src="${el['pic_url']}" class="card-img-top" alt="..."
             style="height:50%;border-bottom-left-radius: 10px; border-bottom-right-radius: 10px;">
        <div class="card-body">
            <h5 class="card-title">${el['name']}</h5>
            <p class="card-text">${el['description']}</p>
            <a href="/product/${el['id']}" class="btn btn-primary">Детальніше</a>
        </div>
    </div>
        `
    })
    if (items.length === 0) {
        document.getElementById('search_alert').style.display = 'block';
    }
    document.getElementById('spinner').style.display = 'none'
}

function search() {
    let input = document.getElementById('search_input');
    window.location.replace(`/catalog?name=${input.value}`)
}

function prepare_search() {
    let input = document.getElementById('search_input');
    if (new URLSearchParams(window.location.search).has('name')) {
        input.value = new URLSearchParams(window.location.search).get('name')
    }
}

function collectTelemetry() {
    let currentPage = window.location.pathname;
    const currentTime = new Date().getHours();
    fetch('https://ipapi.co/json')
        .then(response => response.json())
        .then(data => {
            ipAddress = data.ip;
            const geoIPUrl = `https://ipapi.co/${ipAddress}/json`;
            return fetch(geoIPUrl, {
                method: 'GET'
            });
        })
        .then(response => response.json())
        .then(data => {
            const geo = data;
            const isLoggedIn = sessionStorage.getItem('isLogged');
            const areCookiesEnabled = navigator.cookieEnabled;
            let productId = null;
            const productUrlRegex = /\/product\/(\d+)/;
            const match = currentPage.match(productUrlRegex);
            if (match) {
                currentPage = '/product/'
                productId = match[1];
            }
            const telemetryData = {
                page: currentPage,
                hour: currentTime,
                ip: ipAddress,
                country: geo.country,
                region: geo.region,
                city: geo.city,
                isLoggedIn: isLoggedIn,
                areCookiesEnabled: areCookiesEnabled,
                productId: productId,
                id: generateUniqueId()
            };
            fetch('/api/telemetry/', {
                method: 'POST',
                body: JSON.stringify(telemetryData),
                headers: {
                    'Content-Type': 'application/json'
                }
            });
        })
        .catch(error => {
            console.error('Error collecting telemetry:', error);
        });
}

function generateUniqueId() {
    const timestamp = new Date().getTime().toString(16); // отримати часову мітку та перетворити на шістнадцяткову систему числення
    const random = Math.floor(Math.random() * 16).toString(16); // отримати випадкове число від 0 до 15 та перетворити на шістнадцяткову систему числення
    return timestamp + random;
}

function prepereCookieQ() {
    if (getCookie('cookie') !== "true") {
        let offcanvas = new bootstrap.Offcanvas(document.getElementById('cookieEnable'))
        offcanvas.show();
    } else {
        setCookie('cookie', true, 20);
    }
}
