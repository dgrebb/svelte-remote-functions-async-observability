import { db } from '$lib/server/db';
import { env } from '$env/dynamic/private';
import { betterAuth } from 'better-auth';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';
import { admin } from 'better-auth/plugins/admin';
import { getRequestEvent } from '$app/server';
import { redirect } from '@sveltejs/kit';

export const auth = betterAuth({
	secret: env.BETTER_AUTH_SECRET,
	emailAndPassword: {
		enabled: true
	},
	database: drizzleAdapter(db, {
		provider: 'pg'
	}),
	plugins: [admin()]
});

export function requireLogin() {
	const { locals, url } = getRequestEvent();

	if (!locals.user) {
		const redirectTo = url.pathname + url.search;
		const params = new URLSearchParams({ redirectTo });

		redirect(307, `/login?${params}`);
	}

	return locals.user;
}
