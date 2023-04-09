from flask import Flask
from flask_sqlalchemy import SQLAlchemy
import ssl
from Cryptodome.Random import get_random_bytes
import email_management

context = ssl.SSLContext(ssl.PROTOCOL_TLS)
context.load_cert_chain('security/cert.pem', keyfile='security/key.pem', password='aboba')

tmp_users = {}
email = email_management.Mail()
email.email_addr = 'flowerfactory@ukr.net'
email.email_pass = "uipSo7xmCozBbXdj"

processed_pay = {}

db = SQLAlchemy()

app = Flask(__name__, )  # Створюємо веб–додаток Flask
app.config['CORS_HEADERS'] = 'Content-Type'
app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///chamomile.db"
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False
app.config["SECRET_KEY"] = get_random_bytes(4096)
db.init_app(app)

from routes import *

# models

# routes


if __name__ == "__main__":
    app.config['TEMPLATES_AUTO_RELOAD'] = True
    app.run(debug=True, ssl_context=context)  # Запускаємо веб-сервер з цього файлу

# 3270f929a4f77936d060671f12818552
