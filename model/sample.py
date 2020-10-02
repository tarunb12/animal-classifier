# %% Import ML libraries
import glob
import os
from PIL import Image, ImageOps
import tensorflow as tf
from tensorflow import keras
import tarfile

# %% Constants
IMG_WIDTH = 48
IMG_HEIGHT = 48
BATCH_SIZE = 32
CHANNELS = 3

# %% Untar animals10 dataset
dataset_path = 'datasets/'
animals10_path = f'{dataset_path}animals10'
if not os.path.isdir(animals10_path):
    with tarfile.open(f'{animals10_path}.tgz') as tar:
        tar.extractall(dataset_path)
sum((len(f) for _, _, f in os.walk(animals10_path)))

# %% Set up train and test data
train_gen = keras.preprocessing.image.ImageDataGenerator(
    rescale=1./255,
    validation_split=0.2
)
ds_args: dict = {
    'directory': animals10_path,
    'batch_size': BATCH_SIZE,
    'shuffle': True,
    'target_size': (IMG_HEIGHT, IMG_WIDTH),
}
train_ds = train_gen.flow_from_directory(
    **ds_args,
    subset='training',
)
validation_ds = train_gen.flow_from_directory(
    **ds_args,
    subset='validation',
)
N_CLASSES = train_ds.num_classes
train_count, validation_count = train_ds.n, validation_ds.n
print(train_ds.image_shape)

# %%
model = keras.models.Sequential([
    keras.layers.Flatten(input_shape=(IMG_HEIGHT, IMG_WIDTH, 3)),
    keras.layers.Dense(units=256, activation=keras.activations.relu),
    keras.layers.Dropout(0.2),
    keras.layers.Dense(N_CLASSES),
    keras.layers.Softmax(),
])
model.compile(
    optimizer='adam',
    loss=tf.keras.losses.CategoricalCrossentropy(),
    metrics=['accuracy'],
)
model.summary()

# %% Set up progress saving by creating a checkpoint callback
checkpoint_path = 'tmp/training.ckpt'
checkpoint_dir = os.path.dirname(checkpoint_path)
checkpoint_callback = keras.callbacks.ModelCheckpoint(
    filepath=checkpoint_path,
    save_weights_only=True,
    verbose=1,
)

# %%
history = model.fit(
    train_ds,
    validation_data=validation_ds,
    epochs=35,
    steps_per_epoch=train_count // BATCH_SIZE,
    validation_steps=validation_count // BATCH_SIZE,
    callbacks=[checkpoint_callback],
)

# %% Save model
model_dir = 'models/animal'
model.save(model_dir)

# %% Convert model to tflite
converter = tf.lite.TFLiteConverter.from_saved_model(model_dir)
tflite_model = converter.convert()
tflite_model_file = f'{model_dir}.tflite'
with open(tflite_model_file, 'wb') as f:
    f.write(tflite_model)

# %% Setup S3 upload
import boto3
from dotenv import load_dotenv
import json

basedir =  os.path.abspath(os.path.dirname(__file__))
load_dotenv(os.path.join(basedir, '.env'))
env = os.environ

access_key = os.getenv('AWS_ACCESS_KEY')
secret_key = os.getenv('AWS_SECRET_KEY')
bucket = os.getenv('MODEL_BUCKET')

session = boto3.Session(
    aws_access_key_id=access_key,
    aws_secret_access_key=secret_key,
)

# %% Upload to S3
s3 = session.resource('s3')
s3.meta.client.upload_file(tflite_model_file, bucket, 'animal/animal.tflite')

output_translation = train_ds.class_indices
output_translation_file = f'{model_dir}.json'
with open(output_translation_file, 'w') as f:
    json.dump(output_translation, f)
s3.meta.client.upload_file(output_translation_file, bucket, 'animal/animal.json')

# %%
import matplotlib.pyplot as plt

acc = history.history['accuracy']

loss=history.history['loss']

epochs_range = range(35)

plt.figure(figsize=(8, 8))
plt.subplot(1, 2, 1)
plt.plot(epochs_range, acc, label='Training Accuracy')
plt.legend(loc='lower right')
plt.title('Training Accuracy')

plt.subplot(1, 2, 2)
plt.plot(epochs_range, loss, label='Training Loss')
plt.legend(loc='upper right')
plt.title('Training Loss')
plt.show()


# %%
