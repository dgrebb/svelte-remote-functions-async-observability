import { db } from '$lib/server/db';
import { post } from '$lib/server/db/schema';
import { withSpan } from '$lib/server/observability/withSpan';

export async function load() {
	return await withSpan('sl:blog:posts:load', async () => {
		const posts = await db.select().from(post);
		return {
			posts: posts ?? []
		};
	});
}
