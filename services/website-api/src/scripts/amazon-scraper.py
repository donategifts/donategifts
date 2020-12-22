'''
TODO:
(1) complete the scraper for Amazon wish list
(2) get item title, item price, a href anchor link from "Add to Cart" button, && comment for each item
(3) check if the item is still in the wish list (will disappear if user already donated the item)
(4) comment for each item will contain the child's name and it will be used to connect with each wish card, so this is important
sample wish list url to test with = https://www.amazon.com/hz/wishlist/ls/318C7DKOEKSQ5?ref_=wl_share
hyperlink from "Add to Cart" button should look like = https://www.amazon.com/gp/item-dispatch?registryID.1=1294SW62GB8SD&registryItemID.1=I1T6SE8K2M6XPN&offeringID.1=FppQH3Av3vsQArgBrXtHtyMgxAUdZVcRL2yB5kEMf%252BzBAzYpSHNgmHIY0kFbFkvRUBwTDiIvc7ksxCZmIEqvwhzMojAVHvLp7CY6I%252FJUSRHPrHSQZSv8%252B9es9aR%252FeelQYtCxd9n6hcPgx%252FBwPKvkEA%253D%253D&session-id=146-5423461-6179443&isGift=0&submit.addToCart=1&quantity.1=1&ref_=lv_ov_lig_pab
'''

import urllib.request
import requests
from bs4 import BeautifulSoup
import csv
import time
import smtplib
from string import Template
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText

FROM_EMAIL = "some@email.com"
TO_EMAIL = "some@email.com"
PASSWORD = "****"
UNKNOWN = "Unknown"

headers = {
    'authority': 'www.amazon.com',
    'pragma': 'no-cache',
    'cache-control': 'no-cache',
    'dnt': '1',
    'upgrade-insecure-requests': '1',
    'user-agent': 'Mozilla/5.0 (X11; CrOS x86_64 8172.45.0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/51.0.2704.64 Safari/537.36',
    'accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9',
    'sec-fetch-site': 'none',
    'sec-fetch-mode': 'navigate',
    'sec-fetch-dest': 'document',
    'accept-language': 'en-GB,en-US;q=0.9,en;q=0.8',
}


## Http address of the targeted url
LINK_HEADER = "https://www.amazon.com"
## File name to store the data
FILE_NAME = "item_info.csv"



## Fetch data from the targeted url
def fetchData():
    try:
        # targeted url
        wiki = "https://www.amazon.com/hz/wishlist/ls/318C7DKOEKSQ5?ref_=wl_share"
        # get permission from the page
        page = requests.get(wiki, headers = headers, timeout = 5)

        # page's contents
        soup = BeautifulSoup(page.text, "html.parser")

        # get items' prices
        item_prices = []
        for items in soup.find_all("li", "g-item-sortable"):

            print(items.get('data-price'))
            print(items.find("a", "a-link-normal").get('title'))
            addToCartUrl = items.find('a', 'a-button-text')
            if (addToCartUrl):
                print(addToCartUrl.get('href'))
            
            print(items.find('span', 'g-comment-quote').text)

    except requests.ConnectionError as theE:
        print("Connection Error. Make sure you are connected to the Internet.\n")
        print(str(theE))
    except requests.Timeout as theE:
        print("Timeout Error")
        print(str(theE))
    except requests.RequestException as theE:
        print("General Error")
        print(str(theE))
    except KeyboardInterrupt:
        print("Program was closed by someone")

## main class
def main():

    item_info = fetchData()

main()
