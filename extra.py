import smtplib, ssl
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart

def send_mail(email):
    sender_email = 'flowerfactory@ukr.net'
    receiver_email = email
    password = "uipSo7xmCozBbXdj"

    message = MIMEMultipart("alternative")
    message["Subject"] = "Підтвердження Email"
    message["From"] = sender_email
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
        <p>Привіт! Як ся маєш?<br>
        Ти бажав зареєструватися на нашім сайті, хіба ні?<br>
        <a href="https://127.0.0.1:5000/accounts/confirm/{email}" class="btn btn-info" style="margin-top: 15px;">Це посилання для підтвердження</a>
        </p>
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
if __name__ == '__main__':
    send_mail('lanuoleg@gmail.com')