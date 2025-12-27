import { db } from '$lib/server/db';
import { eq } from 'drizzle-orm';
import { post } from '$lib/server/db/schema';

export async function load({ params }: { params: { postSlug: string } }) {
	const postData = await db.select().from(post).where(eq(post.slug, params.postSlug)).limit(1);
	if (postData?.[0]) {
		return { post: postData[0] ?? null };
	} else {
		return { post: null };
	}
}
