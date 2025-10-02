# Hexmeld Game Functional Specification

**Version:** 1.1
**Last Updated:** 2025-10-01

This document describes the complete game logic and mechanics for Hexmeld, a hexagonal puzzle game. It is intended to be implementation-agnostic, focusing solely on game behavior and rules.

---

## Game Overview

Hexmeld is a turn-based puzzle game played on a hexagonal grid where players move colored balls to form groups and score points.

- **Grid:** Hexagonal board with radius 6 (91 total cells in a hexagonal arrangement)
- **Colors:** 6-8 different ball colors (dynamically expands during gameplay)
- **Objective:** Score as many points as possible before the board fills
- **Win Condition:** None (high score game)
- **Loss Condition:** Board fills completely (no empty cells when attempting to spawn new balls)

---

## Core Game Loop

1. **Player selects a ball** by clicking/tapping it
2. **Player selects an empty cell** to move the ball to
3. **Pathfinding validation:** Check if a valid path exists through empty cells
   - If path exists: Move ball and proceed to step 4
   - If no path exists: Show invalid move feedback and return to step 1
4. **Increment turn counter** by 1
5. **Update available colors** (if turn threshold reached)
6. **Check for groups at destination:** Find all connected same-colored balls touching the destination cell
7. **If group of 6+ balls formed:**
   - Remove the group with animation
   - Add score based on group size
   - Check for chain reactions (new groups formed by removal)
   - Continue until no more groups form
   - DO NOT spawn new balls
   - Return to step 1
8. **If no group formed:**
   - Spawn the previewed balls in random empty cells
   - Check each spawned position for new groups of 6+
   - Remove any groups formed and add their score
   - Continue checking until no more groups form
   - Generate new preview for next turn
9. **Check game over:** If no empty cells remain, end game
10. **Return to step 1**

---

## Game State

### Initial State

- **Board size:** Radius 6 (constant)
- **Starting balls:** Exactly 5 balls placed randomly
- **Starting colors:** First 6 colors (indices 0-5)
- **Spawn count:** 3 balls per turn initially
- **Score:** 0
- **Turn counter:** 0
- **High score:** Loaded from persistent storage (or 0 if none saved)
- **Preview:** 3 random colored balls generated for first spawn

### Persistent State

The following state must be tracked throughout the game:

- `grid`: Map of occupied cells to ball colors
- `score`: Current score
- `turnCount`: Number of moves made
- `highScore`: Best score ever achieved (persisted across sessions)
- `availableColorCount`: Number of colors currently in play
- `preview`: Array of colors for next spawn
- `gameOver`: Boolean flag
- `selectedCell`: Currently selected ball (if any)

### Display Values

The game must display the following information to the player:

- Current score
- High score
- Turn count
- Number of filled cells
- Preview of next balls to spawn (their colors)
- Game over message (when applicable)

---

## Grid System

### Coordinate System

Uses **cube coordinates** (q, r, s) where:
- `q + r + s = 0` (cube coordinate constraint)
- Valid cells: `|q| ≤ 6`, `|r| ≤ 6`, `|s| ≤ 6`
- This creates a hexagonal board with radius 6

### Cell Key Format

Cells are identified by string keys: `"q,r"` (e.g., `"0,0"`, `"-2,3"`)

### Neighbor Calculation

Each hexagonal cell has exactly 6 neighbors (unless on board edge). For a cell at (q, r), neighbors are:
- (q+1, r), (q-1, r)
- (q, r+1), (q, r-1)
- (q+1, r-1), (q-1, r+1)

Only neighbors within the valid board range are considered.

---

## Color System

### Color Palette

