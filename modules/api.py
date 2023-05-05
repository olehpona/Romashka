from app import app, db, tmp_users, processed_pay, email
from flask import request, redirect, flash, jsonify
from modules.models import Chamomile, Users, Review, Orders
from werkzeug.security import check_password_hash, generate_password_hash
import stripe
import json
import string
import random
import datetime

stripe.api_key = "sk_test_51MuFGRFp0R5k4xMcElesPxnVhq4xOq9bZdDHwbamEOnIdXxeSebTEOJAz2Exwjok79QyWH3ADqVmFUlW8F8cA2P700cnuYTH0r"

change_confirm = {}
pass_reset = {}
user_del = {}


def specific_string(length):
    letters = string.ascii_lowercase
    result = ''.join((random.choice(letters)) for x in range(length))
    return result


@app.route('/api/product/<id>', methods=['GET'])
def get_product(id):
    with app.app_context():
        data = Chamomile.query.get(int(id))
        sended = {
            'img': data.pic_url,
            'price': data.price,
            'name': data.name,
            'id': data.id
        }
        return sended


@app.route("/api/review/<id>", methods=['POST'])  # Вказуємо url-адресу для виклику функції
def review(id):
    with app.app_context():
        data = request.get_json()
        rev = Review(product_id=int(data['id']), rate=int(data['rate']), detail=data['review'], email=data['email'])
        db.session.add(rev)
        db.session.commit()
        return 'OK'


@app.route('/api/pay', methods=['POST'])
def create_pay_session():
    geted = request.get_json()
    print(geted)
    data = geted['product']
    items = [{'price': Chamomile.query.filter_by(id=i['id']).first().stripe_price, 'quantity': i['count']} for i in
             data]
    print(Users.query.filter_by(email=geted['email']).first().post)
    if Users.query.filter_by(email=geted['email']).first().post != '':
        checkout_session = stripe.checkout.Session.create(
            line_items=items,
            mode='payment',
            custom_text={
                "submit": {"message": "Ми повідомимо тебе в будь який обставинах :)"},
            },
            success_url="https://127.0.0.1:5000/api/pay/success?session_id={CHECKOUT_SESSION_ID}",
            cancel_url=f'https://127.0.0.1:5000/'
        )
    else:
        checkout_session = stripe.checkout.Session.create(
            line_items=items,
            mode='payment',
            custom_text={
                "submit": {"message": "Ми повідомимо тебе в будь який обставинах :)"},
            },
            shipping_address_collection={'allowed_countries': ['UA']},
            success_url="https://127.0.0.1:5000/api/pay/success?session_id={CHECKOUT_SESSION_ID}",
            cancel_url=f'https://127.0.0.1:5000/'
        )
    print(checkout_session.url)
    return checkout_session.url


@app.route('/api/pay/success', methods=['GET'])
def pay_success():
    print(request.args.to_dict())
    session = stripe.checkout.Session.retrieve(request.args.get('session_id'))
    print(session)
    processed_pay[session['id']] = session
    list_product = stripe.checkout.Session.list_line_items(request.args.get('session_id'))
    products = []
    for i in list_product:
        _ = Chamomile.query.filter_by(stripe_price=i['price']['id']).first()
        data = {
            'price': _.price,
            'name': _.name,
            'quantity': i['quantity'],
            'pic_url': _.pic_url
        }
        products.append(data)
    with app.app_context():
        try:
            sum = 0
            for i in products:
                sum += int(i['price']) * int(i['quantity'])
            order = Orders(price=sum, products=json.dumps(products), status='Обробляється',
                           date=datetime.datetime.now().strftime("%m/%d/%Y, %H:%M:%S"),
                           user_id=Users.query.filter_by(email=session['customer_details']["email"]).first().id)
            db.session.add(order)
            db.session.commit()
            email.send_buy_mail(session['customer_details']["email"], products)
            flash('Транс-акція пройшла успішно. Після обробки на пошту вам прийде лист з деталями щодо замовлення.',
                  'alert-success')
            return redirect('/')
        except:
            flash('Ой, щось пішло не так',
                  'alert-danger')
            return redirect('/')


@app.route('/api/accounts', methods=['POST', 'GET'])
def accounts():
    if request.method == 'GET':
        return 'NOT ALLOWED'
    else:
        geted = request.get_json()
        data = geted['body']
        if geted['type'] == 'create':
            if Users.query.filter_by(email=data['email']).first():
                flash('Такий аккаунт уже існує!', 'alert-danger')
                return 'BAD'
            else:
                tmp_users[data['email']] = data
                email.send_confirm_mail(data['email'])
                print(tmp_users)
                return 'OK'
        elif geted['type'] == 'login':
            print(geted)
            with app.app_context():
                if Users.query.filter_by(email=data['email']).first():
                    if check_password_hash(Users.query.filter_by(email=data['email']).first().password,
                                           data['password']):
                        return {'password': Users.query.filter_by(email=data['email']).first().password,
                                'user': Users.query.filter_by(email=data['email']).first().login,
                                'email': Users.query.filter_by(email=data['email']).first().email}
                    else:
                        return {'head': 'BAD'}
                else:
                    return {'head': 'BAD'}
        else:
            print(geted)
            with app.app_context():
                if Users.query.filter_by(email=data['email']).first():
                    if Users.query.filter_by(email=data['email']).first().password == data['password']:
                        return {'password': Users.query.filter_by(email=data['email']).first().password,
                                'user': Users.query.filter_by(email=data['email']).first().login,
                                'email': Users.query.filter_by(email=data['email']).first().email}
                    else:
                        return {'head': 'BAD'}
                else:
                    return {'head': 'BAD'}


