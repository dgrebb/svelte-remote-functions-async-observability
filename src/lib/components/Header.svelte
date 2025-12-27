<script lang="ts">
	import Navigation from '$lib/components/Navigation/Navigation.svelte';
	import AccountMenu from '$lib/components/AccountMenu/AccountMenu.svelte';
</script>

<header class="header">
	<Navigation />
	<AccountMenu />
</header>

<style>
	.header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 0.75rem 1.5rem;
		background-color: rgba(33, 33, 33, 0.8);
		backdrop-filter: blur(20px);
		margin: 1rem 0;
		border-radius: 1.5rem;
		box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
	}
</style>
