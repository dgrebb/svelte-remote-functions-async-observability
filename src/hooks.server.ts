import { building } from '$app/environment';
import { auth } from '$lib/auth';
import type { Handle } from '@sveltejs/kit';
import { sequence } from '@sveltejs/kit/hooks';
import { svelteKitHandler } from 'better-auth/svelte-kit';
import Logger from '$lib/utils/logger';

const logger = new Logger('[HOOKS]:[SERVER]');

export const authHandle: Handle = async ({ event, resolve }) => {
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

export const START_HANDLE: Handle = async ({ event, resolve }) => {
	const response = await resolve(event);
	logger.info('Starting start handle');
	return response;
};

export const END_HANDLE: Handle = async ({ event, resolve }) => {
	const response = await resolve(event);
	console.log('[HOOKS]:[SERVER]:[END]');
	return response;
};

// sequence is a function that takes an array of handles and returns a handle
// This is a great place to inject middleware like logging, authentication, etc.
export const handle: Handle = sequence(START_HANDLE, authHandle, END_HANDLE);
