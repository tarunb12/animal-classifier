import json
import logging
from typing import Any, Dict

from lambda_context import LambdaContext

log = logging.getLogger()
log.setLevel(logging.INFO)


def lambda_handler(event: Dict[str, Any], context: LambdaContext) -> Dict[str, Any]:
    log.info('\n\nevent: %s\n\ncontext: %s\n', event, context)

    return {
        "statusCode": 200,
        "headers": {
            "Access-Control-Allow-Credentials": True,
            "Access-Control-Allow-Headers" : "Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token,x-requested-with",
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "GET,POST,OPTIONS",
            "Content-Type": "application/json",
        },
        "body": json.dumps({
            "message": "hello world",
            "animal": {
                "name": "dog",
                "confidence": .98,
            },
            "breed": {
                "name": "shih-tzu",
                "confidence": .87
            },
        }),
    }
