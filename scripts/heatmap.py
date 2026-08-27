import pandas as pd
import matplotlib.pyplot as plt
import seaborn as sns

# Load the coordinates file from the pipeline step
df = pd.read_csv('output/tracked_coordinates.csv')

# Only care about players for a heatmap, not the ball
players = df[df['class'] == 'player'].dropna(subset=['team'])

# Filter out short-lived tracks (background people / misdetections) —
# a real player appears in many frames, a stray detection usually appears in just a few
frame_counts = players.groupby('track_id')['frame'].count()
total_frames = df['frame'].max()
real_players = frame_counts[frame_counts > total_frames * 0.15].index
players = players[players['track_id'].isin(real_players)]
print(f"Kept {players['track_id'].nunique()} track IDs out of {frame_counts.shape[0]} total")

# Filter out track IDs that barely moved (bench/coach/misdetection, not an actual player)
movement = players.groupby('track_id')[['court_x', 'court_y']].std().sum(axis=1)
real_movers = movement[movement > 3].index
players = players[players['track_id'].isin(real_movers)]

fig, axes = plt.subplots(1, 2, figsize=(14, 6))

for team_id in [0, 1]:
    ax = axes[team_id]
    team_data = players[players['team'] == team_id]

    if len(team_data) < 5:
        ax.set_title(f"Team {team_id} — not enough data")
        continue

    sns.kdeplot(
        x=team_data['court_x'],
        y=team_data['court_y'],
        fill=True,
        cmap='Reds' if team_id == 0 else 'Blues',
        levels=20,
        thresh=0.05,
        ax=ax
    )

    # Draw the key (your calibration reference rectangle) for spatial context
    ax.plot([0, 16, 16, 0, 0], [0, 0, 19, 19, 0], color='black', linewidth=1.5)

    ax.set_title(f"Team {team_id} — Positional Heatmap")
    ax.set_xlabel("Court X (ft)")
    ax.set_ylabel("Court Y (ft)")
    ax.invert_yaxis()
    ax.set_aspect('equal')

plt.tight_layout()
plt.savefig('output/heatmap.png', dpi=150)
print("Saved output/heatmap.png")
plt.show()