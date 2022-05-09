import json
import os

dir = os.path.dirname(os.path.realpath(__file__))

with open(os.path.join(dir, 'common/product_list.json'), 'r') as product_list:
    product_list = json.load(product_list)

HEADERS = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Allow-Methods": "OPTIONS,POST,GET",
}

def handle(req):
    #path_params = event["pathParameters"]
    #product_id = path_params.get("product_id")
    product_id = req
    product = next(
        (item for item in product_list if item["productId"] == product_id), None
    )

    return json.dumps({
            "statusCode": 200,
            "headers": HEADERS,
            "body": {"product": product},
    })
