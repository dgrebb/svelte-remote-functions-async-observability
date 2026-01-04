<script lang="ts">
	import { page } from '$app/state';

	interface Props {
		data: {
			posts: (typeof import('$lib/server/db/schema').post)[];
		};
	}

	const { data }: Props = $props();
	const posts = $derived(data?.posts ?? []);
</script>

<h1 style:view-transition-name="main-heading">Posts</h1>

<ul>
	{#each posts as post}
		<li>
			<a href={`/blog/post/${post.slug}`} style:view-transition-name={`heading-${post.id}`}
				>{post.title}</a
			>
		</li>
	{/each}
</ul>
