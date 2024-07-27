<script>  import { theme } from '$lib/stores/theme';
import { onMount } from 'svelte';

const themes = ['skeleton', 'modern', 'crimson', 'wintry'];

function changeTheme(event) {
	const newTheme = event.target.value;
	$theme = newTheme;
	applyTheme(newTheme);
}

function applyTheme(newTheme) {
	if (typeof document !== 'undefined') {
		document.body.setAttribute('data-theme', newTheme);
	}
}

onMount(() => {
	applyTheme($theme);
});
</script>  <select class="select" bind:value={$theme} on:change={changeTheme}>
	{#each themes as themeOption}
		<option value={themeOption}>
			{themeOption.charAt(0).toUpperCase() + themeOption.slice(1)}    </option>
	{/each}
</select>