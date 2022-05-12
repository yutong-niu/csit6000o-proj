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
    request_payload = json.loads(event.body.decode('utf-8'))
    product_id = request_payload["productId"]
    quantity = request_payload.get("quantity", 1)
    cart_id, _ = get_cart_id(event.headers)

    try:
        product = get_product_from_external_service(product_id)
    except NotFoundException:
        return {
            "statusCode": 404,
            "headers": get_headers(cart_id),
            "body": {"message": "product not found"},
        }

    pk = f"cart#{cart_id}"
    ttl = generate_ttl()

    key = {
        "pk": pk,
        "sk": f"product#{product_id}",
    }

    query = mycol.find_one(key)
    if not query:
        initial_quantity = 0
    else:
        initial_quantity = query['quantity']
    update_quantity = initial_quantity + int(quantity)

    if update_quantity <= 0:
        mycol.delete_one(key)
    else:
        data = {
            "$set": {
                "quantity": update_quantity,
                "expirationTime": ttl,
                "productDetail": product,
            }
        }
        mycol.update_one(key, data, upsert=True)

    
    return {
        "statusCode": 200,
        "headers": get_headers(cart_id),
        "body": json.dumps(
            {"productId": product_id, "message": "product added to cart"}
        ),
    }

