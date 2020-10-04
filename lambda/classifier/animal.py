import boto3
import json
import logging
import numpy as np
import os
from tempfile import TemporaryFile
import tflite_runtime.interpreter as tflite
from typing import Any, Dict, List, Tuple

from lambda_context import LambdaContext
from model import retrieve_model

log = logging.getLogger()
log.setLevel(logging.INFO)

s3 = boto3.client('s3')


def lambda_handler(event: Dict[str, Any], context: LambdaContext) -> Dict[str, Any]:
    log.info(f'event: {event}')

    # image = event["body"]["data"]["image"]
    model_bucket = os.environ['MODEL_BUCKET']

    log.info(model_bucket)

    model_f, labels_f = retrieve_model(model_bucket, 'animal')

    prediction = run_prediction(model_f)
    label_translation = get_labels_map(labels_f)

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
        }),
    }


def run_prediction(model_path: str) -> List[List[float]]:
    interpreter = tflite.Interpreter(model_path=model_path)
    interpreter.allocate_tensors()

    input_details = interpreter.get_input_details()
    output_details = interpreter.get_output_details()

    input_shape = input_details[0]['shape']
    input_data = np.array(np.random.random_sample(input_shape), dtype=np.float32)
    interpreter.set_tensor(input_details[0]['index'], input_data)

    interpreter.invoke()

    output_data = interpreter.get_tensor(output_details[0]['index'])
    print(output_data)
    return output_data


def get_labels_map(labels_path: str) -> Dict[int, str]:
    with open(labels_path) as f:
        return json.load(f)
