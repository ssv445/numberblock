## **Project: Kids Number Blocks Game**

**Objective:** The goal of the game is for the user to create their desired combination of colored blocks on the grid. The user can then save this combination as an image.

**Tech Stack:**

- Next.js (App Router)
- React
- TypeScript
- Tailwind CSS

### **1. Project Setup**

- Already Initialized as new Next.js project with TypeScript, Tailwind, app router and src folder.

### Game Components:

**Grid:**

- Initial size: 5x5
- Dynamic expansion:
  - Grid expands by adding one row and one column when a block is placed such that the highest row or column index increases.
  - Grid size is always at least 5x5.
- Scrollable when content exceeds viewport

**Available Blocks:**

- Set of 10 colored blocks (defined in `src/types/game.ts`).
- Fixed colors.
- Each block instance gets a unique ID when selected from the palette.
- Blocks can be reused from the palette.

**Blocks Placed Counter:**

- Increments when a new block is placed from the palette.
- Decrements when a block is removed from the grid.

### Block Interactions:

**Selecting a Block:**

- Click on a block in the palette.
- A new block instance with a unique ID and the selected color is created and stored in the game state as the `selectedBlock`.
- Any previously `selectedBlock` state is overwritten.

**Placing a Block:**

- Requires a block to be selected (`selectedBlock` is not null).
- Click on an empty cell in the grid.
- The `selectedBlock` is placed into the clicked cell.
- The `selectedBlock` state is cleared (set to null).
- Grid expansion is checked and performed if necessary.
- Block counter increments.
- If the clicked cell is occupied:
  - Action is cancelled.
  - An error toast message appears.
  - The `selectedBlock` remains selected.

**Removing a Block:**

- Requires no block to be selected (`selectedBlock` is null).
- Click on a cell containing a block.
- The block in the clicked cell is removed (cell's block state set to null).
- Block counter decrements.

### Save Feature:

**Save as Image:**

- Captures the current grid state based on `maxRow` and `maxCol` (or `MIN_GRID_SIZE`).
- Includes:
  - All placed blocks with their colors.
  - Grid lines.
  - White background for empty cells.
  - Padding around the grid.
- Downloads as a PNG file named 'number-blocks.png'.

### Error Handling:

**Toast Notifications:**

- Shows when attempting to place a block on an occupied cell.
- Appears at the bottom center of the screen.
- Auto-dismisses after 2 seconds.
- Red background with white text.

### State Management:

**Game State (`GameState` in `src/types/game.ts`):**

- Tracks:
  - `selectedBlock`: The block currently selected from the palette (or null).
  - `placedBlocks`: The total count of blocks currently on the grid.
  - `grid`: A 2D array representing the grid cells and their contents (`Cell[][]`).
  - `maxRow`: The highest row index containing a block (-1 if empty).
  - `maxCol`: The highest column index containing a block (-1 if empty).
- Maintains unique block IDs (`uuidv4`) for placed blocks.
- Handles grid expansion state during placement.
