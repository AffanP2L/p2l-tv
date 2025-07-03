# 🚀 Quick Deployment Guide for GitHub Pages

## Prerequisites
- GitHub account
- Gemini API key from [Google AI Studio](https://aistudio.google.com/app/apikey)

## 📋 Step-by-Step Deployment

### 1. Prepare the Repository
1. **Fork or download** this repository
2. **Create a new repository** on GitHub (if you downloaded the files)
3. **Upload all files** to your GitHub repository

### 2. Configure for Your Repository
Edit `vite.config.ts` and change:
```typescript
const repoName = 'your-repo-name';
```
Replace `'your-repo-name'` with your actual GitHub repository name.

### 3. Set Up GitHub Repository
1. Go to your repository on GitHub
2. Navigate to **Settings** → **Secrets and variables** → **Actions**
3. Click **New repository secret**
4. Add:
   - **Name**: `GEMINI_API_KEY`
   - **Value**: Your Gemini API key

### 4. Enable GitHub Pages
1. In your repository, go to **Settings** → **Pages**
2. Under **Source**, select **GitHub Actions**
3. Save the changes

### 5. Deploy
1. **Push changes** to the `main` branch
2. GitHub Actions will automatically build and deploy
3. Your app will be available at: `https://yourusername.github.io/your-repo-name/`

## 🔧 Manual Setup (Alternative)

If you prefer to set up manually:

1. **Copy environment file**:
   ```bash
   copy .env.local.example .env.local
   ```

2. **Edit `.env.local`** and add your Gemini API key:
   ```
   GEMINI_API_KEY=your_actual_api_key_here
   ```

3. **Update `vite.config.ts`** with your repository name

4. **Test locally** (if Node.js is properly configured):
   ```bash
   npm install
   npm run dev
   ```

## 🎯 Features Ready for Deployment

✅ **Real-time AI audio conversation** with Google Gemini 2.5 Flash  
✅ **11 different AI personas** with unique personalities  
✅ **3D audio visualizations** with Three.js  
✅ **Modern glass-morphism UI** design  
✅ **Cross-platform compatibility** (desktop/mobile browsers)  
✅ **Automatic GitHub Pages deployment** via GitHub Actions  
✅ **Optimized build** with code splitting and performance features  

## 🌟 What You Get

- **Interactive AI Chat**: Talk to AI using your microphone
- **Visual Effects**: 3D sphere that reacts to audio
- **Multiple Personas**: Switch between different AI personalities
- **Professional UI**: Modern, responsive design
- **Fast Loading**: Optimized builds with chunked dependencies

## 🔍 Troubleshooting

**Build fails?**
- Check that `GEMINI_API_KEY` is correctly set in repository secrets
- Verify repository name matches in `vite.config.ts`

**App doesn't load?**
- Check browser console for errors
- Ensure HTTPS (required for microphone access)
- Verify GitHub Pages is enabled and set to "GitHub Actions"

**Microphone doesn't work?**
- Grant microphone permissions in browser
- Ensure site is served over HTTPS
- Check browser compatibility (modern browsers only)

## 🎉 You're All Set!

Once deployed, your P2L TV app will be live and ready for users to interact with AI through voice chat with beautiful 3D visualizations!
