<script lang="ts">
	import { authClient } from '$lib/auth-client';

	const { signOut } = authClient;
	import { goto } from '$app/navigation';
	import { resolve } from '$app/paths';
	import { page } from '$app/state';

	const handleSignOut = async () => {
		await signOut();
		goto(resolve('/'));
	};
</script>

{#if page.data.user}
	<div class="account-menu">
		<p>{page.data.user.email}</p>
		<button class="sign-out-button" onclick={handleSignOut}>Sign Out</button>
	</div>
{/if}

<style>
	.account-menu {
		display: flex;
		flex-direction: column;
		gap: 1rem;
	}
</style>
