import App from './App.svelte';
import { inject } from '@vercel/analytics';

const app = new App({
	target: document.body,
});

// Initialize Vercel Analytics
inject();

export default app;