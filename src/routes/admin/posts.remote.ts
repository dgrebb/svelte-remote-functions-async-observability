import { resolve } from '$app/paths';
import { form, getRequestEvent, query } from '$app/server';
import { auth } from '$lib/auth';
import { db } from '$lib/server/db';
import { post } from '$lib/server/db/schema';
import { withSpan } from '$lib/server/observability/withSpan';
import { redirect } from '@sveltejs/kit';
import * as v from 'valibot';

export const getAllPosts = query(async () => {
	return withSpan('rf:getAllPosts', async () => {
		const posts = await db.query.post.findMany();
		return posts;
	});
});

export const createPost = form(
	v.object(
		{
			title: v.pipe(v.string(), v.nonEmpty('Title is required')),
			body: v.pipe(v.string(), v.nonEmpty('Body is required'))
		},
		'Create Post'
	),
	async ({ title, body }) => {
		const event = getRequestEvent();
		return withSpan('rf:createPost', async () => {
			const session = await auth.api.getSession({
				headers: event.request.headers
			});
			const authorId = session?.user?.id;
			if (!authorId) throw redirect(303, resolve('/login'));
			const slug = title.toLowerCase().replace(/ /g, '-');
			await db.insert(post).values({ title, slug, body, authorId });
			redirect(303, resolve('/admin'));
		});
	}
);
