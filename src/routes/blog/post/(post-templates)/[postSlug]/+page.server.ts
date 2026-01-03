import { db } from '$lib/server/db';
import { eq } from 'drizzle-orm';
import { post } from '$lib/server/db/schema';
import { withSpan } from '$lib/server/observability/withSpan';

export async function load({ params }: { params: { postSlug: string } }) {
	return await withSpan('sl:blog:post:load', async () => {
		const postData = await db.select().from(post).where(eq(post.slug, params.postSlug)).limit(1);
		if (postData?.[0]) {
			return { post: postData[0] ?? null };
		} else {
			return { post: null };
		}
	});
}
