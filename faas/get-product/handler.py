import json
import os
import logging

dir = os.path.dirname(os.path.realpath(__file__))

with open(os.path.join(dir, 'common/product_list.json'), 'r') as product_list:
    product_list = json.load(product_list)

HEADERS = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Allow-Methods": "OPTIONS,POST,GET",
}

def handle(event, context):
    #product_id = event.body.decode("utf-8")

    path_params = event.path
    product_id = path_params[1:]

    product = next(
        (item for item in product_list if item["productId"] == product_id), None
    )
    if product:
        return {
            "statusCode": 200,
            "headers": HEADERS,
            "body": {"product": product},
        }
    else:
        return {
            "statusCode": 404,
            "headers": HEADERS,
            "body": {"message": "product not found"},
        }
