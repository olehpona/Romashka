from main import *

with app.app_context():
    db.create_all()
    ch = Chamomile( name="Рожева", price=15, type="Pink")
    db.session.add(ch)
    ch = Chamomile(name="Біла", price=10, type="Біла")
    db.session.add(ch)
    ch = Chamomile(name="Велика", price=25, type="Велика")
    db.session.add(ch)
    db.session.commit()
    ch = Chamomile.query.all()
    print(ch)