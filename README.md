# KIWIQASS - AI Workflow Assistant ([Screencast from 2025-06-17 01-03-42.webm](https://github.com/user-attachments/assets/c1b1fb66-23fa-475b-bfa3-dc01afc2422c))

A Human-in-the-Loop (HITL) interface for an AI teammate product that helps users create and manage workflows through natural language interaction.

## Features

- AI-powered workflow generation using OpenAI's GPT-4
- Natural language task description input
- Editable multi-step workflow generation
- Drag-and-drop step reordering using @dnd-kit
- Step editing and revision
- Workflow confirmation and execution
- Modern, responsive UI with Tailwind CSS
- Accessibility features
- Mobile-friendly design

## Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- OpenAI API key

## Installation

1. Clone the repository:

```bash
git clone https://github.com/yourusername/kiwiqass.git
cd kiwiqass
```

2. Install dependencies:

```bash
npm install
```

3. Create a `.env` file in the root directory and add your OpenAI API key:

```bash
VITE_OPENAI_API_KEY=your_api_key_here
```

## Development

Start the development server:

```bash
npm run dev
```

The application will be available at `http://localhost:5173`.

## Building for Production

Create a production build:

```bash
npm run build
```

Preview the production build:

```bash
npm run preview
```

## Project Structure

```
src/
├── assets/           # Static assets and images
├── components/       # React components
│   ├── App.tsx      # Main application component
│   └── ...          # Other component files
├── context/         # React context providers
├── services/        # External services
│   └── openai.ts    # OpenAI API integration
├── types/           # TypeScript type definitions
├── App.tsx          # Root component
├── main.tsx         # Application entry point
└── index.css        # Global styles
```

## Technologies Used

- React 18
- TypeScript
- Vite (Build Tool)
- Tailwind CSS
- @dnd-kit (Drag and Drop)
- OpenAI GPT-4 API
- Lucide React (Icons)

## Features in Detail

### AI Workflow Generation

- Uses OpenAI's GPT-4 to generate detailed workflows
- Converts natural language task descriptions into structured steps
- Each step includes title, description, and execution details

### Workflow Management

- Drag-and-drop reordering of steps using @dnd-kit
- Edit step details through a modal interface
- Delete or revise individual steps
- Final confirmation before execution

### User Interface

- Clean, modern design with Tailwind CSS
- Responsive layout for all screen sizes
- Loading states and animations
- Error handling and user feedback
- Accessible components and ARIA labels

## Development Scripts

- `npm run dev` - Start development server
- `npm run build` - Create production build
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint for code quality
