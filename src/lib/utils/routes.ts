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
	children?: RouteInfo[];
}

/**
 * Get all routes from the routes folder
 * Uses Vite's glob import to discover +page.svelte files
 */
export function getRoutes(): RouteInfo[] {
	// Use Vite's glob import to find all +page.svelte files
	const pages = import.meta.glob('/src/routes/**/+page.svelte', { eager: false });

	// First, collect all routes
	const allRoutes = Object.keys(pages)
		.map((filePath) => {
			// Skip routes inside route groups (folders in parentheses) and all their sub-routes
			// Route groups are organizational only and shouldn't appear in navigation
			if (/\([^)]+\)/.test(filePath)) {
				return null;
			}

			// Remove '/src/routes' prefix and '/+page.svelte' suffix
			let route = filePath.replace('/src/routes', '').replace('/+page.svelte', '');

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

			// Generate a human-readable label from the last segment
			const segments = route.split('/').filter(Boolean);
			const lastSegment = segments[segments.length - 1] || '';
			const label =
				route === '/'
					? 'Home'
					: lastSegment
							.split('-')
							.map((word) => word.charAt(0).toUpperCase() + word.slice(1))
							.join(' ');

			return {
				path: route,
				label,
				filePath,
				isDynamic: false,
				children: []
			};
		})
		.filter((route): route is RouteInfo => route !== null);

	// Build hierarchical tree structure
	function buildTree(routes: RouteInfo[]): RouteInfo[] {
		const routeMap = new Map<string, RouteInfo>();
		const rootRoutes: RouteInfo[] = [];

		// First pass: create map of all routes
		for (const route of routes) {
			routeMap.set(route.path, { ...route, children: [] });
		}

		// Second pass: build parent-child relationships
		for (const route of routes) {
			const routeNode = routeMap.get(route.path)!;

			// Find parent route (longest matching path that's not the route itself)
			let parent: RouteInfo | null = null;
			let parentPath = '';

			for (const otherRoute of routes) {
				if (otherRoute.path === route.path) continue;

				// Check if this route is a child of otherRoute
				if (route.path.startsWith(otherRoute.path + '/')) {
					// This is a potential parent - check if it's the longest match
					if (otherRoute.path.length > parentPath.length) {
						parentPath = otherRoute.path;
						parent = routeMap.get(parentPath)!;
					}
				}
			}

			if (parent) {
				// Add as child of parent
				parent.children = parent.children || [];
				parent.children.push(routeNode);
			} else {
				// This is a root-level route
				rootRoutes.push(routeNode);
			}
		}

		// Recursively sort children
		function sortRoutes(routes: RouteInfo[]): RouteInfo[] {
			return routes
				.sort((a, b) => {
					if (a.path === '/') return -1;
					if (b.path === '/') return 1;
					return a.path.localeCompare(b.path);
				})
				.map((route) => ({
					...route,
					children: route.children ? sortRoutes(route.children) : []
				}));
		}

		return sortRoutes(rootRoutes);
	}

	return buildTree(allRoutes);
}
