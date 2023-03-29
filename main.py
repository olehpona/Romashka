from flask import Flask, render_template, request
from flask_sqlalchemy import SQLAlchemy
import json

db = SQLAlchemy()

app = Flask(__name__)  # Створюємо веб–додаток Flask

app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///chamomile.db"
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False
db.init_app(app)


class Chamomile(db.Model):
    id = db.Column(db.Integer, primary_key=True, nullable=False)
    name = db.Column(db.String, nullable=False)
    price = db.Column(db.Integer, nullable=False)
    description = db.Column(db.Text)
    type = db.Column(db.String, nullable=False)
    pic_url = db.Column(db.String)

    def __rrpr__(self):
        return json.dumps({
            "name": self.name,
            "description": self.description,
            "type": self.type,
            "id": self.id,
            "price": self.price,
            "pic": self.pic_url
        })


class Review(db.Model):
    id = db.Column(db.Integer, primary_key=True, nullable=False)
    product_id = db.Column(db.Integer,  nullable=False)
    email = db.Column(db.String, nullable=False)
    detail = db.Column(db.Text, nullable=True)
    rate = db.Column(db.Integer, nullable=False)


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


@app.route("/review/<id>", methods=['POST'])  # Вказуємо url-адресу для виклику функції
def review(id):
    with app.app_context():
        data = request.get_json()
        rev = Review(product_id=int(data['id']), rate=int(data['rate']), detail=data['review'], email=data['email'])
        db.session.add(rev)
        db.session.commit()
        return 'OK'

@app.route("/checkout/<id>")
def checkout(id):
    return render_template('checkout.html' , product=Chamomile.query.get(int(id)))

if __name__ == "__main__":
    app.config['TEMPLATES_AUTO_RELOAD'] = True
    app.run(debug=True)  # Запускаємо веб-сервер з цього файлу

#3270f929a4f77936d060671f12818552