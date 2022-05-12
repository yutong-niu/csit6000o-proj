import json
import os
import sys

from pymongo import MongoClient

script_dir = os.path.dirname(__file__)
mymodule_dir = os.path.join(script_dir, 'common')
sys.path.append(mymodule_dir)

product_service_url = os.environ["PRODUCT_SERVICE_URL"]
mongodb_service_url = os.environ["MONGODB_SERVICE_URL"]

from shared import (
        NotFoundException,
        generate_ttl,
        get_cart_id,
        get_headers,
)

from utils import get_product_from_external_service

mongo_client = MongoClient(host=mongodb_service_url,
        port=27017,
        username='csit6000o',
        password='csit6000o')

mydb = mongo_client['cart']
mycol = mydb['items']

def handle(event, context):

    request_payload = json.loads(event.body.decode('utf-8'))
    product_id = request_payload["productId"]
    quantity = int(request_payload["quantity"])
    cart_id, _ = get_cart_id(event.headers)
    try:
        product = get_product_from_external_service(product_id)
    except NotFoundException:
        return {
                "statusCode": 404,
                "headers": get_headers(cart_id=cart_id),
                "body": {"message": "product not found"},
                }

    if quantity < 0:
        return {
                "statusCode": 400,
                "headers": get_headers(cart_id),
                "body": 
                    {
                        "productId": product_id,
                        "message": "Quantity must not be lower than 0",
                    }
                }

    pk = f"cart#{cart_id}"
    ttl = generate_ttl()
    
    key = {
            "pk": pk,
            "sk": f"product#{product_id}",
            }
    data = {"$set":{
                "quantity": quantity,
                "expirationTime": ttl,
                "productDetail": product,
                }
            }
    mycol.update_one(key, data, upsert = True)

    return {
            "statusCode": 200,
            "headers": get_headers(cart_id),
            "body": json.dumps({"productId": product_id, "quantity": quantity, "message": "cart updated"}, default=str),
            }

