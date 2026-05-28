# Description: Controls the physical mouse pointer and clicks on screen.
import argparse
import pyautogui

def main():
    parser = argparse.ArgumentParser(description="Controls the physical mouse pointer and clicks on screen.")
    parser.add_argument("x", type=int, help="X coordinate on the screen")
    parser.add_argument("y", type=int, help="Y coordinate on the screen")
    args = parser.parse_args()

    # Move smoothly to (x, y) over 1 second and click
    pyautogui.moveTo(args.x, args.y, duration=1.0)
    pyautogui.click()

if __name__ == "__main__":
    main()