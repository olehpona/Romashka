from app import db


class Chamomile(db.Model):
    id = db.Column(db.Integer, primary_key=True, nullable=False)
    name = db.Column(db.String, nullable=False)
    price = db.Column(db.Integer, nullable=False)
    description = db.Column(db.Text)
    type = db.Column(db.String, nullable=False)
    filters = db.Column(db.Text)
    pic_url = db.Column(db.String)
    stripe_price = db.Column(db.String, nullable=False)


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
    post = db.Column(db.String)
    orders = db.relationship('Orders', backref='user', lazy=True)


class Orders(db.Model):
    id = db.Column(db.Integer, primary_key=True, nullable=False)
    status = db.Column(db.String, nullable=False)
    price = db.Column(db.Integer, nullable=False)
    date = db.Column(db.Integer, nullable=False)
    products = db.Column(db.String)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'),
                        nullable=False)
