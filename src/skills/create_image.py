# Description: Generates a blank colored image with custom width, height, and background color.
import sys
import os
from PIL import Image

if len(sys.argv) < 5:
    print("Usage: python create_image.py <width> <height> <color> <filename>")
    sys.exit(1)

try:
    width = int(sys.argv[1])
    height = int(sys.argv[2])
    color = sys.argv[3]
    filename = sys.argv[4]

    desktop = os.path.join(os.path.expanduser('~'), 'Desktop')
    save_path = os.path.join(desktop, filename)

    img = Image.new('RGB', (width, height), color)
    img.save(save_path)
    print(f"Image saved to {save_path}")
except Exception as e:
    print(f"Error: {e}")
    sys.exit(1)

