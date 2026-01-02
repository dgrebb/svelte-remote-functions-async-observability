import { building } from '$app/environment';
import { auth } from '$lib/auth';
import type { Handle } from '@sveltejs/kit';
import { sequence } from '@sveltejs/kit/hooks';
import { svelteKitHandler } from 'better-auth/svelte-kit';
import { withSpan } from '$lib/server/observability/withSpan';
import Logger from '$lib/utils/logger';
import { getRequestEvent } from '$app/server';

export const authHandle: Handle = async ({ resolve }) => {
	const event = getRequestEvent();
	const traceId = event.tracing.root?.spanContext().traceId;
	const logger = new Logger('[HOOKS]:[AUTH]');

	const authHandleResponse = await withSpan(
		'auth-handle',
		async () => {
			let response = null;
			response = await svelteKitHandler({
				event: getRequestEvent(),
				resolve,
				auth,
				building: building ?? false
			});
			logger.info('Auth handle successful');
			return response;
		},
		{
			'trace.id': traceId
		}
	);

	return authHandleResponse;
};

export const sessionHandle: Handle = async ({ event, resolve }) => {
	const traceId = event.tracing.root?.spanContext().traceId;
	const logger = new Logger('[HOOKS]:[SESSION]');

	if (traceId) {
		logger.info('Trace ID: ' + traceId);
	}

	const session = await auth.api.getSession({
		headers: event.request.headers
	});

	logger.info('Session handle successful: session.id: ' + session?.session.id);
	event.locals.user = session?.user;
	event.tracing.current.setAttribute('session.id', session?.session.id ?? 'unknown');
	const response = await resolve(event);
	return response;
};

export const observabilityHandle: Handle = async ({ event, resolve }) => {
	const logger = new Logger('[HOOKS]:[OBSERVABILITY]');
	const span = event.tracing.current;

	try {
		// request-level attrs
		span.setAttribute('http.method', event.request.method);
		span.setAttribute('url.path', event.url.pathname);

		const response = await resolve(event);

		// post-resolve attrs (session may have populated locals)
		span.setAttribute('http.status_code', response.status);
		span.setAttribute('user.id', event.locals.user?.id ?? 'unknown');

		// mark error by status (since we’re not throwing)
		if (response.status >= 500) span.setAttribute('error', true);

		logger.info('Observability handle complete');
		return response;
	} catch (error: unknown) {
		// Only log and trace errors: never impact UX
		span.setAttribute('error', true);
		logger.info('Observability handle failed. Unknown error:');
		logger.error(error);

		// Don’t throw; return the real response if possible
		return await resolve(event);
	}
};

// sequence is a function that takes an array of handles and returns a handle
// This is a great place to inject middleware like logging, authentication, etc.
export const handle: Handle = sequence(observabilityHandle, authHandle, sessionHandle);
