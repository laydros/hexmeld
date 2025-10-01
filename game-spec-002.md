You are building Hexmeld, a puzzle game, as a single-file HTML/JavaScript application using Canvas2D.

## Game Mechanics

Hexmeld is a turn-based puzzle game on a hexagonal grid:
- Grid: Hexagonal board (6 hexes per side, forming a larger hexagon shape) - roughly 91 total cells
- Colors: 6 starting colors (blue, yellow, red, bright green, orange, purple)
  - NOTE: Later functionality will add white and teal once player reaches certain turn count
- Win condition: None (high score game)
- Loss condition: Board fills completely

### Core Loop
1. Player clicks a ball to select it
2. Player clicks an empty cell to move the ball there
3. After move, check if 6+ same-colored balls form a connected group
4. If yes: remove group, increase score, DO NOT spawn new balls this turn
5. If no: spawn the 3 previewed balls in random empty cells
6. **After spawning, check if any of the newly spawned balls created 6+ groups and clear them (with score)**
7. Generate new preview of next 3 balls
8. Check if board is full → game over

### Rules
- Only move balls to empty cells
- Path between source/destination must exist through empty cells (A* or BFS pathfinding)
- Groups must be 6+ connected balls of same color (hex-adjacent)
- Score scales with group size: 6 balls = 6 points, 7 = 8 points, 8 = 11 points, etc. (roughly triangular numbers)
- After spawning balls, immediately check each spawned position for groups and clear them

## Visual Requirements

- Hexagonal grid in a hexagonal arrangement (like a honeycomb)
- Each hex cell should be clearly outlined
- Balls should be simple colored circles that fill most of the hex
- Selected ball should have a highlight/outline
- Score display at top
- **Preview display showing the next 3 balls to spawn (their colors)**
- "Game Over" message when board is full
- Clean, simple design - function over aesthetics

## Hex Grid Layout (CRITICAL)

**Orientation:** Flat-top hexagons
- Flat sides on top and bottom
- Points on left and right
- Like ⎔ not ⬢

**Column Offset Pattern (ESSENTIAL FOR PROPER ADJACENCY):**
- Even columns (0, 2, 4...): normal alignment
- Odd columns (1, 3, 5...): shifted DOWN by half a hex height
- This creates the proper honeycomb pattern where each hex touches 6 neighbors

**Example Layout (side view, 'o' = hex center):**
```
o   o   o   o   o     <- col 0, 2, 4... (even)
  o   o   o   o       <- col 1, 3, 5... (odd, offset down)
```

**Board Size:**
- Use a constant/variable for board radius (currently 6)
- Make it easy to change this value later
- For radius 6, creates roughly 91 hexagonal cells in hexagonal arrangement

## Colors

**Starting colors (use these exact values):**
- Blue: #0000FF or similar
- Yellow: #FFFF00 or similar
- Red: #FF0000 or similar
- Bright Green: #00FF00 or similar
- Orange: #FFA500 or similar
- Purple: #800080 or #FF00FF or similar

**Future colors (don't implement yet, just be aware):**
- White and Teal will be added based on turn count later

## Technical Requirements

- Single HTML file with embedded CSS and JavaScript
- Vanilla JavaScript (no frameworks)
- Canvas2D for rendering
- No external dependencies
- Should work in any modern browser

## Implementation Notes

**Hex Grid Layout:**
- Use offset coordinates (col, row) with odd-q or even-q offset (q = column)
- For rendering, calculate pixel position based on:
  - x = col * hexWidth * 0.75  (columns overlap by 25%)
  - y = row * hexHeight + (col % 2) * hexHeight/2
- Store grid as Map or object: `grid[key] = {color: int, occupied: bool}`
- Render hexagons using canvas polygon drawing (6 points, flat-top orientation)
- **Store board radius as a constant so it's easy to change**

**Hex Neighbors (for offset coordinates):**
For even columns (col % 2 == 0):
- (col-1, row), (col+1, row)  <- left and right
- (col-1, row-1), (col+1, row-1)  <- upper-left and upper-right
- (col, row-1), (col, row+1)  <- directly above and below

For odd columns (col % 2 == 1):
- (col-1, row), (col+1, row)  <- left and right
- (col, row-1), (col, row+1)  <- directly above and below
- (col-1, row+1), (col+1, row+1)  <- lower-left and lower-right

**Pathfinding:**
- A* or BFS on empty cells only
- Use hex neighbor logic above
- Don't allow moves through occupied cells

**Group Detection:**
- Flood fill algorithm using hex neighbors
- Start from moved ball position
- Only check same color
- **After spawning, check each of the 3 spawned positions for groups**
- Keep checking and clearing until no more groups form (chain reactions)

**Preview Logic:**
- Generate preview of 3 random colored balls at game start
- Display these colors in a preview area
- When spawning balls, use the previewed colors
- After spawning, generate new preview for next turn

**Spawn Logic:**
- Spawn the 3 balls from preview in random empty cells
- Only spawn after unsuccessful move (no group formed)
- **After spawning, check each spawned position for groups of 6+**
- **Clear any groups formed, update score, and repeat until no more groups**
- Game over if board fills before spawning

## Starting State

- Board radius = 6 (make this a constant)
- Generate 5-7 random balls at game start using starting colors
- Generate initial preview of 3 balls
- Rest of board is empty
- Score starts at 0

## File Structure

Single HTML file containing:
- HTML structure (canvas, score display, preview display)
- CSS (basic layout)
- JavaScript (all game logic)

## Acceptance Criteria

- Open HTML file → see hexagonal grid (6 hexes per side) with some colored balls and preview of next 3
- Click ball → it highlights
- Click valid empty cell → ball moves there (with proper pathfinding)
- Form 6+ group → balls disappear, score increases, no new balls spawn
- Don't form group → 3 previewed balls appear in random positions
- **If spawned balls create groups → those groups clear automatically with score**
- Preview updates to show next 3 balls
- Board fills → "Game Over" displayed, can refresh to restart

## Priority

1. Get hexagonal grid rendering working with PROPER OFFSET COLUMNS first (flat-top hexagons)
2. Add ball placement and clicking with specified colors
3. Add movement with pathfinding
4. Add group detection and scoring
5. Add spawn logic with preview
6. **Add post-spawn group detection and clearing**
7. Add game over detection

Keep it simple - no animations, no fancy effects, just working game logic and proper hex grid layout.
