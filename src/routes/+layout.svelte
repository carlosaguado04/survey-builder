<script>
	import '../app.postcss';
	import Nav from '../components/Nav.svelte';
	import { AppShell } from '@skeletonlabs/skeleton';
	import { theme } from '$lib/stores/theme';
	import { onMount } from 'svelte';



	// Highlight JS
	import hljs from 'highlight.js/lib/core';
	import 'highlight.js/styles/github-dark.css';
	import { storeHighlightJs } from '@skeletonlabs/skeleton';
	import xml from 'highlight.js/lib/languages/xml'; // for HTML
	import css from 'highlight.js/lib/languages/css';
	import javascript from 'highlight.js/lib/languages/javascript';
	import typescript from 'highlight.js/lib/languages/typescript';

	hljs.registerLanguage('xml', xml); // for HTML
	hljs.registerLanguage('css', css);
	hljs.registerLanguage('javascript', javascript);
	hljs.registerLanguage('typescript', typescript);
	storeHighlightJs.set(hljs);

	// Floating UI for Popups
	import { computePosition, autoUpdate, flip, shift, offset, arrow } from '@floating-ui/dom';
	import { storePopup } from '@skeletonlabs/skeleton';
	storePopup.set({ computePosition, autoUpdate, flip, shift, offset, arrow });

	function applyTheme(newTheme) {
		if (typeof document !== 'undefined') {
			document.body.setAttribute('data-theme', newTheme);
		}
	}

	$: applyTheme($theme);

	onMount(() => {
		applyTheme($theme);
	});
</script>
<svelte:head>
	<title>My SvelteKit App</title>
</svelte:head>

<AppShell>
	<main>
		<Nav/>
		<slot />
	</main>
</AppShell>
