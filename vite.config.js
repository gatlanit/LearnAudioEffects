import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { githubPagesSpa } from '@sctg/vite-plugin-github-pages-spa'; // ← correct import

export default defineConfig({
  base: '/LearnAudioEffects/',
  plugins: [
    react(),
    githubPagesSpa({ verbose: true }),  // or just githubPagesSpa()
  ],
});