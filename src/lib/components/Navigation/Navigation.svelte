<script lang="ts">
	import { resolve } from '$app/paths';
	import { getRoutes } from '$lib/utils/routes';
	import NavItem from './NavItem.svelte';
	import { page } from '$app/state';

	const user: App.Locals['user'] = $derived(page.data?.user ?? null);

	// Get routes at build time (now returns hierarchical tree)
	const routes = getRoutes();
</script>

<nav class="navigation" aria-label="Main navigation">
	<ul class="nav-list">
		{#each routes as route (route.path)}
			<NavItem {route} />
		{/each}
		{#if user?.id}
			<NavItem
				route={{
					path: '/subscriptions',
					label: 'Subscriptions',
					filePath: '/(protected)/subscriptions/+page.svelte',
					isDynamic: false,
					children: []
				}}
			/>
		{/if}
	</ul>
</nav>

<style>
	.navigation {
		border-bottom: 1px solid rgba(0, 0, 0, 0.1);
		flex: 1;
		display: flex;
		justify-content: start;
		align-items: center;
	}

	.nav-list {
		display: flex;
		gap: 0.5rem;
		list-style: none;
		margin: 0;
		padding: 0;
		flex-wrap: wrap;
	}
	/* Responsive adjustments */
	@media (max-width: 640px) {
		.nav-list {
			flex-direction: column;
			gap: 0.25rem;
		}
	}
</style>
