''' Functions for Clibro capturing web pages '''
from time import sleep
from io import BytesIO
from PIL import Image
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.firefox.options import Options as FirefoxOptions

def connect():
    '''connect to the webdriver'''
    options=FirefoxOptions()
    options.add_argument('--headless')
    driver = webdriver.Firefox(options=options)

    return driver


def fetch_page(url):
    '''visit a page, return screenshot and its links'''
    driver=connect()
    driver.get(url)
    sleep(0.25)

    image_data=driver.get_full_page_screenshot_as_png()
    image=Image.open(BytesIO(image_data))

    # gather links
    link_elements = driver.find_elements(By.TAG_NAME, 'a')

    links = []
    for value in link_elements:
        links.append({
            'title': value.text,
            'url': value.get_attribute('href'),
            'x': value.location['x'],
            'y': value.location['y'],
            'width': value.rect['width'],
            'height': value.rect['height']
        })

    # done with driver
    # driver.quit()

    return image, links