@app.route('/api/accounts/get', methods=['POST'])
def get_user():
    get = request.get_json()
    user = Users.query.filter_by(email=get['email']).first()
    try:
        data = {
            'name': user.login,
            'email': user.email,
            'tel': user.tel,
            'post': json.loads(user.post)
        }
    except:
        data = {
            'name': user.login,
            'email': user.email,
            'tel': user.tel,
            'post': {}
        }
    return data


@app.route('/api/accounts/update/user/<id>', methods=['POST', 'GET'])
def update_user(id):
    if request.method == 'POST':
        data = request.get_json()
        user = Users.query.filter_by(email=data['oldmail']).first()
        if user.email != data['email']:
            secret = specific_string(512)
            email.send_seting_change_email(data['oldmail'], ['email', ''], secret)
            change_confirm[secret] = data
        elif user.tel != data['tel']:
            secret = specific_string(512)
            email.send_seting_change_email(data['oldmail'], ['', 'tel'], secret)
            change_confirm[secret] = data
        elif user.email != data['email'] and user.tel != data['tel']:
            secret = specific_string(512)
            email.send_seting_change_email(data['oldmail'], ['email', 'tel'], secret)
            change_confirm[secret] = data
        else:
            user.login = data['user']
        return 'ok'
    elif request.method == 'GET':
        with app.app_context():
            try:
                data = change_confirm[id]
            except:
                return '''<h1>Це посилання вже використано!</h1>
                <a href="/">Головна</a>'''
            print(data)
            user = Users.query.filter_by(email=data['oldmail']).first()
            user.email = data['email']
            user.tel = data['tel']
            user.login = data['user']
            db.session.commit()
            flash('Через зміну інформації про користувача був виконаний автоматичний вихід.', 'alert-warning')
            return redirect('/')


@app.route('/api/accounts/update/post', methods=['POST'])
def update_user_post():
    with app.app_context():
        data = request.get_json()
        user = Users.query.filter_by(email=data['email']).first()
        user.post = json.dumps(data['post'])
        db.session.commit()
        return 'OK'


@app.route('/api/accounts/update/password/<secret>', methods=['POST', 'GET'])
def update_password(secret):
    if request.method == 'POST':
        data = request.get_json()
        print(data)
        if Users.query.filter_by(email=data['email']).first():
            secrets = specific_string(512)
            pass_reset[secrets] = data
            email.send_password_change_email(data['email'], secrets)
            return 'OK'
        else:
            return 'BAD'
    else:
        data = pass_reset[secret]
        with app.app_context():
            user = Users.query.filter_by(email=data['email']).first()
            user.password = generate_password_hash(data['password'])
            pass_reset.pop(secret)
            db.session.commit()
        flash('Через зміну пароля був виконаний аботоматичний вихід.', 'alert-warning')
        return redirect('/')


@app.route('/api/accounts/delete/<secret>', methods=['POST', 'GET'])
def delete_user(secret):
    if request.method == 'POST':
        data = request.get_json()
        print(data)
        if Users.query.filter_by(email=data['email']).first():
            secrets = specific_string(512)
            user_del[secrets] = data
            email.send_user_del_email(data['email'], secrets)
            return 'OK'
        else:
            return 'BAD'
    else:
        data = user_del[secret]
        with app.app_context():
            user = Users.query.filter_by(email=data['email']).first()
            db.session.delete(user)
            user_del.pop(secret)
            db.session.commit()
        flash('Через видалення аккаунту був виконаний аботоматичний вихід.', 'alert-warning')
        return redirect('/')


@app.route('/api/accounts/get/orders', methods=['POST'])
def get_orders():
    data = request.get_json()
    user = Users.query.filter_by(email=data['email']).first()
    print(user.orders)
    try:
        orders = []
        for i in user.orders:
            orders.append({
                'price': i.price,
                'date': i.date,
                'status': i.status,
                'id': i.id,
                'products': json.loads(i.products)
            })
        return orders
    except:
        return '[]'


@app.route('/api/product/get', methods=['POST'])
def get_products():
    data = request.get_json()
    query = []
    _ = []
    if data['id'] == 'all':
        for i in Chamomile.query.all():
            query.append({
                'name': i.name,
                'description': i.description,
                'price': i.price,
                'id': i.id,
                'pic_url': i.pic_url,
                'filters': i.filters,
            })
        return query
    else:
        for i in data['id']:
            _.append(Chamomile.query.get(i))
        for i in _:
            query.append({
                'name': i.name,
                'description': i.description,
                'price': i.price,
                'id': i.id,
                'pic_url': i.pic_url,
                'filters': i.filters,
            })
        return query


@app.route('/api/product/filters', methods=['POST'])
def filters():
    return {"filters": [{"name": "bebra", "items": [{"name": '1', "type": "check"}, {"name": '2', "type": "range" , "min": 0 , "max" : 100}]}]}
