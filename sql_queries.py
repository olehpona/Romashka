from app import *
from modules.models import *
from json import *
with app.app_context():
    db.create_all()