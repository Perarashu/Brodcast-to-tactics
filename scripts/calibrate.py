import cv2
import numpy as np
import os

# Read just the first frame of your clip
cap = cv2.VideoCapture('data/clip.mp4')
ret, frame = cap.read()
cap.release()

if not ret:
    print("Couldn't read the video — check the path.")
    exit()

clicked_points = []

def click_event(event, x, y, flags, param):
    if event == cv2.EVENT_LBUTTONDOWN:
        clicked_points.append((x, y))
        print(f"Point {len(clicked_points)}: ({x}, {y})")
        cv2.circle(frame, (x, y), 6, (0, 0, 255), -1)
        cv2.imshow('Click 4 court points', frame)

cv2.imshow('Click 4 court points', frame)
cv2.setMouseCallback('Click 4 court points', click_event)
print("Click 4 points on the free-throw key, in this exact order:")
print("1) top-left corner  2) top-right corner  3) bottom-right corner  4) bottom-left corner")
print("Press any key once you've clicked all 4.")
cv2.waitKey(0)
cv2.destroyAllWindows()

if len(clicked_points) != 4:
    print(f"Need exactly 4 points, got {len(clicked_points)}. Run the script again.")
    exit()

# Real-world coordinates of the key, in feet (16ft wide x 19ft deep — same on NBA and modern FIBA courts)
# MUST be in the same order as you clicked: top-left, top-right, bottom-right, bottom-left
real_world_points = np.array([
    [0, 0],
    [16, 0],
    [16, 19],
    [0, 19]
], dtype='float32')

image_points = np.array(clicked_points, dtype='float32')

homography_matrix, _ = cv2.findHomography(image_points, real_world_points)

os.makedirs('output', exist_ok=True)
np.save('output/homography_matrix.npy', homography_matrix)

print("\nSaved to output/homography_matrix.npy")
print(homography_matrix)