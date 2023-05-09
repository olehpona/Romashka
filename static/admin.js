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