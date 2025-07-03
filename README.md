# P2L TV - AI Live Audio Chat

> 🚀 **READY FOR GITHUB PAGES DEPLOYMENT** - All files configured and tested!

## 📋 Quick Deploy (3 Steps)

1. **Edit `vite.config.ts`** - Change repository name on line 8
2. **Upload to GitHub** - Create repo and upload all files  
3. **Configure GitHub** - Add API key secret, enable Pages

**📖 See `FINAL_CHECKLIST.md` for detailed step-by-step instructions**

---

A real-time AI audio chat application with 3D visualizations using Google's Gemini AI with live audio dialog capabilities.

## Features

- 🎙️ Real-time audio conversation with AI
- 🎭 Multiple AI personas to choose from
- 🌐 3D audio visualizations with Three.js
- 🎨 Modern glass-morphism UI design
- 🚀 Deployed on GitHub Pages

## Live Demo

Visit the live demo: [https://yourusername.github.io/p2l-tv/](https://yourusername.github.io/p2l-tv/)

## Local Development

**Prerequisites:** Node.js 18+ and npm

1. **Clone the repository:**
   ```bash
   git clone https://github.com/yourusername/p2l-tv.git
   cd p2l-tv
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set up environment variables:**
   ```bash
   cp .env.local.example .env.local
   ```
   Edit `.env.local` and add your Gemini API key:
   ```
   GEMINI_API_KEY=your_actual_api_key_here
   ```

4. **Run the development server:**
   ```bash
   npm run dev
   ```

5. **Open your browser:**
   Navigate to `http://localhost:5173`

## Deployment to GitHub Pages

### Automatic Deployment (Recommended)

1. **Fork this repository** to your GitHub account

2. **Set up the API key secret:**
   - Go to your repository settings
   - Navigate to "Secrets and variables" → "Actions"
   - Add a new repository secret:
     - Name: `GEMINI_API_KEY`
     - Value: Your actual Gemini API key

3. **Update the base URL:**
   - Edit `vite.config.ts`
   - Change `/p2l-tv/` to `/your-repository-name/` in the base configuration

4. **Enable GitHub Pages:**
   - Go to repository settings
   - Navigate to "Pages"
   - Set source to "GitHub Actions"

5. **Push to main branch:**
   The GitHub Action will automatically build and deploy your app.

### Manual Deployment

1. **Build the project:**
   ```bash
   npm run build
   ```

2. **Deploy the dist folder:**
   Upload the contents of the `dist` folder to your hosting provider.

## Getting a Gemini API Key

1. Visit [Google AI Studio](https://aistudio.google.com/)
2. Sign in with your Google account
3. Create a new API key
4. Copy the key and add it to your `.env.local` file

## Available Personas

The application includes several AI personas:
- **Default**: Standard AI assistant
- **Old TV GPT**: Retro television personality
- **WordPlay GPT**: Creative wordsmith
- **Ghost of Gods**: Mystical entity
- **Dakini.Ji**: Spiritual guide
- **Sugar.exe**: Tech-savvy AI
- **Various Bengali personas**: Specialized for Bengali language interactions

## Technology Stack

- **Frontend**: Lit (Web Components), TypeScript
- **3D Graphics**: Three.js with post-processing effects
- **AI**: Google Gemini 2.5 Flash with native audio dialog
- **Build Tool**: Vite
- **Deployment**: GitHub Pages with GitHub Actions

## Browser Requirements

- Modern browser with WebGL support
- Microphone access permissions
- AudioContext support

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## License

This project is licensed under the Apache 2.0 License - see the file headers for details.

## Troubleshooting

### Common Issues

1. **Microphone not working:**
   - Ensure microphone permissions are granted
   - Check browser compatibility
   - Try using HTTPS (required for microphone access)

2. **3D visualization not loading:**
   - Check WebGL support in your browser
   - Ensure the EXR texture file is accessible

3. **API errors:**
   - Verify your Gemini API key is correct
   - Check API quota and billing status
   - Ensure the API key has proper permissions

### Performance Tips

- The app works best on modern devices with hardware acceleration
- Consider reducing 3D complexity on lower-end devices
- Ensure stable internet connection for real-time audio

## Support

If you encounter any issues, please:
1. Check the browser console for errors
2. Verify your API key setup
3. Create an issue on GitHub with detailed information
