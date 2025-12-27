<script lang="ts">
	import Logger from '$lib/utils/logger';

	interface Props {
		data: {
			posts: (typeof import('$lib/server/db/schema').post)[];
		};
	}

	const { data }: Props = $props();
	const posts = $derived(data?.posts ?? []);

	const logger = new Logger('Admin Page');

	logger.info('Admin Page');

	$effect(() => {
		logger.info(`Found ${posts.length} posts`);
	});
</script>

<h1>Admin</h1>

<h2>Your Posts</h2>

<ul>
	{#each posts as post}
		<li>
			<a href={`/admin/posts/${post.id}`}>{post.title}</a>
		</li>
	{/each}
</ul>
