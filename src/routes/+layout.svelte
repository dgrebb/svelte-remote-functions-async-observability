<script lang="ts">
	import Header from '$lib/components/Header.svelte';

	import '@drop-in/graffiti';
	import '../lib/styles.css';
	import favicon from '$lib/assets/favicon.svg';
	import Navigation from '$lib/components/Navigation/Navigation.svelte';
	import AccountMenu from '$lib/components/AccountMenu/AccountMenu.svelte';
	import { page } from '$app/state';
	import { fade } from 'svelte/transition';

	let { children, data } = $props();

	let user: App.Locals['user'] = $derived(data?.user ?? null);
	let name = $derived(user?.name ?? 'Guest');

	// Get current pathname for key-based transitions
	const pathname = $derived(page.url.pathname);
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

<div class="container">
	<Header />
	<div class="page-wrapper">
		<p>Hello {name}</p>
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
