async function getData() {
    let req = await fetch('/admin/data', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        },
    })
    let data = await req.json()
    return data
}


async function chartPage() {
    let data = await getData()
    let pie_data = []
    await Object.keys(data['page']).forEach(el => {
        pie_data.push(data['page'][el])
    })
    const setup = {
        labels: Object.keys(data['page']),
        datasets: [{
            label: 'Сторінки',
            data: pie_data,
            fill: true,
            backgroundColor: 'rgba(255, 99, 132, 0.2)',
            borderColor: 'rgb(255, 99, 132)',
            pointBackgroundColor: 'rgb(255, 99, 132)',
            pointBorderColor: '#fff',
            pointHoverBackgroundColor: '#fff',
            pointHoverBorderColor: 'rgb(255, 99, 132)'
        }]
    };
    const chart = await new Chart(document.getElementById('page_canvas'), {
        type: 'radar',
        data: setup,
        options: {
            elements: {
                line: {
                    borderWidth: 3
                }
            }
        },
    });
    //chart.resize(window.innerWidth, window.innerHeight)
}

async function chartHour() {
    let data = await getData()
    let pie_data = []
    await Object.keys(data['hours']).forEach(el => {
        pie_data.push(data['hours'][el])
    })
    const setup = {
        labels: Object.keys(data['hours']),
        datasets: [{
            label: 'Години',
            data: pie_data,
            fill: true,
            backgroundColor: 'rgba(255, 99, 132, 0.2)',
            borderColor: 'rgb(255, 99, 132)',
            pointBackgroundColor: 'rgb(255, 99, 132)',
            pointBorderColor: '#fff',
            pointHoverBackgroundColor: '#fff',
            pointHoverBorderColor: 'rgb(255, 99, 132)'
        }]
    };
    const chart = new Chart(document.getElementById('hours_canvas'), {
        type: 'radar',
        data: setup,
        options: {
            elements: {
                line: {
                    borderWidth: 3
                }
            }
        }
    });
    //chart.resize(window.innerWidth, window.innerHeight)
}

async function chartCountry() {
    let data = await getData()
    let pie_data = []
    await Object.keys(data['country']).forEach(el => {
        pie_data.push(data['country'][el])
    })
    const setup = {
        labels: Object.keys(data['country']),
        datasets: [{
            label: 'Країна',
            data: pie_data,
            fill: true,
            backgroundColor: 'rgba(255, 99, 132, 0.2)',
            borderColor: 'rgb(255, 99, 132)',
            pointBackgroundColor: 'rgb(255, 99, 132)',
            pointBorderColor: '#fff',
            pointHoverBackgroundColor: '#fff',
            pointHoverBorderColor: 'rgb(255, 99, 132)'
        }]
    };
    const chart = new Chart(document.getElementById('country_canvas'), {
        type: 'pie',
        data: setup,
        options: {
            elements: {
                line: {
                    borderWidth: 3
                }
            }
        }
    });
    //chart.resize(window.innerWidth, window.innerHeight)
}

async function chartRegion() {
    let data = await getData()
    console.log(data)
    let pie_data = []
    await Object.keys(data['region']).forEach(el => {
        pie_data.push(data['region'][el])
    })
    const setup = {
        labels: Object.keys(data['region']),
        datasets: [{
            label: 'Регіон',
            data: pie_data,
            fill: true,
            backgroundColor: 'rgba(255, 99, 132, 0.2)',
            borderColor: 'rgb(255, 99, 132)',
            pointBackgroundColor: 'rgb(255, 99, 132)',
            pointBorderColor: '#fff',
            pointHoverBackgroundColor: '#fff',
            pointHoverBorderColor: 'rgb(255, 99, 132)'
        }]
    };
    const chart = new Chart(document.getElementById('region_canvas'), {
        type: 'pie',
        data: setup,
        options: {
            elements: {
                line: {
                    borderWidth: 3
                }
            }
        }
    });
    //chart.resize(window.innerWidth, window.innerHeight)
}

async function chartLogged() {
    let data = await getData()
    let pie_data = []
    await Object.keys(data['logged']).forEach(el => {
        pie_data.push(data['logged'][el])
    })
    const setup = {
        labels: Object.keys(data['logged']),
        datasets: [{
            label: 'Вхід',
            data: pie_data,
            fill: true,
            backgroundColor: 'rgba(255, 99, 132, 0.2)',
            borderColor: 'rgb(255, 99, 132)',
            pointBackgroundColor: 'rgb(255, 99, 132)',
            pointBorderColor: '#fff',
            pointHoverBackgroundColor: '#fff',
            pointHoverBorderColor: 'rgb(255, 99, 132)'
        }]
    };
    const chart = new Chart(document.getElementById('loged_canvas'), {
        type: 'doughnut',
        data: setup,
        options: {
            elements: {
                line: {
                    borderWidth: 3
                }
            }
        }
    });
    //chart.resize(window.innerWidth, window.innerHeight)
}

