<script lang="ts">
	import { authClient } from '$lib/auth-client';
	import { resolve } from '$app/paths';
	import Logger from '$lib/utils/logger';
	import { goto } from '$app/navigation';
	import { invalidateAll } from '$app/navigation';
	import { page } from '$app/state';

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

{#if user?.id}
	<div class="account-menu">
		<button class="logout-button" onclick={handleLogout}>Logout</button>
	</div>
{:else}
	<div class="account-menu">
		<a href={resolve('/login')}>Login</a>
		<a href={resolve('/sign-up')}>Sign Up</a>
	</div>
{/if}

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
