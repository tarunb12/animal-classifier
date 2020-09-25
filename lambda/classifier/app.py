import json
import logging
from typing import Any, Dict

from context.lambda_context import LambdaContext

log = logging.getLogger()
log.setLevel(logging.INFO)


def lambda_handler(event: Dict[str, Any], context: LambdaContext) -> Dict[str, Any]:
    log.info('\n\nevent: %s\n\ncontext: %s\n', event, context)

    return {
        "statusCode": 200,
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
