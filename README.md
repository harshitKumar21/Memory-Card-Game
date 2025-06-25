# 🎮 Memory Card Game

A modern, responsive, and beautifully animated Memory Card Game built with Next.js, TypeScript, and Tailwind CSS. Features smooth card flip animations, multiple difficulty levels, scoring system, and dark/light mode support.

## ✨ Features

### Core Gameplay
- **4×4, 6×6, and 8×8 grid options** with adjustable difficulty levels
- **Smooth card flip animations** using CSS transforms and transitions
- **Match detection** with visual feedback for matched/unmatched pairs
- **Move counter** and **live timer** to track performance
- **New Game button** to shuffle and restart at any time

### Visual Design
- **Modern, sleek UI** inspired by Apple and Material You design principles
- **Glassmorphism effects** with backdrop blur and transparency
- **Animated gradient backgrounds** for a premium feel
- **Dark/Light mode toggle** with system preference detection
- **Responsive design** that works perfectly on desktop, tablet, and mobile
- **Smooth transitions** and hover effects throughout

### Advanced Features
- **Multiple difficulty levels**: Easy (4×4), Medium (6×6), Hard (8×8)
- **Scoring system** based on moves and time elapsed
- **Best score tracking** with localStorage persistence
- **Congratulations modal** with detailed game statistics
- **Accessibility features** including proper ARIA labels and keyboard support

### Technical Highlights
- **TypeScript** for type safety and better development experience
- **Next.js 14** with App Router for optimal performance
- **Tailwind CSS** for utility-first styling
- **Custom CSS animations** for card flips and transitions
- **Local storage** for persistent best score tracking
- **Responsive grid system** that adapts to different screen sizes

## 🎯 How to Play

1. **Choose your difficulty**: Select Easy (4×4), Medium (6×6), or Hard (8×8)
2. **Click cards to flip them**: Reveal the emoji underneath
3. **Find matching pairs**: When two cards match, they stay flipped
4. **Complete the game**: Match all pairs to win
5. **Beat your best score**: Try to complete the game in fewer moves and less time

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm, yarn, or pnpm

### Installation

1. Clone the repository:
\`\`\`bash
git clone <repository-url>
cd memory-card-game
\`\`\`

2. Install dependencies:
\`\`\`bash
npm install
# or
yarn install
# or
pnpm install
\`\`\`

3. Run the development server:
\`\`\`bash
npm run dev
# or
yarn dev
# or
pnpm dev
\`\`\`

4. Open [http://localhost:3000](http://localhost:3000) in your browser

### Building for Production

\`\`\`bash
npm run build
npm start
\`\`\`

## 🎨 Design Features

### Card Animations
- **3D flip effect** using CSS transforms
- **Smooth transitions** with easing functions
- **Hover effects** for better interactivity
- **Matched card highlighting** with subtle animations

### Color Scheme
- **Dynamic gradients** that change with theme
- **Glassmorphism** with backdrop blur effects
- **High contrast** for accessibility
- **Consistent color palette** throughout the app

### Responsive Design
- **Mobile-first approach** with progressive enhancement
- **Flexible grid system** that adapts to screen size
- **Touch-friendly** interface for mobile devices
- **Optimized typography** for all screen sizes

## 🏆 Scoring System

The scoring system rewards efficiency:
- **Base score**: 10,000 points
- **Time penalty**: -10 points per second
- **Move penalty**: -50 points per move
- **Best scores** are saved locally and persist between sessions

## 🔧 Technical Implementation

### State Management
- React hooks for local state management
- Custom hooks for game logic
- Efficient re-rendering with React.memo

### Performance Optimizations
- **Lazy loading** of components
- **Memoized callbacks** to prevent unnecessary re-renders
- **Optimized animations** using CSS transforms
- **Efficient grid rendering** with CSS Grid

### Accessibility
- **Semantic HTML** structure
- **ARIA labels** for screen readers
- **Keyboard navigation** support
- **High contrast** color schemes
- **Focus management** for better UX

## 📱 Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## 🚀 Deployment

This project is optimized for deployment on Vercel:

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Deploy with zero configuration

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new)

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

---

**Built with ❤️ using Next.js, TypeScript, and Tailwind CSS**
