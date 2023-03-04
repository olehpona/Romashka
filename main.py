from flask import Flask

app = Flask(__name__) # Створюємо веб–додаток Flask
@app.route("/") # Вказуємо url-адресу для виклику функції
def index():
    return ''''<html><head></head><body><div>
<form action="https://www.portmone.com.ua/gateway/" method="post" target="myFrame">
  <input type="hidden" name="bodyRequest" value="{
    &quot;paymentTypes&quot;:{&quot;card&quot;:&quot;Y&quot;,&quot;portmone&quot;:&quot;Y&quot;,&quot;token&quot;:&quot;N&quot;,
                    &quot;clicktopay&quot;:&quot;Y&quot;,&quot;createtokenonly&quot;:&quot;N&quot;},
    &quot;priorityPaymentTypes&quot;:{&quot;card&quot;:&quot;1&quot;,&quot;portmone&quot;:&quot;2&quot;,
                            &quot;token&quot;:&quot;0&quot;,&quot;clicktopay&quot;:&quot;1&quot;,&quot;createtokenonly&quot;:&quot;0&quot;},
    &quot;payee&quot;:{&quot;payeeId&quot;:&quot;3048&quot;,&quot;login&quot;:&quot;&quot;,&quot;dt&quot;:&quot;&quot;,&quot;signature&quot;:&quot;&quot;, &quot;shopSiteId&quot;:&quot;&quot;},
    &quot;order&quot;:{&quot;description&quot;:&quot;Test Payment&quot;,&quot;shopOrderNumber&quot;:&quot;SHP-00445401&quot;,
             &quot;billAmount&quot;:&quot;10&quot;,&quot;attribute1&quot;:&quot;1&quot;,&quot;attribute2&quot;:&quot;2&quot;,&quot;attribute3&quot;:&quot;3&quot;,
             &quot;attribute4&quot;:&quot;4&quot;,&quot;attribute5&quot;:&quot;&quot;,&quot;successUrl&quot;:&quot;&quot;,&quot;failureUrl&quot;:&quot;&quot;,
             &quot;preauthFlag&quot;:&quot;N&quot;,&quot;billCurrency&quot;:&quot;UAH&quot;, &quot;encoding&quot;:&quot;&quot;},
    &quot;token&quot;:{&quot;tokenFlag&quot;:&quot;N&quot;,&quot;returnToken&quot;:&quot;N&quot;,&quot;token&quot;:&quot;&quot;,&quot;cardMask&quot;:&quot;&quot;,
             &quot;otherPaymentMethods&quot;:&quot;Y&quot;,&quot;sellerToken&quot;:&quot;&quot;},
    &quot;payer&quot;:{&quot;lang&quot;:&quot;uk&quot;, &quot;emailAddress&quot;:&quot;test@ukr.net&quot;},
    &quot;style&quot;:{&quot;type&quot;:&quot;light&quot;,&quot;logo&quot;:&quot;&quot;,&quot;backgroundColorHeader&quot;:&quot;&quot;,
             &quot;backgroundColorButtons&quot;:&quot;&quot;,&quot;colorTextAndIcons&quot;:&quot;&quot;,
             &quot;borderColorList&quot;:&quot;&quot;,&quot;bcMain&quot;:&quot;&quot;}
  }">
  <input type="hidden" name="typeRequest" value="json">
  <input type="submit" value="bbr">
</form>
  <iframe name="myFrame" width="50%" height="70%" frameborder="0"></iframe>
</div>


</body></html>''' #Результат, що повертається у браузер

if __name__ == "__main__":
    app.run() # Запускаємо веб-сервер з цього файлу