import base64
from io import BytesIO
from PIL import Image, ImageOps

def process_image(b64: str, desired_size: list):
    base64_decode = BytesIO(base64.b64decode(b64))
    img = Image.open(base64_decode)

    pass
