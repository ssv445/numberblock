# NumberBlocks Game

A simple web-based game built with Next.js where users can place colored blocks on an expandable grid and save their creations as an image.

**Live Demo:** [https://numberblock.vercel.app/](https://numberblock.vercel.app/)

## Inspiration

This game is inspired by the popular children's show 'Numberblocks', aiming to provide a simple digital canvas for kids (and adults!) to creatively explore patterns and designs reminiscent of the show's block characters.

## Tech Stack

- **Framework:** [Next.js](https://nextjs.org/) (App Router)
- **Language:** [TypeScript](https://www.typescriptlang.org/)
- **Styling:** [Tailwind CSS](https://tailwindcss.com/)
- **UI:** [React](https://reactjs.org/)
- **PWA:** [@ducanh2912/next-pwa](https://github.com/DuCanhGH/next-pwa)
- **Unique IDs:** [uuid](https://github.com/uuidjs/uuid)

## Features

- **Interactive Grid:** Place blocks on a grid that automatically expands as needed.
- **Block Palette:** Select from a predefined set of colors.
- **Place/Remove Blocks:** Click empty cells to place the selected block, click existing blocks to remove them.
- **Block Counter:** Tracks the total number of blocks on the grid.
- **Save as Image:** Download the current grid state as a PNG image.
- **Progressive Web App (PWA):** Installable on supported devices for an app-like experience.

## Getting Started

### Prerequisites

- Node.js (v18 or later recommended)
- npm or yarn

### Installation

1.  **Clone the repository:**
    ```bash
    git clone <repository-url>
    cd numberblock
    ```
2.  **Install dependencies:**
    ```bash
    npm install
    # or
    # yarn install
    ```

### Running the Development Server

Start the development server (with Turbopack for faster HMR):

```bash
npm run dev
# or
# yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

### Building for Production

To create an optimized production build:

```bash
npm run build
# or
# yarn build
```

### Starting the Production Server

To serve the production build:

```bash
npm start
# or
# yarn start
```

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
