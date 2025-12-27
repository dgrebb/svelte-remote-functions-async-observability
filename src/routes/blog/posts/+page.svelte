<script lang="ts">
	interface Props {
		data: {
			posts: (typeof import('$lib/server/db/schema').post)[];
		};
	}

	const { data }: Props = $props();
	const posts = $derived(data?.posts ?? []);
</script>

<h1>Posts</h1>

<ul>
	{#each posts as post}
		<li>
			<a href={`/blog/post/${post.slug}`}>{post.title}</a>
		</li>
	{/each}
</ul>
