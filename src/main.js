import App from './App.svelte';
import { dev } from '$app/environment';
import { inject } from '@vercel/analytics';

const app = new App({
	target: document.body,
});

// Initialize Vercel Analytics
inject({ mode: dev ? 'development' : 'production' });

export default app;