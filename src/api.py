from main import app, db, tmp_users, processed_pay, email
from flask import request, redirect, flash
from src.models import Chamomile, Users, Review
from werkzeug.security import check_password_hash
import stripe

stripe.api_key = "sk_test_51MuFGRFp0R5k4xMcElesPxnVhq4xOq9bZdDHwbamEOnIdXxeSebTEOJAz2Exwjok79QyWH3ADqVmFUlW8F8cA2P700cnuYTH0r"


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
    data = request.get_json()
    print(data)
    items = [{'price': Chamomile.query.filter_by(id=i['id']).first().stripe_price, 'quantity': i['count']} for i in
             data]
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
    email.send_buy_mail(session['customer_details']["email"], products)
    flash('Транс-акція пройшла успішно. Після обробки на пошту вам прийде лист з деталями щодо замовлення.',
          'alert-success')
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
                                'user': Users.query.filter_by(email=data['email']).first().login}
                    else:
                        return 'BAD'
                else:
                    return 'BAD'
        else:
            print(geted)
            with app.app_context():
                if Users.query.filter_by(email=data['email']).first():
                    if Users.query.filter_by(email=data['email']).first().password == data['password']:
                        return {'password': Users.query.filter_by(email=data['email']).first().password,
                                'user': Users.query.filter_by(email=data['email']).first().login}
                    else:
                        return 'BAD'
                else:
                    return 'BAD'
