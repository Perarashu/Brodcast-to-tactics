from ultralytics import YOLO

# Load the pretrained YOLO26 model (nano version — smallest, fastest, good for a laptop)
# This auto-downloads yolo26n.pt the first time you run it
model = YOLO('yolo26n.pt')

# Run detection + tracking on your video
# classes=[0, 32] means: only look for "person" (0) and "sports ball" (32)
# persist=True keeps track IDs consistent across frames
# save=True saves an output video with boxes and IDs drawn on it
results = model.track(
    source='data/clip.mp4',
    classes=[0, 32],
    persist=True,
    save=True,
    conf=0.25 # only keep detections the model is at least 40% confident about
)

print("Done! Check the /runs/detect/track folder for your output video.")