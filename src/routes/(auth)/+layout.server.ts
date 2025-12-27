import { redirect } from '@sveltejs/kit';
import Logger from '$lib/utils/logger';

const logger = new Logger('Auth Layout');

export async function load({ locals }: { locals: App.Locals }) {
	if (locals.user?.id) {
		logger.info('User is already logged in, redirecting to home');
		throw redirect(302, '/');
	}
}
