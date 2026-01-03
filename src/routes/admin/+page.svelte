<script lang="ts">
	import { resolve } from '$app/paths';
	import Logger from '$lib/utils/logger';
	import { getAllUserPosts } from './posts.remote';

	const logger = new Logger('Admin Posts Page');
</script>

<h1>Admin</h1>

<h2>Your Posts</h2>

<a href={resolve('/admin/create-post')}>Create New Post</a>

<ul>
	{#await getAllUserPosts()}
		<p>Loading your posts...</p>
	{:then posts}
		{#each posts as post}
			<li>
				<a href={`/blog/post/${post.slug}`}>{post.title}</a>
				<a href={`/admin/edit-post/${post.id}`}>Edit</a>
			</li>
		{/each}
	{:catch error}
		<li>Error: {error.message}</li>
	{/await}
</ul>
