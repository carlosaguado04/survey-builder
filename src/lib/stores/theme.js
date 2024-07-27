import {writable} from 'svelte/store';
import {browser} from '$app/environment';

const storedTheme = browser ? localStorage.getItem('theme') : null;

export const theme = writable(storedTheme || 'wintry');

theme.subscribe((value) => {
	if (browser) {
		localStorage.setItem('theme', value);
	}
});