async function chartCookie() {
    let data = await getData()
    let pie_data = []
    await Object.keys(data['cookie']).forEach(el => {
        pie_data.push(data['cookie'][el])
    })
    const setup = {
        labels: Object.keys(data['cookie']),
        datasets: [{
            label: 'Анонімно',
            data: pie_data,
            fill: true,
            backgroundColor: 'rgba(255, 99, 132, 0.2)',
            borderColor: 'rgb(255, 99, 132)',
            pointBackgroundColor: 'rgb(255, 99, 132)',
            pointBorderColor: '#fff',
            pointHoverBackgroundColor: '#fff',
            pointHoverBorderColor: 'rgb(255, 99, 132)'
        }]
    };
    const chart = new Chart(document.getElementById('incognito_canvas'), {
        type: 'doughnut',
        data: setup,
        options: {
            elements: {
                line: {
                    borderWidth: 3
                }
            }
        }
    });
    //chart.resize(window.innerWidth, window.innerHeight)
}

async function chartCookie() {
    let data = await getData()
    let pie_data = []
    await Object.keys(data['product']).forEach(el => {
        pie_data.push(data['product'][el])
    })
    const setup = {
        labels: Object.keys(data['product']),
        datasets: [{
            label: 'Продукти',
            data: pie_data,
            fill: true,
            backgroundColor: 'rgba(255, 99, 132, 0.2)',
            borderColor: 'rgb(255, 99, 132)',
            pointBackgroundColor: 'rgb(255, 99, 132)',
            pointBorderColor: '#fff',
            pointHoverBackgroundColor: '#fff',
            pointHoverBorderColor: 'rgb(255, 99, 132)'
        }]
    };
    const chart = new Chart(document.getElementById('product_canvas'), {
        type: 'radar',
        data: setup,
        options: {
            elements: {
                line: {
                    borderWidth: 3
                }
            }
        }
    });
}

async function get_products(type) {
    let response = await fetch('/admin/get_product_by', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            request_type: type,
            id: await document.getElementById('productId').value,
            name: await document.getElementById('productName').value,
            price: await document.getElementById('productPrice').value
        })
    })
    let ids = await response.json()
    ids = ids['id']
    console.log(ids)
    get_by_id(ids, 'products_list', 'Редагувати', '' , 'products')
}

function createAdmin(text) {
    var qrcode = new QRious({
        element: document.getElementById("qr-code"),
        background: '#ffffff',
        backgroundAlpha: 1,
        foreground: '#e8ad23',
        foregroundAlpha: 1,
        level: 'H',
        padding: 0,
        size: 256,
        value: text
    });
}

async function validateOtp(text, callback, bad_callback) {
    let request = await fetch('/admin/otp/validate', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            'code': text
        })
    })
    let data = await request.text()
    if (data === 'OK') {
        callback();
    } else {
        bad_callback()
    }
}

async function get_by_id(ids, container_id, btn_name, btn_onclik , type) {
    let url = ''
    if (type==='products'){
        url = '/api/product/get'
    } else if(type==='users'){
        url = '/admin/users/get'
    } else if(type==='orders'){
        url = '/admin/orders/get'
    }
    response = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({id: ids})
    });
    let parent = document.getElementById(container_id)
    parent.innerHTML = '';
    let items = await response.json()
    console.log(items)
    items.forEach(el => {
        parent.innerHTML += `
            <div class="card" style="margin-bottom: 2vh; width: 90%;">
        <div class="card-body d-flex">
            <h5 class="card-title m-2">${el['name']}</h5>
            <p class="card-text m-2">Id : ${el['id']}</p>
            <a href="/product/${el['id']}" class="btn btn-primary" onclick="${btn_onclik}" style="flex:fit-content;">${btn_name}</a>
        </div>
    </div>
        `
    })
    if (items.length === 0) {
        document.getElementById('search_alert').style.display = 'block';
    }
    //document.getElementById('spinner').style.display = 'none'
}

async function get_users(type) {
    let response = await fetch('/admin/get_user_by', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            request_type: type,
            name: await document.getElementById('userName').value,
            email: await document.getElementById('userEmail').value
        })
    })
    let ids = await response.json()
    ids = ids['id']
    console.log(ids)
    get_by_id(ids, 'user_list' , 'Замовлення', '' , 'users')
}