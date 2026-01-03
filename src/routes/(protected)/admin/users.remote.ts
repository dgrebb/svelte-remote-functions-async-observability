import { resolve } from '$app/paths';
import { query } from '$app/server';
import { requireLogin } from '$lib/auth';
import { db } from '$lib/server/db';
import { withSpan } from '$lib/server/observability/withSpan';
import { redirect } from '@sveltejs/kit';
import { logger } from 'better-auth';

export const getAllUsers = query(async () => {
	return withSpan('rf:getAllUsers', async () => {
		const user = requireLogin();
		const isAdmin = user?.role === 'admin';
		if (!isAdmin) {
			logger.error('User is not an admin, redirecting to home');
			throw redirect(303, resolve('/'));
		}
		const users = await db.query.user.findMany();
		return users;
	});
});
