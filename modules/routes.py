from app import app, db, tmp_users, cache
from flask import render_template, redirect
from modules.models import Chamomile, Users, Review
from werkzeug.security import generate_password_hash
import stripe

stripe.api_key = "sk_test_51MuFGRFp0R5k4xMcElesPxnVhq4xOq9bZdDHwbamEOnIdXxeSebTEOJAz2Exwjok79QyWH3ADqVmFUlW8F8cA2P700cnuYTH0r"


@app.route("/")  # Вказуємо url-адресу для виклику функції
@cache.cached(timeout=50)
def index():
    with app.app_context():
        return render_template('index.html', cards=Chamomile.query.all()[1:])  # Результат, що повертається у браузер


@app.route("/product/<id>")  # Вказуємо url-адресу для виклику функції
@cache.cached(timeout=50)
def product(id):
    print(id)
    with app.app_context():
        review = Review.query.filter_by(product_id=int(id)).all()
        return render_template('info.html', product=Chamomile.query.get(int(id)),
                               rewiews=review)  # Результат, що повертається у браузер


@app.route('/accounts/confirm/<email>', methods=['GET'])
def confirm(email):
    data = tmp_users[email]
    with app.app_context():
        print(data)
        user = Users(login=data['user'], password=generate_password_hash(data['password']), tel=data['tel'],
                     email=data['email'], post='')
        db.session.add(user)
        db.session.commit()
    return redirect('/accounts/signin')


@app.route('/accounts/passwordreset', methods=['GET'])
def passwordresset():
    return render_template('pass_reset.html')


@app.route('/accounts/signin', methods=['GET'])
@cache.cached(timeout=50)
def signin():
    return render_template('signin.html')


@app.route('/accounts/signup', methods=["GET"])
@cache.cached(timeout=50)
def signup():
    return render_template('signup.html')


@app.route("/checkout/<id>")
def checkout(id):
    return render_template('checkout.html', product=Chamomile.query.get(int(id)))


@app.route('/user')
def user():
    return render_template('user.html')


@app.route('/catalog' , methods=['GET'])
def catalog():
    return render_template('catalog.html')

# @app.route('/lucky')
# def luck():
#     return render_template('admin.html')
