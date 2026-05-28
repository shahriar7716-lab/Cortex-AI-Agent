# Description: Converts an image to grayscale or resizes it.
import os
import sys
from PIL import Image

if len(sys.argv) < 4:
    print("Usage: python edit_image.py <action> <input_name> <output_name> [width] [height]")
    sys.exit(1)

action = sys.argv[1].lower()
input_name = sys.argv[2]
output_name = sys.argv[3]

desktop = os.path.join(os.path.join(os.environ['USERPROFILE']), 'Desktop')
input_path = os.path.join(desktop, input_name)
output_path = os.path.join(desktop, output_name)

if not os.path.exists(input_path):
    print(f"Error: Input file '{input_name}' not found on Desktop.")
    sys.exit(1)

try:
    img = Image.open(input_path)
    if action == "grayscale":
        edited_img = img.convert("L")
        edited_img.save(output_path)
        print(f"Successfully converted to grayscale and saved as {output_name}")
    elif action == "resize":
        if len(sys.argv) < 6:
            print("Error: Resize action requires width and height.")
            sys.exit(1)
        width = int(sys.argv[4])
        height = int(sys.argv[5])
        edited_img = img.resize((width, height))
        edited_img.save(output_path)
        print(f"Successfully resized to {width}x{height} and saved as {output_name}")
    else:
        print(f"Unknown action: {action}. Use 'grayscale' or 'resize'.")
        sys.exit(1)
except Exception as e:
    print(f"Error processing image: {e}")
    sys.exit(1)