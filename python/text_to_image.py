from PIL import Image
import numpy as np


def convert_text_to_image(text, w=128):
    h = int(np.ceil(text.__len__() / 3.0 / w))
    data = np.zeros((h, w, 3), dtype=np.uint8)
    i = 0
    j = 0
    for char in text:
        cur = int(np.floor(i / 3.0))
        data[int(np.floor(cur / w))][cur % w][j % 3] = ord(char)
        i += 1
        j += 1
    img = Image.fromarray(data, 'RGB')
    img.save(text[0:15] + '.png')  # MUST USE PNG


def convert_image_to_text(image_path):
    image = Image.open(image_path)
    data = np.asarray(image, dtype=np.uint8)
    result = ""
    for row in data:
        for col in row:
            for color in col:
                result = result + chr(color)

    return result
