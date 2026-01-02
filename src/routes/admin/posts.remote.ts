import { query } from '$app/server';
import { db } from '$lib/server/db';
import { withSpan } from '$lib/server/observability/withSpan';

export const getAllPosts = query(async () => {
	return withSpan('rf:getAllPosts', async () => {
		const posts = await db.query.post.findMany();
		return posts;
	});
});
