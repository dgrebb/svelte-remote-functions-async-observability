<script lang="ts">
	import { getRoutes } from '$lib/utils/routes';
	import NavItem from './NavItem.svelte';

	// Get routes at build time (now returns hierarchical tree)
	const routes = getRoutes();
</script>

<nav class="navigation" aria-label="Main navigation">
	<ul class="nav-list">
		{#each routes as route (route.path)}
			<NavItem {route} />
		{/each}
	</ul>
</nav>

<style>
	.navigation {
		padding: 1rem 0;
		border-bottom: 1px solid rgba(0, 0, 0, 0.1);
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
