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
    "User-Agent": "Web crawler"
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
        for prices in soup.find_all("span", "a-price-whole"):
            item_prices.append(prices.text.strip().replace(".", "").replace(",", ""))

        # get contents from specific class or id
        item_contents = soup.select(".a-size-base > a")
        item_info = [["Name", "Price($)", "Link"]]
        index = 0
        if item_contents:
            for item in item_contents:
                content = item.contents
                item_name = content[0].split(",")[0]
                if (index >= len(item_prices)) :
                     item_info.append([item_name, UNKNOWN, LINK_HEADER + item["href"]])
                else:
                     item_info.append([item_name, item_prices[index], LINK_HEADER + item["href"]])

                index += 1
            return item_info
        else:
            print("Failed to fetch data.")
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


## write items's information to .csv file
def writeToFile(item_info):

    with open(FILE_NAME, "w") as f:
        writer = csv.writer(f)

        for item in item_info:
            writer.writerow(item)

## read items' information from .csv file
def readFromFile():
    item_info = []
    with open(FILE_NAME) as File:
        reader = csv.reader(File, delimiter = ",", quotechar = ",",
                            quoting = csv.QUOTE_MINIMAL)
        for row in reader:
           if (row):
               item_info.append(row)

    return item_info


## compare if the items' prices have changed, and notify the owner through email
## if there is a change
def comparePrice():
    originalItems_info = readFromFile()
    updatedItems_info = fetchData()

    hasDropped = False
    for i in range(1, len(originalItems_info)):
        price1 = originalItems_info[i][1]
        price2 = updatedItems_info[i][1]
        if (price1 != UNKNOWN and price2 != UNKNOWN):
            price1 = int(price1)
            price2 = int(price2)
            if (price1 > price2):
                notify(originalItems_info[i], updatedItems_info[i])
                hasDropped = True
        else:
            print("Unknown Price. Please visit item's link to find out more. \nLink: " + originalItems_info[i][2])

    if hasDropped:
        writeToFile(updatedItems_info)



## main class
def main():

    item_info = fetchData()

    if (item_info):
        writeToFile(item_info)
    while (True):
        comparePrice()
        print("Web Crawler's going to sleep for a day")
        time.sleep(3600 * 24)
        print("Web Crawler's awake!")

    print("Done!")

main()
