<script lang="ts">
	import favicon from '$lib/assets/favicon.svg';
	import '../lib/styles.css';
	import Navigation from '$lib/components/Navigation.svelte';

	let { children } = $props();
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

<div class="container">
	<Navigation />
	{@render children()}
</div>
