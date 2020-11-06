import boto3
import json
import os
from tempfile import TemporaryFile
from typing import Dict, Tuple

s3 = boto3.client('s3')


def retrieve_model(model_bucket: str, model_name: str) -> Tuple[str, str]:
    model_f = f'/tmp/{model_name}.tflite'
    label_f = f'/tmp/{model_name}.json'

    if not os.path.isfile(model_f):
        with open(model_f, 'wb') as f:
            # pylint: disable=maybe-no-member
            s3.download_fileobj(model_bucket, f'{model_name}/{model_name}.tflite', f)
            f.seek(0)

    if not os.path.isfile(label_f):
        with open(label_f, 'wb') as f:
            # pylint: disable=maybe-no-member
            s3.download_fileobj(model_bucket, f'{model_name}/{model_name}.json', f)
            f.seek(0)

    return model_f, label_f

def get_labels_map(labels_path: str) -> Dict[int, str]:
    with open(labels_path) as f:
        return json.load(f)