from flask import Flask
from flask_sqlalchemy import SQLAlchemy
import ssl
from Cryptodome.Random import get_random_bytes
import modules.email_management as email_management
#from flask_caching import Cache
import flask_monitoringdashboard as dashboard
import os
from flask_cors import CORS

config = {'CACHE_TYPE': 'SimpleCache'}

context = ssl.SSLContext(ssl.PROTOCOL_TLS)
context.load_cert_chain('security/cert.pem', keyfile='security/key.pem', password='aboba')

tmp_users = {}
email = email_management.Mail()
email.email_addr = 'flowerfactory@ukr.net'
email.email_pass = "uipSo7xmCozBbXdj"

processed_pay = {}

db = SQLAlchemy()

app = Flask(__name__, )  # Створюємо веб–додаток Flask
dashboard.bind(app)
app.config.from_mapping(config)
#cache = Cache(app)
app.config['CORS_HEADERS'] = 'Content-Type'
app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///chamomile.db"
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False
app.config["SECRET_KEY"] = get_random_bytes(4096)
db.init_app(app)
CORS(app)

from modules.routes import *
from modules.api import *
from modules.admin import *

def run():
    app.config['TEMPLATES_AUTO_RELOAD'] = True
    port = int(os.environ.get('PORT', 5000))
    app.jinja_env.cache = {}
    app.run(debug=True, ssl_context=context, host='0.0.0.0', port=port)  # Запускаємо веб-сервер з цього файлу

def create_app():
    db = SQLAlchemy()
    app = Flask(__name__, )  # Створюємо веб–додаток Flask
    dashboard.bind(app)
    app.config.from_mapping(config)
    #cache = Cache(app)
    app.config['CORS_HEADERS'] = 'Content-Type'
    app.config["SQLALCHEMY_DATABASE_URI"] = "postgresql://khuwfzjt:AcU-lQnrU0I3PoAo_GLVeV82-qwi0GLa@balarama.db.elephantsql.com/khuwfzjt"
    app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False
    app.config["SECRET_KEY"] = get_random_bytes(4096)
    db.init_app(app)
    app.config['TEMPLATES_AUTO_RELOAD'] = True
    port = int(os.environ.get('PORT', 5000))
    host = os.environ.get('HOST', '0.0.0.0')
    email.host = 'https://'+'192.168.1.106'+':'+str(port)
    app.jinja_env.cache = {}

if __name__ == "__main__":
    app.config['TEMPLATES_AUTO_RELOAD'] = True
    port = int(os.environ.get('PORT', 5000))
    host = os.environ.get('HOST', '0.0.0.0')
    email.host = 'https://'+'192.168.1.106'+':'+str(port)
    app.jinja_env.cache = {}
    app.run(debug=True, ssl_context=context, host=host, port=port)  # Запускаємо веб-сервер з цього файлу

