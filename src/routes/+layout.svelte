<script lang="ts">
	import '@drop-in/graffiti';
	import '../lib/styles.css';
	import favicon from '$lib/assets/favicon.svg';
	import Navigation from '$lib/components/Navigation/Navigation.svelte';
	import AccountMenu from '$lib/components/AccountMenu/AccountMenu.svelte';
	import { page } from '$app/state';
	import { fade } from 'svelte/transition';

	let { children } = $props();

	// Get current pathname for key-based transitions
	const pathname = $derived(page.url.pathname);
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

<div class="container">
	<Navigation />
	<AccountMenu />
	<div class="page-wrapper">
		{#key pathname}
			<div
				class="page-content"
				in:fade={{ duration: 300, delay: 150 }}
				out:fade={{ duration: 300 }}
			>
				{@render children()}
			</div>
		{/key}
	</div>
</div>
