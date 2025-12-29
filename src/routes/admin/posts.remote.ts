import { query } from '$app/server';
import { db } from '$lib/server/db';

export const getAllPosts = query(async () => {
	const posts = await db.query.post.findMany();
	return posts;
});
