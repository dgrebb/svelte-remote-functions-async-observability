<script lang="ts">
	import Logger from '$lib/utils/logger';
	import { getAllPosts } from './posts.remote';

	const logger = new Logger('Admin Posts Page');
</script>

<h1>Admin</h1>

<h2>Your Posts</h2>

<ul>
	{#await getAllPosts()}
		<p>Loading your posts...</p>
	{:then posts}
		{#each posts as post}
			<li>
				<a href={`/admin/posts/${post.id}`}>{post.title}</a>
			</li>
		{/each}
	{:catch error}
		<li>Error: {error.message}</li>
	{/await}
</ul>
