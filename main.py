from flask import Flask, render_template, request, redirect, url_for, flash
from flask_sqlalchemy import SQLAlchemy
import ssl
from werkzeug.security import generate_password_hash, check_password_hash
from Cryptodome.Random import get_random_bytes
import email_management
import stripe

stripe.api_key = "sk_test_51MuFGRFp0R5k4xMcElesPxnVhq4xOq9bZdDHwbamEOnIdXxeSebTEOJAz2Exwjok79QyWH3ADqVmFUlW8F8cA2P700cnuYTH0r"

context = ssl.SSLContext(ssl.PROTOCOL_TLS)
context.load_cert_chain('security/cert.pem', keyfile='security/key.pem', password='aboba')

tmp_users = {}

db = SQLAlchemy()

app = Flask(__name__,)  # Створюємо веб–додаток Flask
app.config['CORS_HEADERS'] = 'Content-Type'
app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///chamomile.db"
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False
app.config["SECRET_KEY"] = get_random_bytes(4096)
db.init_app(app)


#models
class Chamomile(db.Model):
    id = db.Column(db.Integer, primary_key=True, nullable=False)
    name = db.Column(db.String, nullable=False)
    price = db.Column(db.Integer, nullable=False)
    description = db.Column(db.Text)
    type = db.Column(db.String, nullable=False)
    pic_url = db.Column(db.String)
    stripe_price = db.Column(db.String , nullable=False)




class Review(db.Model):
    id = db.Column(db.Integer, primary_key=True, nullable=False)
    product_id = db.Column(db.Integer, nullable=False)
    email = db.Column(db.String, nullable=False)
    detail = db.Column(db.Text, nullable=True)
    rate = db.Column(db.Integer, nullable=False)


class Users(db.Model):
    id = db.Column(db.Integer, primary_key=True, nullable=False)
    login = db.Column(db.String, nullable=False)
    password = db.Column(db.String, nullable=False)
    tel = db.Column(db.String, nullable=False)
    email = db.Column(db.String, nullable=False)

#routes
@app.route("/")  # Вказуємо url-адресу для виклику функції
def index():
    with app.app_context():
        return render_template('index.html', cards=Chamomile.query.all())  # Результат, що повертається у браузер


@app.route("/product/<id>")  # Вказуємо url-адресу для виклику функції
def product(id):
    with app.app_context():
        review = Review.query.filter_by(product_id=int(id)).all()
        return render_template('info.html', product=Chamomile.query.get(int(id)),
                               rewiews=review)  # Результат, що повертається у браузер


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
    checkout_session = stripe.checkout.Session.create(
        line_items=[
            {
                # Provide the exact Price ID (for example, pr_1234) of the product you want to sell
                'price': Chamomile.query.filter_by(id=data['id']).first().stripe_price,
                'quantity': data['count'],
            },
        ],
        mode='payment',
        custom_text={
            "submit": {"message": "Ми повідомимо тебе в будь який обставинах :)"},
        },
        success_url='https://127.0.0.1:5000/',
        cancel_url=f'https://127.0.0.1:5000/checkout/{data["id"]}'
    )
    print(checkout_session.url)
    return checkout_session.url


@app.route('/api/pay/success')
def pay_success():
    flash('Транс-акція пройшла успаішно. Після обробки на пошту вам прийде лист з деталями щодо замовлення.',
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
                email_management.send_mail(data['email'])
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


@app.route('/accounts/confirm/<email>', methods=['GET'])
def confirm(email):
    data = tmp_users[email]
    with app.app_context():
        print(data)
        user = Users(login=data['user'], password=generate_password_hash(data['password']), tel=data['tel'],
                     email=data['email'])
        db.session.add(user)
        db.session.commit()
    return redirect('/accounts/signin')


@app.route('/accounts/signin', methods=['GET'])
def signin():
    return render_template('signin.html')


@app.route('/accounts/signup', methods=["GET"])
def signup():
    return render_template('signup.html')


@app.route("/checkout/<id>")
def checkout(id):
    return render_template('checkout.html', product=Chamomile.query.get(int(id)))



if __name__ == "__main__":
    app.config['TEMPLATES_AUTO_RELOAD'] = True
    app.run(debug=True, ssl_context=context)  # Запускаємо веб-сервер з цього файлу

# 3270f929a4f77936d060671f12818552
