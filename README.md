# FluxTogether[free]

A real-time AI image generation app powered by Together AI's FLUX model. Generate high-quality images in milliseconds with a simple and intuitive interface.

## Features

- **Real-time Image Generation**: Generate images in milliseconds using the FLUX.1-schnell-Free model
- **Customizable Settings**:
  - Adjust image dimensions (512px to 1024px)
  - Control generation steps (1-4 steps)
  - Toggle consistency mode for iterative improvements
- **Image History**: View and restore previous generations with their original settings
- **One-Click Download**: Easily download generated images

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Styling**: Tailwind CSS
- **State Management**: React Query
- **Image Generation**: Together AI (FLUX model)
- **Type Safety**: TypeScript + Zod

## Environment Variables

```bash
TOGETHER_API_KEY=your_together_api_key
```

## Getting Started

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file with your Together AI API key
4. Run the development server:
   ```bash
   npm run dev
   ```
5. Open [http://localhost:3000](http://localhost:3000) in your browser

## Usage

1. Enter a descriptive prompt for your desired image
2. Adjust image settings:
   - Width: Choose between 512px, 768px, or 1024px
   - Height: Choose between 512px, 768px, or 1024px
   - Steps: Select 1-4 steps (more steps = higher quality, slower generation)
   - Consistency Mode: Toggle on to maintain consistency between generations
3. Click "Generate Image"
4. Download or iterate on your generated images

## Credits

Powered by Shalabi
