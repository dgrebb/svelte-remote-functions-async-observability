<script lang="ts">
	import { page } from '$app/state';
	import { fade } from 'svelte/transition';
	import { fly } from 'svelte/transition';
	import type { RouteInfo } from '$lib/utils/routes';
	import NavItem from './NavItem.svelte';

	let { route }: { route: RouteInfo } = $props();

	const currentPath = $derived(page.url.pathname);

	function isActive(routePath: string): boolean {
		if (routePath === '/') {
			return currentPath === '/';
		}
		return currentPath === routePath || currentPath.startsWith(routePath + '/');
	}

	const hasActiveChild = $derived(route.children?.some((child) => isActive(child.path)) ?? false);
	const isRouteActive = $derived(isActive(route.path));
	const showDropdown = $derived((route.children?.length ?? 0) > 0);
</script>

<li class="nav-item" class:has-dropdown={showDropdown}>
	<a
		href={route.path}
		class="nav-link"
		class:active={isRouteActive}
		class:has-active-child={hasActiveChild}
		data-path={route.path}
	>
		<span class="nav-label" transition:fade={{ duration: 200 }}>
			{route.label}
		</span>
		{#if isRouteActive}
			<span class="nav-indicator" transition:fly={{ x: -10, duration: 300 }}></span>
		{/if}
		{#if showDropdown}
			<span class="dropdown-arrow">▼</span>
		{/if}
	</a>

	{#if showDropdown}
		<ul class="nav-dropdown">
			{#each route.children ?? [] as childRoute (childRoute.path)}
				<NavItem route={childRoute} />
			{/each}
		</ul>
	{/if}
</li>

<style>
	.nav-item {
		margin: 0;
		position: relative;

		&.has-dropdown:hover .dropdown-arrow {
			transform: rotate(180deg);
		}
	}

	.nav-item.has-dropdown {
		position: relative;
	}

	.nav-link {
		position: relative;
		display: block;
		align-items: center;
		gap: 0.5rem;
		padding: 0.5rem 1rem;
		color: #bebebe;
		text-decoration: none;
		border-radius: 0.375rem;
		transition: all 0.2s ease;
		font-weight: 500;
		margin: 0;
		&:hover {
			background-color: rgba(0, 0, 0, 0.05);
			color: #fff;
		}
		&.active {
			color: #0066cc;
			background-color: rgba(0, 102, 204, 0.1);
		}
		&.active:hover {
			background-color: rgba(0, 102, 204, 0.15);
		}

		&.has-active-child {
			color: #0066cc;
			font-weight: 600;
		}
	}

	.nav-label {
		display: inline-block;
		flex: 1;
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

	.dropdown-arrow {
		font-size: 0.75rem;
		transition: transform 0.2s ease;
		color: #666;
	}

	.nav-dropdown {
		list-style: none;
		margin: 0;
		padding: 0;
		display: none;
		opacity: 0;
		visibility: hidden;
		transition:
			opacity 0.15s ease,
			visibility 0.15s ease;
		position: absolute;
		top: 100%;
		left: 0;
		background-color: rgba(67, 67, 67, 0.5);
		backdrop-filter: blur(10px);
		border-radius: 0.375rem;
		box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
		min-width: 200px;
		z-index: 1000;
	}

	/* Show dropdown when hovering over parent nav-item OR the dropdown itself */
	.nav-item.has-dropdown:hover > .nav-dropdown,
	.nav-item.has-dropdown .nav-dropdown:hover {
		display: block;
		opacity: 1;
		visibility: visible;
	}

	/* Nested dropdowns - show when parent nav-item in dropdown is hovered */
	:global(.nav-dropdown .nav-item.has-dropdown:hover > .nav-dropdown) {
		display: block;
		opacity: 1;
		visibility: visible;
		left: 100%;
		top: 0;
		margin-left: 0.25rem;
	}

	/* Keep nested dropdown visible when hovering over it */
	:global(.nav-dropdown .nav-item.has-dropdown .nav-dropdown:hover) {
		display: block;
		opacity: 1;
		visibility: visible;
	}
</style>
