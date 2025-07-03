#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

async function setup() {
  console.log('🚀 P2L TV GitHub Pages Setup');
  console.log('==============================');
  
  // Get repository name
  const repoName = await new Promise((resolve) => {
    rl.question('Enter your GitHub repository name (e.g., p2l-tv): ', resolve);
  });
  
  // Get API key
  const apiKey = await new Promise((resolve) => {
    rl.question('Enter your Gemini API key (or press Enter to skip): ', resolve);
  });
  
  // Update vite config with correct base path
  const viteConfigPath = path.join(__dirname, 'vite.config.ts');
  let viteConfig = fs.readFileSync(viteConfigPath, 'utf8');
  viteConfig = viteConfig.replace('/p2l-tv/', `/${repoName}/`);
  fs.writeFileSync(viteConfigPath, viteConfig);
  console.log(`✅ Updated vite.config.ts with base path: /${repoName}/`);
  
  // Create .env.local if API key provided
  if (apiKey.trim()) {
    const envContent = `GEMINI_API_KEY=${apiKey.trim()}`;
    fs.writeFileSync(path.join(__dirname, '.env.local'), envContent);
    console.log('✅ Created .env.local with your API key');
  }
  
  // Update README with correct repository name
  const readmePath = path.join(__dirname, 'README.md');
  let readme = fs.readFileSync(readmePath, 'utf8');
  readme = readme.replace(/yourusername\/p2l-tv/g, `yourusername/${repoName}`);
  readme = readme.replace(/\/p2l-tv\//g, `/${repoName}/`);
  fs.writeFileSync(readmePath, readme);
  console.log('✅ Updated README.md with your repository name');
  
  console.log('\n🎉 Setup complete!');
  console.log('\nNext steps:');
  console.log('1. Push your code to GitHub');
  console.log('2. Add GEMINI_API_KEY to your repository secrets');
  console.log('3. Enable GitHub Pages with GitHub Actions source');
  console.log('4. Your app will be available at: https://yourusername.github.io/' + repoName + '/');
  
  rl.close();
}

setup().catch(console.error);
