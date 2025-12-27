import { building } from '$app/environment';
import { auth } from '$lib/auth';
import type { Handle } from '@sveltejs/kit';
import { sequence } from '@sveltejs/kit/hooks';
import { svelteKitHandler } from 'better-auth/svelte-kit';

export const authHandle: Handle = async ({ event, resolve }) => {
	return svelteKitHandler({
		event,
		resolve,
		auth,
		building: building ?? false
	});
};

export const START_HANDLE: Handle = async ({ event, resolve }) => {
	const response = await resolve(event);
	console.log('[HOOKS]:[SERVER]:[START]');
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
