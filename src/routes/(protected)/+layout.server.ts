import { redirect } from '@sveltejs/kit';
import Logger from '$lib/utils/logger';

const logger = new Logger('Protected Layout');

export async function load({ locals }: { locals: App.Locals }) {
	if (!locals.user?.id) {
		logger.info("User isn't logged in, redirecting");
		throw redirect(301, '/login');
	}
}
