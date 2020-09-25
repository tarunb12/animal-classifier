import json
import logging

log = logging.getLogger()
log.setLevel(logging.INFO)


def lambda_handler(event, context) -> dict:
    log.info('event: %s\n context: %s', event, context)

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
            # "location": ip.text.replace("\n", "")
        }),
    }
