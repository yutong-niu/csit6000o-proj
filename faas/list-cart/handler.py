import json
import os
import sys

from pymongo import MongoClient

script_dir = os.path.dirname(__file__)
mymodule_dir = os.path.join(script_dir, 'common')
sys.path.append(mymodule_dir)

from shared import get_cart_id, get_headers, handle_decimal_type
product_service_url = os.environ["PRODUCT_SERVICE_URL"]
mongodb_service_url = os.environ["MONGODB_SERVICE_URL"]

mongo_client = MongoClient(host=mongodb_service_url,
        port=27017,
        username='csit6000o',
        password='csit6000o')

mydb = mongo_client['cart']
mycol = mydb['items']



def handle(event, context):
    """handle a request to the function
    Args:
        req (str): request body
    """
    cart_id, generated = get_cart_id(event.headers)
    #_id = event.body.decode('utf-8') 
    key_string = f"cart#{cart_id}"
   # generated = False
    # will change later

    if generated:
        product_list = []
    else:
        q = {'pk':key_string, "quantity": {"$gt": 0}}
        projection = {"sk":1,"quantity":1,"productDetail":1}
        product_list = list(mycol.find(q, projection))
   # all_product = list(mycol.find())   
    for product in product_list:
        product.update(
            (k, v.replace("product#", "")) for k, v in product.items() if k == "sk"
        )
    return {
        "statusCode": 200,
        "headers": get_headers(cart_id),
        "body": json.dumps({"products": product_list,}, default = str)
    }