The game uses 8 total colors, indexed 0-7:
0. Blue (#0000FF)
1. Yellow (#FFFF00)
2. Red (#FF0000)
3. Bright Green (#00FF00)
4. Orange (#FFA500)
5. Purple (#800080)
6. White (#FFFFFF)
7. Turquoise/Cyan (#00FFFF)

### Dynamic Color Expansion

Colors expand during gameplay based on turn count:

**Configuration:**
- Start: First 6 colors (0-5)
- After turn 20: Add 2 more colors (total: 8 colors, indices 0-7)

**Implementation Logic:**
```
availableColorCount = startingColors (6)
for each expansion in expansions:
    if turnCount >= expansion.afterTurn:
        availableColorCount += expansion.addColors
availableColorCount = min(availableColorCount, totalColors)
```

When generating new balls (preview or starting balls), only colors 0 through `availableColorCount - 1` are used.

---

## Spawn System

### Dynamic Spawn Count

The number of balls spawned per turn increases during gameplay:

**Configuration:**
- Turns 1-39: Spawn 3 balls per turn
- Turn 40+: Spawn 4 balls per turn

### Preview Generation

Before spawning, the game generates a preview showing which colors will spawn next turn:

1. Determine spawn count for **next turn** (not current turn)
2. Generate that many random colors from `[0, availableColorCount - 1]`
3. Display preview to player
4. When spawning, use the preview colors exactly

### Spawn Process

When spawning (triggered when player doesn't form a group):

1. Get list of all empty cells
2. If fewer empty cells than balls to spawn: **Game Over**
3. For each ball in preview:
   - Pick random empty cell (remove from empty list)
   - Place ball with previewed color
4. After all balls placed, check each spawned position for groups
5. Remove any groups found and add score
6. Repeat group checking until no more groups form (chain reactions)
7. Generate new preview for next turn
8. Check if board is full: if yes, **Game Over**

---

## Movement & Pathfinding

### Valid Moves

A ball can only move to an empty cell if:
1. The destination cell is empty
2. A path exists through empty cells only
3. The path connects source to destination via neighboring cells

### Pathfinding Algorithm

Use **BFS (Breadth-First Search)** to find the shortest path:

1. Start from source cell
2. Explore neighbors that are empty (not occupied by balls)
3. Track parent cells to reconstruct path
4. Stop when destination is reached or all reachable cells explored
5. Return path as array of cell keys, or null if no path exists

### Invalid Move Feedback

When player attempts an invalid move (no path exists):
- Show visual feedback indicating the move is blocked
- Do not consume a turn
- Keep the ball selected
- Player can try a different destination

---

## Group Detection & Scoring

### Group Formation

A group is a set of **connected same-colored balls**, where "connected" means adjacent hexagonally (touching via shared edges).

**Minimum group size:** 6 balls

### Group Detection Algorithm

Use **flood fill** to find all connected balls of the same color:

1. Start from a specific cell
2. Use BFS/DFS to explore neighbors
3. Only include neighbors with the same color
4. Return all cells in the connected component

### When to Check for Groups

Groups are checked at two specific times:

1. **After a move:** Check cells starting from the destination cell
2. **After spawning:** Check cells starting from each spawn position

### Group Removal

When a group of 6+ is found:

1. Calculate score for the group
2. Remove all balls in the group from the grid
3. Add score to total
4. Check for chain reactions (new groups formed by the removal)
5. Repeat until no more groups of 6+ exist

### Score Calculation

Score is based on group size using a triangular number progression:

| Group Size | Points | Formula |
|------------|--------|---------|
| 6 | 6 | 6 |
| 7 | 8 | 6 + 2 |
| 8 | 11 | 6 + 2 + 3 |
| 9 | 15 | 6 + 2 + 3 + 4 |
| 10 | 20 | 6 + 2 + 3 + 4 + 5 |

**General formula:**
```
score(n) = n + (n-6) × (n-5) / 2
```

Or equivalently:
```
score(n) = n + sum from i=2 to (n-5) of i
```

For n < 6: score = 0

### Chain Reactions

After removing a group, immediately check all cells on the board for new groups. This can create chains where removing one group causes balls to form new groups, which are then also removed.

Continue checking and removing until no groups of 6+ remain.

---

## Game Over

### Trigger Condition

Game ends when attempting to spawn balls but there are not enough empty cells to place all the balls in the preview.

### Game Over Process

1. Set `gameOver = true`
2. If `score > highScore`:
   - Update `highScore = score`
   - Save to persistent storage
3. Display game over message showing:
   - Final score
   - Final turn count
   - High score
4. Disable further input
5. Offer option to restart game

### High Score Persistence

The high score must be saved to persistent storage (localStorage, file, database, etc.) and loaded when the game initializes.

---

## Turn Counter

The turn counter tracks the number of moves made by the player:

- Starts at 0
- Increments by 1 each time a ball is successfully moved
- Invalid moves (no path) do NOT increment the turn counter
- Used to trigger color expansion and spawn count increases
- Displayed to player throughout the game

---

## Game Configuration

The following values control game difficulty and progression. They are configurable but have the specified defaults:

### Color Configuration
```
startingColors: 6
expansions: [
    { afterTurn: 20, addColors: 2 }
]
```

### Spawn Configuration
```
startingSpawnCount: 3
increases: [
    { afterTurn: 40, spawnCount: 4 }
]
```

### Board Configuration
```
boardRadius: 6
startingBalls: 5
minimumGroupSize: 6
```

---

## Edge Cases & Rules Clarifications

1. **Selecting a ball twice:** Clicking the same ball again keeps it selected (does not deselect)
2. **Selecting a different ball:** Clicking a different ball changes the selection to the new ball
3. **Moving to the same cell:** A ball cannot move to its own position (path would be just the source cell)
4. **Simultaneous groups:** If multiple groups form from a single spawn, all are removed
5. **Preview accuracy:** The preview must show exactly the colors that will spawn
6. **Spawn randomness:** Spawn positions are random; spawn colors are from the preview
7. **Empty board check timing:** Check for empty cells before spawning, not after group removal
8. **Turn increment timing:** Turn increments immediately after successful move, before group checking

---

## Implementation-Agnostic Requirements

Any implementation of Hexmeld must:

1. Accurately implement the hexagonal grid using cube coordinates
2. Use BFS for pathfinding through empty cells only
3. Use flood fill for group detection
4. Calculate scores using the specified triangular formula
5. Check for groups after moves and after spawns
6. Handle chain reactions by repeatedly checking for new groups
7. Expand colors at turn 20
8. Increase spawn count at turn 40
9. Track and display score, high score, turn count, and filled cells
10. Show preview of next balls to spawn
11. Persist high score across game sessions
12. Show feedback for invalid moves
13. End game when board fills before spawning

---

## Terminology

- **Cell:** A single hexagonal space on the board
- **Ball:** A colored game piece occupying a cell
- **Group:** Connected same-colored balls (6+ required to remove)
- **Move:** Transferring a ball from one cell to another
- **Turn:** One complete move action (increments turn counter)
- **Spawn:** Placing new balls on the board from the preview
- **Preview:** The colors of balls that will spawn next turn
- **Chain reaction:** Groups forming as a result of removing other groups
- **Path:** A sequence of connected empty cells from source to destination

---

## Summary of Changes from v1.0

This specification reflects the implemented game as of version 1.1.2:

- Added dynamic color expansion system (colors added at turn 20)
- Added dynamic spawn count increases (4 balls at turn 40)
- Specified exactly 5 starting balls (not 5-7 range)
- Added turn counter and high score tracking requirements
- Added filled cell count display requirement
- Added invalid move feedback requirement
- Clarified preview generation looks ahead to next turn's spawn count
- Removed all implementation details (Canvas2D, HTML, CSS, rendering)
- Focused purely on game logic, rules, and state management
