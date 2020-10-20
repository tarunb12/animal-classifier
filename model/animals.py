# %% Import ML libraries
import glob
import logging
import os
from PIL import Image, ImageOps
import tensorflow as tf
from tensorflow import keras
import tensorflow_datasets as tfds
import tarfile

log = logging.getLogger()
log.setLevel(logging.INFO)

# %% Constants
IMG_WIDTH = 48
IMG_HEIGHT = 48
CHANNELS = 3
NUM_CLASSES = 10

BATCH_SIZE = 16
EPOCHS = 50

splits = ['train', 'test', 'val']
train, test, val = splits

# %% Set up train and test data
animals10_path = 'data/animals10'

# builder = tfds.ImageFolder(animals10_path)
# counts = builder.info.splits
# train_count, test_count, val_count = map(lambda split: counts[split].num_examples, splits)
# print(builder.info)

# ds = builder.as_dataset(as_supervised=True, batch_size=BATCH_SIZE, shuffle_files=True)
# train_ds, test_ds, val_ds = ds[train], ds[test], ds[val]

# print(builder.info.features['label'].num_classes)

train_gen = keras.preprocessing.image.ImageDataGenerator(
    rescale=1./255,
    rotation_range=20,
    width_shift_range=0.2,
    height_shift_range=0.2,
    shear_range=0.2,
    zoom_range=0.2,
    horizontal_flip=True,
)
test_gen = keras.preprocessing.image.ImageDataGenerator(rescale=1./255)

ds_args = lambda dir: {
    'directory': f'{animals10_path}/{dir}',
    'batch_size': BATCH_SIZE,
    'shuffle': True,
    'target_size': (IMG_HEIGHT, IMG_WIDTH),
}
train_ds = train_gen.flow_from_directory(**ds_args('train'))
test_ds = test_gen.flow_from_directory(**ds_args('test'))
val_ds = test_gen.flow_from_directory(**ds_args('val'))

N_CLASSES = train_ds.num_classes
train_count, val_count = train_ds.n, val_ds.n
log.info(f'{train_ds.image_shape} {train_count} {val_count}')

# %% Create Model
model = keras.models.Sequential([
    keras.layers.InputLayer(input_shape=(IMG_HEIGHT, IMG_WIDTH, CHANNELS)),
    keras.layers.Conv2D(filters=32, kernel_size=(5, 5)),
    keras.layers.LeakyReLU(),
    keras.layers.MaxPool2D(pool_size=(2, 2)),
    keras.layers.Conv2D(filters=64, kernel_size=(3, 3)),
    keras.layers.LeakyReLU(),
    keras.layers.MaxPool2D(pool_size=(2, 2)),
    keras.layers.Conv2D(filters=64, kernel_size=(5, 5)),
    keras.layers.LeakyReLU(),
    keras.layers.MaxPool2D(pool_size=(2, 2)),
    keras.layers.Dropout(0.2),
    keras.layers.Flatten(),
    keras.layers.Dense(256),
    keras.layers.ReLU(),
    keras.layers.Dense(NUM_CLASSES),
    keras.layers.Softmax(),
])
model.compile(
    optimizer=tf.optimizers.Adam(),
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
    validation_data=val_ds,
    epochs=EPOCHS,
    steps_per_epoch=train_count // BATCH_SIZE,
    validation_steps=val_count // BATCH_SIZE,
    workers=6,
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

output_translation = {v: k for k, v in train_ds.class_indices.items()}
output_translation_file = f'{model_dir}.json'
with open(output_translation_file, 'w') as f:
    json.dump(output_translation, f)
s3.meta.client.upload_file(output_translation_file, bucket, 'animal/animal.json')

# %% Import plot libraries
from matplotlib import pyplot as plt
import pandas as pd
import seaborn as sns

sns.set_theme()

# %% Accuracy and Loss plots
acc = history.history['accuracy']
loss=history.history['loss']
epochs_range = range(EPOCHS)

plt.figure(figsize=(16, 16))
plt.subplot(1, 2, 1)
plt.plot(epochs_range, acc, label='Training Accuracy')
plt.legend(loc='lower right')
plt.title('Training Accuracy')

plt.subplot(1, 2, 2)
plt.plot(epochs_range, loss, label='Training Loss')
plt.legend(loc='upper right')
plt.title('Training Loss')
plt.savefig('metrics.png')
plt.show()
plt.close()
# %%
test_preds = model.predict(test_ds)
predictions = tf.argmax(test_preds, axis=-1)
confusion_matrix = tf.math.confusion_matrix(val_ds.labels, predictions, num_classes=NUM_CLASSES).numpy()

# %%
plt.figure(figsize=(20, 14))
df_confusion_matrix = pd.DataFrame(confusion_matrix, range(NUM_CLASSES), range(NUM_CLASSES))
# %%
sns.set(font_scale=1.4)
sns.heatmap(df_confusion_matrix, annot=True, annot_kws={'size': 16}, fmt='d', cmap='rocket_r')
plt.savefig('confusion_matrix.png')
plt.show()
plt.close()

# %%
