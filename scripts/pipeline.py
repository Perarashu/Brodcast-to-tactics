import cv2
import numpy as np
import pandas as pd
from ultralytics import YOLO

# --- Load your saved calibration ---
homography_matrix = np.load('output/homography_matrix.npy')

# --- Load the model ---
model = YOLO('yolo26n.pt')
CONF = 0.3

# --- Run detection + tracking, frame by frame ---
# stream=True lets us process one frame at a time instead of loading everything into memory
results = model.track(
    source='data/clip.mp4',
    classes=[0, 32],  # 0 = person, 32 = sports ball
    persist=True,
    conf=CONF,
    stream=True,
    tracker='botsort_custom.yaml'
)

rows = []          # will hold (frame, track_id, class, pixel_x, pixel_y, court_x, court_y)
jersey_colors = []  # average color per player detection, for team clustering later
row_color_index = []  # maps each player row to its position in jersey_colors

frame_num = 0
for r in results:
    frame = r.orig_img
    if r.boxes is None or r.boxes.id is None:
        frame_num += 1
        continue

    boxes = r.boxes.xyxy.cpu().numpy()
    ids = r.boxes.id.cpu().numpy().astype(int)
    classes = r.boxes.cls.cpu().numpy().astype(int)

    for box, track_id, cls in zip(boxes, ids, classes):
        x1, y1, x2, y2 = box
        foot_x = (x1 + x2) / 2   # bottom-center of the box = roughly where their feet are
        foot_y = y2

        # Apply homography: pixel position -> real court position
        pixel_point = np.array([[[foot_x, foot_y]]], dtype='float32')
        court_point = cv2.perspectiveTransform(pixel_point, homography_matrix)
        court_x, court_y = court_point[0][0]

        class_name = 'player' if cls == 0 else 'ball'

        row = {
            'frame': frame_num,
            'track_id': int(track_id),
            'class': class_name,
            'pixel_x': float(foot_x),
            'pixel_y': float(foot_y),
            'court_x': float(court_x),
            'court_y': float(court_y),
            'team': None  # filled in after clustering, below
        }

        if class_name == 'player':
            # Crop the jersey area (top half of the box) and get its average color
            jersey_crop = frame[int(y1):int(y1 + (y2 - y1) * 0.5), int(x1):int(x2)]
            if jersey_crop.size > 0:
                avg_color = jersey_crop.reshape(-1, 3).mean(axis=0)
                jersey_colors.append(avg_color)
                row_color_index.append(len(rows))
            else:
                row_color_index.append(None)

        rows.append(row)

    frame_num += 1
    if frame_num % 30 == 0:
        print(f"Processed {frame_num} frames...")

print(f"Done tracking. {len(rows)} total detections across {frame_num} frames.")

# --- Team classification: cluster jersey colors into 2 teams ---
if len(jersey_colors) >= 2:
    jersey_colors = np.array(jersey_colors, dtype='float32')
    criteria = (cv2.TERM_CRITERIA_EPS + cv2.TERM_CRITERIA_MAX_ITER, 100, 0.2)
    _, labels, _ = cv2.kmeans(jersey_colors, 2, None, criteria, 10, cv2.KMEANS_RANDOM_CENTERS)

    for i, row_idx in enumerate(row_color_index):
        if row_idx is not None:
            rows[row_idx]['team'] = int(labels[i][0])

# --- Save everything to CSV ---
df = pd.DataFrame(rows)
df.to_csv('output/tracked_coordinates.csv', index=False)
print("Saved output/tracked_coordinates.csv")
print(df.head(10))