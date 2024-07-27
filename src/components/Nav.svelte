<script>
	import { LightSwitch } from '@skeletonlabs/skeleton';
	import ThemeToggle from './ThemeToggle.svelte';
	import Redirect from './Redirect.svelte'
</script>

<nav class="h-20 w-screen flex justify-between pr-2">
	<div>
		<a href="/"><img class="h-20 pointer-events-none" src="/logo.png" alt="logo" /></a>
	</div>

	<div class="flex items-center">
		<div>
			<Redirect/>
		</div>
	<div>
		<ThemeToggle/>
	</div>
	<div>
		<LightSwitch class="ml-5"/>
	</div>
	</div>
</nav>