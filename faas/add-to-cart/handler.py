from pymongo import MongoClient
import json
import os
import sys

script_dir = os.path.dirname(__file__)
mymodule_dir = os.path.join(script_dir, 'common')
sys.path.append(mymodule_dir)

from utils import get_product_from_external_service
from shared import (
    NotFoundException,
    generate_ttl,
    get_cart_id,
    get_headers,
)

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
#    product_id = req["productId"]
#    quantity = req.get("quantity", 1)
    return {
        "statusCode": 200,
        "body": {
            "key": "value"
        }
    }

