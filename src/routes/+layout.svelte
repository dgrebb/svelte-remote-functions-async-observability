<script lang="ts">
	import Header from '$lib/components/Header.svelte';

	import '@drop-in/graffiti';
	import '../lib/styles.css';
	import favicon from '$lib/assets/favicon.svg';
	import Navigation from '$lib/components/Navigation/Navigation.svelte';
	import AccountMenu from '$lib/components/AccountMenu/AccountMenu.svelte';
	import { page } from '$app/state';
	import { fade } from 'svelte/transition';
	import { onNavigate } from '$app/navigation';
	import Logger from '$lib/utils/logger';

	const logger = new Logger('Main Layout');

	let { children, data } = $props();

	let user: App.Locals['user'] = $derived(data?.user ?? null);
	let name = $derived(user?.name ?? 'Guest');

	// Get current pathname for key-based transitions
	const pathname = $derived(page.url.pathname);

	onNavigate((navigate) => {
		if (!document.startViewTransition) return;
		logger.info(`Starting view transition to: ${pathname}`);

		return new Promise((resolve) => {
			document.startViewTransition(async () => {
				resolve();
				logger.info(`View transition completed to: ${pathname}`);
				await navigate.complete;
			});
		});
	});
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

<div class="container">
	<Header />
	<div class="page-wrapper">
		<p>Hello {name}</p>
		<div class="page-content" in:fade={{ duration: 300, delay: 150 }} out:fade={{ duration: 300 }}>
			{@render children()}
		</div>
	</div>
</div>
