import json
import logging
import tflite_runtime.interpreter as tflite
from typing import Any, Dict

from lambda_context import LambdaContext

log = logging.getLogger()
log.setLevel(logging.INFO)

def lambda_handler(event: Dict[str, Any], context: LambdaContext) -> Dict[str, Any]:
    log.info('\n\nevent: %s\n\ncontext: %s\n', event, context)
    try:
        tflite.Interpreter()
    except ValueError as e:
        log.error(e)
        log.info('test')

    return {
        "statusCode": 200,
        "headers": {
            "Access-Control-Allow-Origin": "*",
            "Content-Type": "application/json",
        },
        "body": json.dumps({
            "message": "hello world",
            "prediction": {
                "name": "dog",
                "confidence": .98,
            },
            # "prediction": {
            #     "name": "shih-tzu",
            #     "confidence": .87
            # },
        }),
    }
