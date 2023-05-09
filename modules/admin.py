from app import app, db, tmp_users, cache
from flask import render_template, redirect
from modules.models import Chamomile, Users, Review
from werkzeug.security import generate_password_hash
from modules.data_analys import generate_statistic
@app.route('/admin/data')
def data():
    return generate_statistic()

@app.route('/admin')
def luck():
    return render_template('admin.html')