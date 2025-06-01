# 🌙 Dreamcatcher - Emotional Journey Through Literature

A beautiful webapp that visualizes the emotional journey through books using interactive animations, color-coded emotions, and immersive storytelling.

![Dreamcatcher](./public/dreamcatcher.png)

## ✨ Features

- **Emotional Visualization**: Each paragraph is color-coded based on its dominant emotion (happiness, sadness, anger, fear, etc.)
- **Intensity Mapping**: Emotion levels (1-5) determine the vibrancy and glow effects
- **Timed Animations**: Paragraphs animate in the left panel every 3 seconds with stunning visual effects
- **Transfer Animation**: Seamless transition of paragraphs from the main view to the feed panel
- **Interactive Feed**: Right panel shows all processed paragraphs as clickable cards
- **Detailed Modal**: Click any paragraph card to view full content with emotion analysis
- **Dark Theme**: Beautiful dark interface with gradient backgrounds and blur effects
- **Responsive Design**: Works perfectly on desktop and mobile devices

## 🎨 Emotion Color Scheme

- **Happiness/Joy** - Emerald green glow
- **Sadness** - Blue tones
- **Anger/Frustration** - Red hues  
- **Fear/Anxiety** - Purple shades
- **Surprise** - Yellow/amber
- **Disgust** - Teal colors
- **Shame** - Pink tones
- **Curiosity** - Indigo blues

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ 
- Yarn package manager
- MongoDB Atlas account (optional - sample data provided)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd dreamcatcher
   ```

2. **Install dependencies**
   ```bash
   yarn install
   ```

3. **Set up environment variables**
   
   Create a `.env.local` file:
   ```bash
   # MongoDB Connection (Optional)
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/dreamcatcher?retryWrites=true&w=majority
   
   # For local MongoDB
   # MONGODB_URI=mongodb://localhost:27017/dreamcatcher
   ```

4. **Run the development server**
   ```bash
   yarn dev
   ```

5. **Open your browser**
   
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📊 MongoDB Schema

The webapp expects documents with the following structure:

```javascript
{
  "_id": ObjectId,
  "book": "Book Title",
  "paragraph_index": 1,
  "paragraph": "Full paragraph text...",
  "emotion": "happiness",
  "emotion_level": 4,
  "justification": "Explanation of why this emotion was chosen",
  "created_at": Date
}
```

## 🎯 Usage Without MongoDB

The app includes sample data from "The Great Gatsby" and will work perfectly without a MongoDB connection. Simply run the development server and enjoy the demo!

## 🔧 Tech Stack

- **Framework**: Next.js 15 with React 19
- **Styling**: Tailwind CSS 4
- **Animations**: Framer Motion
- **Database**: MongoDB with native driver
- **Build Tool**: Turbopack
- **Package Manager**: Yarn
- **Icons**: Lucide React

## 📁 Project Structure

```
src/
├── app/
│   ├── api/paragraphs/     # API routes for MongoDB
│   ├── globals.css         # Global styles and animations
│   ├── layout.tsx         # Root layout with header
│   └── page.tsx           # Main page component
├── components/
│   ├── Header.tsx         # App header with logo
│   ├── LeftPanel.tsx      # Main animation panel
│   ├── RightPanel.tsx     # Feed panel
│   ├── ParagraphCard.tsx  # Reusable card component
│   └── Modal.tsx          # Detailed view modal
├── lib/
│   ├── mongodb.ts         # Database connection
│   └── emotionColors.ts   # Color mapping utility
└── types/
    └── index.ts           # TypeScript interfaces
```

## 🎨 Customization

### Adding New Emotions

1. Update the `emotionColorMap` in `src/lib/emotionColors.ts`
2. Add appropriate Tailwind color classes
3. The system will automatically apply the new colors

### Modifying Animation Timing

Change the interval in `src/components/LeftPanel.tsx`:
```typescript
const interval = setInterval(() => {
    // Your timing here (currently 3000ms)
}, 3000);
```

## 🚀 Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Add your `MONGODB_URI` environment variable
4. Deploy!

### Other Platforms

The app can be deployed to any platform that supports Next.js:
- Netlify
- Railway
- DigitalOcean App Platform
- AWS Amplify

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📝 License

This project is open source and available under the [MIT License](LICENSE).

## 🙋‍♀️ Support

For questions or issues:
- Create an issue on GitHub
- Check the documentation
- Review the sample data format

---

**Dreamcatcher** - Experience literature through the lens of emotion 🌙✨
