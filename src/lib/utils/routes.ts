/**
 * Utility to automatically discover routes from the routes folder
 * Handles:
 * - Route groups (folders in parentheses) - these are pathless
 * - Dynamic routes (e.g., [post-id])
 * - Static routes
 */

export interface RouteInfo {
	path: string;
	label: string;
	filePath: string;
	isDynamic: boolean;
}

/**
 * Get all routes from the routes folder
 * Uses Vite's glob import to discover +page.svelte files
 */
export function getRoutes(): RouteInfo[] {
	// Use Vite's glob import to find all +page.svelte files
	const pages = import.meta.glob('/src/routes/**/+page.svelte', { eager: false });

	return Object.keys(pages)
		.map((filePath) => {
			// Remove '/src/routes' prefix and '/+page.svelte' suffix
			let route = filePath.replace('/src/routes', '').replace('/+page.svelte', '');

			// Remove pathless route groups (folders in parentheses)
			route = route.replace(/\([^)]+\)\//g, '');

			// Normalize: ensure leading slash, remove trailing slash (except root)
			if (!route.startsWith('/')) {
				route = '/' + route;
			}
			if (route !== '/' && route.endsWith('/')) {
				route = route.slice(0, -1);
			}

			// Check if route has dynamic parameters
			const isDynamic = /\[.*?\]/.test(route);

			// Skip dynamic routes for navigation (they need specific params)
			if (isDynamic) {
				return null;
			}

			// Generate a human-readable label from the path
			const label = route === '/' 
				? 'Home' 
				: route
					.split('/')
					.filter(Boolean)
					.map((segment) => 
						segment
							.split('-')
							.map((word) => word.charAt(0).toUpperCase() + word.slice(1))
							.join(' ')
					)
					.join(' / ');

			return {
				path: route,
				label,
				filePath,
				isDynamic: false
			};
		})
		.filter((route): route is RouteInfo => route !== null)
		.sort((a, b) => {
			// Sort: root first, then alphabetically
			if (a.path === '/') return -1;
			if (b.path === '/') return 1;
			return a.path.localeCompare(b.path);
		});
}

