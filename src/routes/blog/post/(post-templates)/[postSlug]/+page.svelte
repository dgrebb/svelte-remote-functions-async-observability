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

	$effect(() => {
		if (post) {
			logger.info(`Found post: ${post.title}`);
		} else {
			logger.info('No post found');
		}
	});
</script>

<h1>{post?.title}</h1>
<p>{post?.body}</p>
