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
		padding: 1rem;
	}
</style>
