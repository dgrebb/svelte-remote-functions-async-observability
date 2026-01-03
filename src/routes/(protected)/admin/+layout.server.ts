import { eq } from 'drizzle-orm';
import { redirect } from '@sveltejs/kit';
import Logger from '$lib/utils/logger';
import { post } from '$lib/server/db/schema';
import { db } from '$lib/server/db';

const logger = new Logger('/admin Server Layout');

export async function load({ url, locals }: { url: URL; locals: App.Locals }) {
	if (!locals.user?.id) {
		logger.info(`Error accessing ${url}. User isn't logged in, redirecting...`);
		redirect(301, '/login');
	}

	if (locals.user?.role !== 'admin') {
		logger.info(`Error accessing ${url}. User isn't an admin, redirecting...`);
		redirect(301, '/');
	} else {
		const posts = await db.select().from(post).where(eq(post.authorId, locals.user.id));
		return { posts: posts ?? [] };
	}
}
