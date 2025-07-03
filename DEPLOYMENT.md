# GitHub Pages Deployment Checklist

Follow this checklist to deploy your P2L TV app to GitHub Pages:

## Prerequisites
- [ ] GitHub account
- [ ] Git installed locally
- [ ] Node.js 18+ installed
- [ ] Gemini API key from Google AI Studio

## Repository Setup
- [ ] Fork this repository OR create a new repository
- [ ] Clone the repository to your local machine
- [ ] Run `npm install` to install dependencies

## Configuration
- [ ] Run `npm run setup` and follow the prompts
- [ ] OR manually update `vite.config.ts` with your repository name
- [ ] Create `.env.local` with your Gemini API key

## GitHub Repository Settings
- [ ] Push your code to GitHub
- [ ] Go to repository Settings → Secrets and variables → Actions
- [ ] Add repository secret: `GEMINI_API_KEY` with your API key value
- [ ] Go to repository Settings → Pages
- [ ] Set Source to "GitHub Actions"

## Deployment
- [ ] Push to main branch (or create a pull request)
- [ ] Check Actions tab for deployment status
- [ ] Once deployed, visit `https://yourusername.github.io/your-repo-name/`

## Testing
- [ ] Verify the app loads correctly
- [ ] Test microphone permissions
- [ ] Test AI conversation functionality
- [ ] Check 3D visualizations work
- [ ] Test persona switching

## Troubleshooting
If deployment fails:
- [ ] Check GitHub Actions logs for errors
- [ ] Verify API key is correctly set in repository secrets
- [ ] Ensure base path in `vite.config.ts` matches repository name
- [ ] Check browser console for JavaScript errors

## Custom Domain (Optional)
- [ ] Add CNAME file to public folder with your domain
- [ ] Configure DNS records with your domain provider
- [ ] Update repository Pages settings with custom domain

## Updates
To update your deployed app:
- [ ] Make changes to your code
- [ ] Commit and push to main branch
- [ ] GitHub Actions will automatically redeploy
