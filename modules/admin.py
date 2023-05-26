from app import app, db, tmp_users
from flask import request, redirect, flash, jsonify, render_template
from modules.models import Chamomile, Users, Review
from werkzeug.security import generate_password_hash
from modules.data_analys import generate_statistic
import json
import pyotp


class Otp():
    def __init__(self):
        self.otp = pyotp.TOTP(self.getKey())

    def getKey(self):
        with app.app_context():
            passw = Users.query.filter_by(email='admin@admin.admin').first()
            if passw:
                return passw.password
            else:
                secret = pyotp.random_base32()
                return secret

    def getUrl(self):
        return self.otp.provisioning_uri(name='Admin (Тюльпанчик)',
                                         issuer_name='Admin')

    def dump(self):
        with app.app_context():
            user = Users(login='admin', password=self.otp.secret, tel='admin',
                         email='admin@admin.admin', post='')
            db.session.add(user)
            db.session.commit()
    def getSecret(self):
        return self.otp.secret

    def validate(self, key):
        if self.otp.verify(key):
            return 'OK'
        else:
            return 'BAD'


otp = Otp()

@app.route('/admin/create')
def create_admin():
    if Users.query.filter_by(email='admin@admin.admin').first():
        return redirect('/admin')
    else:
        return render_template('admin_create.html' , secret=otp.getSecret() , secret_url = otp.getUrl())

@app.route('/admin/data')
def data():
    return generate_statistic()


@app.route('/admin')
def admin():
    if Users.query.filter_by(email='admin@admin.admin').first():
        return render_template('admin.html')
    else:
        return redirect('/admin/create')

@app.route('/admin/get_product_by', methods=["POST"])
def get_products_list():
    print(request.get_data())
    data = request.get_json()
    query = []
    if data['request_type'] == 'all':
        for i in Chamomile.query.get().all():
            query.append(i.id, )
        return {'id': query}
    else:
        _ = Chamomile.query.filter(Chamomile.name.like('%' + data['name'] + '%'))
        if data['id'] != '':
            _ = _.filter_by(id=data['id'])
        if data['price'] != '':
            _ = _.filter_by(price=data['price'])
        for i in _.all():
            query.append(i.id, )
        return {'id': query}


@app.route('/admin/otp/validate' , methods=['POST'])
def validate():
    if Users.query.filter_by(email='admin@admin.admin').first():
        pass
    else:
        otp.dump()
    return otp.validate(request.get_json()['code'])