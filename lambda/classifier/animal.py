import boto3
import json
import logging
import numpy as np
import os
import tflite_runtime.interpreter as tflite
from typing import Any, Dict, List, Tuple

# pylint: disable=no-name-in-module
from lambda_context import LambdaContext
from model import retrieve_model
from process import process_image

log = logging.getLogger()
log.setLevel(logging.INFO)

s3 = boto3.client('s3')


def lambda_handler(event: Dict[str, Any], context: LambdaContext) -> Dict[str, Any]:
    log.info(f'event: {event}')

    body = json.loads(event["body"])
    base64_image = body["data"]["image"]
    model_bucket = os.environ['MODEL_BUCKET']

    model_f, labels_f = retrieve_model(model_bucket, 'animal')

    prediction = run_prediction(model_f, base64_image)
    predicted_animal, confidence = translate_prediction(prediction, labels_f)

    log.info(f'Prediction: {predicted_animal}')
    log.info(f'Confidence: {confidence}')

    return {
        "statusCode": 200,
        "headers": {
            "Access-Control-Allow-Origin": "*",
            "Content-Type": "application/json",
        },
        "body": json.dumps({
            "prediction": {
                "name": predicted_animal,
                "confidence": confidence,
            },
        }),
    }

def run_prediction(model_path: str, base64_image: str) -> List[List[float]]:
    interpreter = tflite.Interpreter(model_path=model_path)
    interpreter.allocate_tensors()

    input_details = interpreter.get_input_details()
    output_details = interpreter.get_output_details()

    input_shape = input_details[0]['shape']
    input_data = process_image(base64_image, input_shape)
    interpreter.set_tensor(input_details[0]['index'], input_data)

    interpreter.invoke()

    output_data = interpreter.get_tensor(output_details[0]['index'])[0]
    return output_data.tolist()


def translate_prediction(output_data: List[float], labels_path: str) -> Tuple[str, float]:
    label_translation = get_labels_map(labels_path)
    log.info('Softmax output: %s', output_data)

    predicted_i = np.argmax(output_data)
    predicted_animal = label_translation[str(predicted_i)]
    confidence = output_data[predicted_i]

    return predicted_animal, confidence


def get_labels_map(labels_path: str) -> Dict[int, str]:
    with open(labels_path) as f:
        return json.load(f)
