import { db } from '$lib/server/db';
import { post } from '$lib/server/db/schema';

export async function load() {
	const posts = await db.select().from(post);
	return { posts: posts ?? [] };
}
