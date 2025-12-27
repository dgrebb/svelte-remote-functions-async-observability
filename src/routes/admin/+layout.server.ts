import { eq } from 'drizzle-orm';
import { redirect } from '@sveltejs/kit';
import Logger from '$lib/utils/logger';
import { post } from '$lib/server/db/schema';
import { db } from '$lib/server/db';

const logger = new Logger('Admin Server Layout');

export async function load({ locals }: { locals: App.Locals }) {
	if (!locals.user?.id) {
		logger.info("User isn't logged in, redirecting");
		throw redirect(301, '/login');
	}

	const posts = await db.select().from(post).where(eq(post.authorId, locals.user.id));

	return { posts: posts ?? [] };
}
