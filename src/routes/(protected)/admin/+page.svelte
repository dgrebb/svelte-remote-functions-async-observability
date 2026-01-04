<script lang="ts">
	import { resolve } from '$app/paths';
	import Logger from '$lib/utils/logger';
	import { getAllUsers } from './users.remote';
	import { page } from '$app/state';

	const logger = new Logger('Admin Posts Page');
</script>

<h1 style:view-transition-name="main-heading">Admin</h1>

<h2>Users</h2>

<ul>
	{#await getAllUsers()}
		<p>Loading users...</p>
	{:then users}
		{#each users as user}
			<li>{user.name}</li>
		{/each}
	{:catch error}
		<li>Error: {error.message}</li>
	{/await}
</ul>
