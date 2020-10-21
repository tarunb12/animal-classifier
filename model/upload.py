# Setup S3 upload
from sys import argv
import boto3
from dotenv import load_dotenv
import io
import json
import logging
import os

log = logging.getLogger()
log.setLevel(logging.INFO)

model = argv[1]
assert model == 'animal' or model == 'breed'

basedir = os.path.abspath(os.path.dirname(__file__))
load_dotenv(os.path.join(basedir, '.env'))

access_key = os.getenv('AWS_ACCESS_KEY')
secret_key = os.getenv('AWS_SECRET_KEY')
test_bucket_name = os.getenv('TEST_MODEL_BUCKET')
bucket_name = os.getenv('MODEL_BUCKET')

s3 = boto3.client(
    's3',
    aws_access_key_id=access_key,
    aws_secret_access_key=secret_key,
)

# Upload to S3
model_f = f'tmp/{model}.tflite'
label_f = f'tmp/{model}.json'

model_obj_name = f'{model}/{model}.tflite'
label_obj_name = f'{model}/{model}.json'

with open(model_f, 'wb') as f:
    s3.download_fileobj(test_bucket_name, model_obj_name, f)

with open(label_f, 'wb') as g:
    s3.download_fileobj(test_bucket_name, label_obj_name, g)

s3.upload_file(model_f, bucket_name, model_obj_name)
s3.upload_file(label_f, bucket_name, label_obj_name)
