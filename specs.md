## **Project: Kids Number Blocks Game**

**Objective:** The goal of the game is for the user to create their desired combination of colored blocks on the grid. The user can then save this combination as an image or within the game.

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
  - Grid expands by adding one row and one column when:
    - A block is placed in the last row or column
    - The last row contains any blocks
    - The rightmost column contains any blocks
- Scrollable when content exceeds viewport
- Fixed left and top edges

**Available Blocks:**

- Set of 10 colored blocks
- Fixed colors
- Each block gets a unique ID when selected
- Blocks can be reused from the palette

**Blocks Placed Counter:**

- Increments when a new block is placed from palette
- Decrements when a block is picked up from grid
- Doesn't change when moving existing blocks

### Block Interactions:

**Selecting a Block:**

- Click on a block in the palette
- Block gets assigned a unique ID
- Previously selected block (if any) is deselected

**Placing a Block:**

- Click on an empty cell to place selected block
- If cell is occupied:
  - Action is cancelled
  - Error toast message appears
  - Selected block remains selected
- Grid expansion happens after successful placement

**Moving Blocks:**

- Click on a placed block to pick it up
  - Original position is stored
  - Block count decrements
- Click on empty cell to place it
  - Original position is cleared
  - Block count doesn't change
- Click on occupied cell shows error

### Save Feature:

**Save as Image:**

- Captures current grid state
- Includes:
  - All placed blocks with their colors
  - Grid lines
  - White background for empty cells
  - Padding around the grid
- Downloads as PNG file named 'number-blocks.png'

### Error Handling:

**Toast Notifications:**

- Shows when attempting to place on occupied cell
- Appears at bottom center of screen
- Auto-dismisses after 2 seconds
- Red background with white text

### State Management:

**Game State:**

- Tracks:
  - Currently selected block
  - Number of placed blocks
  - Grid configuration
  - Maximum used row/column
- Maintains block positions and colors
- Handles grid expansion state
