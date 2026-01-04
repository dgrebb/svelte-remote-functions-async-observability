<script lang="ts">
	import { page } from '$app/state';
	import Logger from '$lib/utils/logger';

	interface Props {
		data: {
			post: typeof import('$lib/server/db/schema').post | null;
		};
	}

	const { data }: Props = $props();
	const post = $derived(data?.post ?? null);

	const logger = new Logger('Blog Post Page');

	logger.info(() => `Found post: ${post?.title ?? 'No post found'}`);
</script>

{#if post}
	<h1 style:view-transition-name={`heading-${post.id}`}>{post.title}</h1>
	{#if page.data.user?.role === 'admin'}
		<a href={`/admin/edit-post/${post.id}`}>Edit</a>
	{/if}
	<p>{post.body}</p>
{:else}
	<p>No post found</p>
{/if}
