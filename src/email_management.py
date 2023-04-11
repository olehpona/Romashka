import smtplib, ssl
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from email.utils import formataddr
from email.header import Header


class Mail():
    def __init__(self):
        self.email_addr = ''
        self.email_pass = ''

    def send_confirm_mail(self, email):
        sender_email = self.email_addr
        receiver_email = email
        password = self.email_pass

        message = MIMEMultipart('alternative')
        message["Subject"] = "Підтвердження Email"
        message["From"] = formataddr((str(Header('Твій завод "Тюльпанчик"', 'utf-8')), sender_email))
        message["To"] = receiver_email
        text = f"""\
        Привіт. Як ся маєш?
        Ти бажав зареєструватися на нашім сайті, хіба ні?
        Ось посилання для підтвердження:
        https://127.0.0.1:5000/accounts/confirm/{email}
        """
        html = f"""\
    <!DOCTYPE html>
    <html lang="en">
    <body>
    <main class="container">
        <div style="background-color: cornsilk; border-radius: 25px; width:fit-content; height:fit-content; text-align: center;">
            <img src="https://icons.veryicon.com/png/o/miscellaneous/two-color-icon-library/user-286.png" alt="Logo">
            <p style="font-size: 15px;">Привіт! Як ся маєш?<br>
            Ти бажав зареєструватися на нашім сайті, хіба ні?<br>
            </p>
            <a style="font-size: 15px;" href="https://127.0.0.1:5000/accounts/confirm/{email}" class="btn btn-info" style="margin: 10px;">Це посилання для підтвердження</a>
        </div>
    </main>
    </body>
    </html>
        """
        part1 = MIMEText(text, "plain")
        part2 = MIMEText(html, "html")
        message.attach(part1)
        message.attach(part2)
        context = ssl.create_default_context()
        with smtplib.SMTP_SSL("smtp.ukr.net", 465, context=context) as server:
            server.login(sender_email, password)
            server.sendmail(
                sender_email, receiver_email, message.as_string()
            )
            print('sended')

    def send_buy_mail(self, email: str, products: list):
        sender_email = self.email_addr
        receiver_email = email
        password = self.email_pass
        sum = 0
        for i in products:
            sum +=int(i['price']) * int(i['quantity'])
        message = MIMEMultipart('alternative')
        message["Subject"] = "Покупка"
        message["From"] = formataddr((str(Header('Твій завод "Тюльпанчик"', 'utf-8')), sender_email))
        message["To"] = receiver_email
        text = f"""\

            """
        html = f"""\
        <!DOCTYPE html>
        <html lang="en">
        <body>
        <main class="container">
            <div style="background-color: cornsilk; border-radius: 25px; width:fit-content; height:fit-content; text-align: center;">
                <img src="https://cdn-icons-png.flaticon.com/512/3081/3081822.png" alt="Logo">
                <p style="font-size: 15px;">Привіт! Як ся маєш?<br>
                Ти зробив покупку на нашому сайті:<br>
                </p>
            """
        for i in products:
            html += f'''
            <div style="display:flex; padding: 15px; flex-wrap: nowrap;">
            <img style="width:10vh ; height: 10vh; border-radius:25px;" src="{i['pic_url']}">
            <p style="margin:15px;">{i['name']}</p>
            <p style="margin:15px;">Ціна: {i['price']} грн</p>
            <p style="margin:15px;">Кількість: {i['quantity']}</p>
            </div>
            '''
        html += f'''
                <p>Сума: {sum} грн</p>
                <p>Виникли труднощі звертайся!</p>
            </div>
        </main>
        </body>
        </html>
        '''
        part1 = MIMEText(text, "plain")
        part2 = MIMEText(html, "html")
        message.attach(part1)
        message.attach(part2)
        context = ssl.create_default_context()
        with smtplib.SMTP_SSL("smtp.ukr.net", 465, context=context) as server:
            server.login(sender_email, password)
            server.sendmail(
                sender_email, receiver_email, message.as_string()
            )
            print('sended')


if __name__ == '__main__':
    send_mail('lanuoleg@gmail.com')
