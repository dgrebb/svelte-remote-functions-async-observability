<script lang="ts">
	import { page } from '$app/state';
	import { getRoutes } from '$lib/utils/routes';
	import { fade } from 'svelte/transition';
	import { fly } from 'svelte/transition';
	import type { RouteInfo } from '$lib/utils/routes';

	// Get routes at build time
	const routes = getRoutes();

	// Reactive check for active route using Svelte 5 runes
	// Use $derived to reactively track the current pathname
	const currentPath = $derived(page.url.pathname);

	function isActive(routePath: string): boolean {
		// Exact match for root
		if (routePath === '/') {
			return currentPath === '/';
		}

		// Check if current path starts with route path
		return currentPath === routePath || currentPath.startsWith(routePath + '/');
	}
</script>

<nav class="navigation" aria-label="Main navigation">
	<ul class="nav-list">
		{#each routes as route (route.path)}
			<li class="nav-item">
				<a
					href={route.path}
					class="nav-link"
					class:active={isActive(route.path)}
					data-path={route.path}
				>
					<span class="nav-label" transition:fade={{ duration: 200 }}>
						{route.label}
					</span>
					{#if isActive(route.path)}
						<span class="nav-indicator" transition:fly={{ x: -10, duration: 300 }}></span>
					{/if}
				</a>
			</li>
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

	.nav-item {
		margin: 0;
	}

	.nav-link {
		position: relative;
		display: inline-flex;
		align-items: center;
		gap: 0.5rem;
		padding: 0.5rem 1rem;
		color: #333;
		text-decoration: none;
		border-radius: 0.375rem;
		transition: all 0.2s ease;
		font-weight: 500;
	}

	.nav-link:hover {
		background-color: rgba(0, 0, 0, 0.05);
		color: #000;
	}

	.nav-link.active {
		color: #0066cc;
		background-color: rgba(0, 102, 204, 0.1);
	}

	.nav-link.active:hover {
		background-color: rgba(0, 102, 204, 0.15);
	}

	.nav-label {
		display: inline-block;
	}

	.nav-indicator {
		position: absolute;
		left: 0;
		top: 50%;
		transform: translateY(-50%);
		width: 3px;
		height: 60%;
		background-color: #0066cc;
		border-radius: 0 2px 2px 0;
		opacity: 0.8;
	}

	/* Smooth transitions for active state changes */
	.nav-link {
		transition:
			background-color 0.2s ease,
			color 0.2s ease;
	}

	/* Responsive adjustments */
	@media (max-width: 640px) {
		.nav-list {
			flex-direction: column;
			gap: 0.25rem;
		}

		.nav-link {
			width: 100%;
			justify-content: flex-start;
		}
	}
</style>
