import { defineConfig, loadEnv } from 'vite';

export default defineConfig(({ mode }: { mode: string }) => {
    const env = loadEnv(mode, '.', '');
    const isProd = mode === 'production';
    
    // 🔧 CHANGE THIS to your GitHub repository name
    // Example: if your repo is https://github.com/johndoe/my-ai-chat
    // then change 'your-repo-name' to 'my-ai-chat'
    const repoName = 'your-repo-name';
    
    return {
      base: isProd ? `/${repoName}/` : '/',
      define: {
        'process.env.API_KEY': JSON.stringify(env.GEMINI_API_KEY),
        'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY)
      },
      build: {
        outDir: 'dist',
        sourcemap: false,
        rollupOptions: {
          output: {
            manualChunks: {
              vendor: ['lit', '@google/genai'],
              three: ['three']
            }
          }
        }
      }
    };
});
