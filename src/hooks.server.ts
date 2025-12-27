import { building } from '$app/environment';
import { auth } from '$lib/auth';
import type { Handle } from '@sveltejs/kit';
import { sequence } from '@sveltejs/kit/hooks';
import { svelteKitHandler } from 'better-auth/svelte-kit';
import Logger from '$lib/utils/logger';

export const authHandle: Handle = async ({ event, resolve }) => {
	const logger = new Logger('[HOOKS]:[AUTH]');
	let response = null;
	logger.info('Starting auth handle');

	try {
		response = await svelteKitHandler({
			event,
			resolve,
			auth,
			building: building ?? false
		});
		logger.info('Auth handle successful');
		return response;
	} catch (error: unknown) {
		logger.error('Auth handle failed');
		const err = error as Error;
		logger.debug(
			`Error: ${err.message ?? 'Unknown error'}`,
			err.stack ? `Stack: ${err.stack}` : 'No stack trace available'
		);
		return new Response('Internal Server Error', { status: 500 });
	}
};

export const sessionHandle: Handle = async ({ event, resolve }) => {
	const logger = new Logger('[HOOKS]:[SESSION]');
	const session = await auth.api.getSession({
		headers: event.request.headers
	});

	logger.info('Session handle successful', session?.user);
	event.locals.user = session?.user;
	const response = await resolve(event);
	return response;
};

// sequence is a function that takes an array of handles and returns a handle
// This is a great place to inject middleware like logging, authentication, etc.
export const handle: Handle = sequence(authHandle, sessionHandle);
