import base64
from io import BytesIO
import numpy as np
from PIL import Image, ImageOps

def process_image(b64: str, raw_desired_size: list):
    base64_decode = BytesIO(base64.b64decode(b64))
    image = Image.open(base64_decode)
    old_size = image.size
    desired_size = tuple(raw_desired_size[1:3])

    ratio = float(max(desired_size)) / max(old_size)
    new_size = tuple([int(x * ratio) for x in old_size])
    image = image.resize(new_size, Image.ANTIALIAS)

    processed_image = Image.new('RGB', desired_size)
    processed_image.paste(
        image,
        (
            (desired_size[0] - new_size[0]) // 2,
            (desired_size[1] - new_size[1]) // 2,
        ),
    )

    input_image = np.asarray(processed_image, dtype=np.float32)
    input_image = input_image / 255.
    input_image = np.reshape(input_image, raw_desired_size)
    return input_image
