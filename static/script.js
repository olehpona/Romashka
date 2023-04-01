


function GetPay(price, pic, name) {
    // Clear the payment information.
    const paymentElement = document.getElementById('Pay');
    paymentElement.innerHTML = '';

    // Determine the selected payment method.
    const paymentType = document.getElementById('payMethod').selectedOptions[0].innerHTML;

    // Build the payment data object.
    const paymentData = {
        paymentTypes: {
            gpay: 'Y',
            card: 'Y',
            portmone: 'Y',
            token: 'N',
            clicktopay: 'Y',
            createtokenonly: 'N',
        },
        priorityPaymentTypes: {
            gpay: '3',
            card: '3',
            portmone: '1',
            token: '0',
            clicktopay: '0',
            createtokenonly: '0',
        },
        payee: {
            payeeId: '3048',
            login: '',
            dt: '',
            signature: '',
            shopSiteId: '',
        },
        order: {
            description: `Ромашка ${name}`,
            shopOrderNumber: 'SHP-00445401',
            billAmount: (Number(price) * Number(document.getElementById('count').value)).toString(),
            attribute1: '1',
            attribute2: '2',
            attribute3: '3',
            attribute4: '4',
            attribute5: '',
            successUrl: '',
            failureUrl: '',
            preauthFlag: 'N',
            billCurrency: 'UAH',
            encoding: '',
        },
        token: {
            tokenFlag: 'N',
            returnToken: 'N',
            token: '',
            cardMask: '',
            otherPaymentMethods: 'Y',
            sellerToken: '',
        },
        payer: {
            lang: 'uk',
            emailAddress: 'test@ukr.net',
        },
        style: {
            type: 'light',
            logo: '',
            backgroundColorHeader: '',
            backgroundColorButtons: '',
            colorTextAndIcons: '',
            borderColorList: '',
            bcMain: '',
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
    "methodProperties": {"CityName" : value,"Language" : "UA"}
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
      const warehouses = json.data.map(({ Description }) => Description);

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
changePostService(document.getElementById('PostService'))

function encryptdata(data){
  let key =`-----BEGIN PUBLIC KEY-----
  MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEA+MrbR5eH/533ciY0IaqY
  ZfKuOHCsYqq2FifdrpzY4NaqTEdRPB5kwAIYI+0nLnXrSyc66Na9k9QwRzl6ggQ5
  5nWTqWHmZ95xrfPnJAo5xi/qrGLeT0B2OaGWP3cl3Z0clmLo78k36X3R70rzzwBT
  S7L2FSUTPyK3NhA5cXgrGsMP6+BKMqbqnderWM0dZyP0uKqTkj1nZ6XDlo4O9aGO
  E8R7Paaew+6T/UhP86QTRFshe1OSmHIUQzhixMRI0OZV2mBLdGlx4R0wQVErS7Vq
  iXU7bCi6/pazfPmK1MA/N/f/svfuenszCTG7LuF03tmJIPx5jRaNHa1iEoC9EG0l
  ewIDAQAB
  -----END PUBLIC KEY-----`;
  
  var encrypt = new JSEncrypt();
  encrypt.setPublicKey(key);
  var ciphertext = encrypt.encrypt(data);
  console.log(ciphertext)
}