import boto3
from tempfile import TemporaryFile
from typing import IO, Tuple

s3 = boto3.client('s3')


def retrieve_model(model_bucket: str, model_name: str) -> Tuple[str, str]:
    model_f = f'/tmp/{model_name}.tflite'
    label_f = f'/tmp/{model_name}.json'

    with open(model_f, 'wb') as f:
        # pylint: disable=maybe-no-member
        s3.download_fileobj(model_bucket, f'{model_name}/{model_name}.tflite', f)
        f.seek(0)
    
    with open(label_f, 'wb') as f:
        # pylint: disable=maybe-no-member
        s3.download_fileobj(model_bucket, f'{model_name}/{model_name}.json', f)
        f.seek(0)

    return model_f, label_f
