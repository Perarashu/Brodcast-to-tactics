import pandas as pd
import networkx as nx
import matplotlib.pyplot as plt

df = pd.read_csv('output/tracked_coordinates.csv')
players = df[df['class'] == 'player'].dropna(subset=['team'])
# --- NEW: filter out short-lived tracks (background people / misdetections) ---
frame_counts = players.groupby('track_id')['frame'].count()
total_frames = df['frame'].max()
real_players = frame_counts[frame_counts > total_frames * 0.15].index
players = players[players['track_id'].isin(real_players)]
print(f"Kept {players['track_id'].nunique()} track IDs out of {frame_counts.shape[0]} total")
# --- end new section ---

ball = df[df['class'] == 'ball']

passes = []
current_holder = None

for frame in sorted(ball['frame'].unique()):
    ball_row = ball[ball['frame'] == frame]
    frame_players = players[players['frame'] == frame]
    if ball_row.empty or frame_players.empty:
        continue

    bx, by = ball_row.iloc[0][['court_x', 'court_y']]
    frame_players = frame_players.copy()
    frame_players['dist'] = ((frame_players['court_x'] - bx)**2 + (frame_players['court_y'] - by)**2)**0.5
    nearest = frame_players.loc[frame_players['dist'].idxmin()]

    if nearest['dist'] < 4:  # ball must be genuinely close to count as "possession" (feet)
        holder_id = int(nearest['track_id'])
        holder_team = nearest['team']

        if current_holder is not None and current_holder != holder_id:
            prev_team = players[players['track_id'] == current_holder]['team'].iloc[0]
            if prev_team == holder_team:  # only count same-team handoffs as passes
                passes.append((current_holder, holder_id))

        current_holder = holder_id

# Build the graph
G = nx.DiGraph()
for passer, receiver in passes:
    if G.has_edge(passer, receiver):
        G[passer][receiver]['weight'] += 1
    else:
        G.add_edge(passer, receiver, weight=1)

# Draw it
pos = nx.spring_layout(G, seed=42)
weights = [G[u][v]['weight'] * 1.5 for u, v in G.edges()]
plt.figure(figsize=(8, 8))
nx.draw(G, pos, with_labels=True, node_color='lightblue', node_size=1200,
        width=weights, arrowsize=20, font_weight='bold')
plt.title("Passing Network")
plt.savefig('output/passing_network.png', dpi=150)
print(f"Detected {len(passes)} passes")
print("Saved output/passing_network.png")
