import pandas as pd
df = pd.read_csv('output/tracked_coordinates.csv')
players = df[df['class'] == 'player']
print("Unique player track IDs:", players['track_id'].nunique())
print("Highest track ID:", players['track_id'].max())