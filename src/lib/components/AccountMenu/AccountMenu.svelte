<script lang="ts">
	import { authClient } from '$lib/auth-client';
	import { resolve } from '$app/paths';
	import Logger from '$lib/utils/logger';
	import { goto } from '$app/navigation';
	import { invalidateAll } from '$app/navigation';
	import { page } from '$app/state';
	import NavItem from '../Navigation/NavItem.svelte';

	const { signOut } = authClient;
	const logger = new Logger('Account Menu');

	// Use reactive page data - this updates when invalidateAll() is called
	const user = $derived(page.data?.user ?? null);

	const handleLogout = async () => {
		const result = await signOut();
		if (result?.data?.success) {
			logger.info('Signed out successfully');
			await invalidateAll();
			goto(resolve('/'));
		} else if (result?.error) {
			logger.error(result?.error?.message ?? 'Unknown error');
		}
	};
</script>

<nav class="navigation account-menu">
	<ul class="nav-list">
		{#if user?.id}
			{#if user?.role === 'admin'}
				<NavItem
					route={{
						path: '/admin',
						label: 'Admin',
						filePath: '/admin/+page.svelte',
						isDynamic: false,
						children: [
							{
								path: '/account/create-post',
								label: 'Create Post',
								filePath: '/account/create-post/+page.svelte',
								isDynamic: false,
								children: []
							}
						]
					}}
				/>
			{:else}
				<NavItem
					route={{
						path: '/account',
						label: 'Account',
						filePath: '/account/+page.svelte',
						isDynamic: false,
						children: [
							{
								path: '/account/create-post',
								label: 'Create Post',
								filePath: '/account/create-post/+page.svelte',
								isDynamic: false,
								children: []
							}
						]
					}}
				/>
			{/if}
			<li class="nav-item">
				<button class="nav-link logout-button" onclick={handleLogout}>Logout</button>
			</li>
		{:else}
			<NavItem
				route={{
					path: '/login',
					label: 'Login',
					filePath: '/(auth)/login/+page.svelte',
					isDynamic: false,
					children: []
				}}
			/>
			<NavItem
				route={{
					path: '/sign-up',
					label: 'Sign Up',
					filePath: '/(auth)/sign-up/+page.svelte',
					isDynamic: false,
					children: []
				}}
			/>
		{/if}
	</ul>
</nav>

<style>
	.account-menu {
		display: flex;
		gap: 1rem;
		align-items: center;
		justify-content: end;
	}
	.logout-button {
		background: none;
		border: none;
		color: #fff;
		cursor: pointer;
		padding: 0.5rem 1rem;
	}
</style>
