import pandas as pd

df = pd.read_csv('data.csv')


def get_city_data():
    counts = df['city'].value_counts()
    total = len(df['city'])
    percents = counts / total * 100
    return percents.to_dict()


def get_country_data():
    counts = df['country'].value_counts()
    total = len(df['country'])
    percents = counts / total * 100
    return percents.to_dict()


def get_region_data():
    counts = df['region'].value_counts()
    total = len(df['region'])
    percents = counts / total * 100
    return percents.to_dict()


def get_logged_data():
    counts = df['isLogged'].value_counts()
    total = len(df['isLogged'])
    percents = counts / total * 100
    return percents.to_dict()


def get_page_data():
    counts = df['path'].value_counts()
    total = len(df['path'])
    percents = counts / total * 100
    return percents.to_dict()


def get_hours_data():
    counts = df['hour'].value_counts()
    total = len(df['hour'])
    percents = counts / total * 100
    return percents.to_dict()


def get_product_data():
    global df
    dc = df.dropna(subset=['productId'])
    counts = dc['productId'].value_counts()
    total = len(dc['productId'])
    percents = counts / total * 100
    return percents.to_dict()


def get_cookie_data():
    counts = df['cookieEnabled'].value_counts()
    total = len(df['cookieEnabled'])
    percents = counts / total * 100
    return percents.to_dict()


def generate_statistic():
    data = {
        "city": get_city_data(),
        "region": get_region_data(),
        "country": get_country_data(),
        "logged": get_logged_data(),
        "cookie": get_cookie_data(),
        "page": get_page_data(),
        "product": get_product_data(),
        "hours": get_hours_data()
    }
    return data
print(df['productId'].value_counts())
