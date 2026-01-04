<script lang="ts">
	import { page } from '$app/state';
	import { getPostById, updatePost } from '../../posts.remote';
	import AppError from '$lib/components/AppError.svelte';
	import { goto } from '$app/navigation';
	import { resolve } from '$app/paths';
</script>

<svelte:boundary>
	{#await getPostById(page.params.id!)}
		<p>Loading post...</p>
	{:then post}
		<h1 style:view-transition-name="main-heading">Edit Post</h1>
		{#if (post && page.data.user?.id === post.authorId) || page.data.user?.role === 'admin'}
			<form {...updatePost} oninput={() => updatePost.validate()}>
				<input type="hidden" {...updatePost.fields.id.as('text')} value={post?.id} />
				<label>
					Title:
					<input {...updatePost.fields.title.as('text')} value={post?.title ?? ''} />
					{#each updatePost.fields.title.issues() as issue (issue.message)}
						<p class="error">{issue.message}</p>
					{/each}
				</label>
				<label>
					Body:
					<textarea {...updatePost.fields.body.as('text')}>{post?.body ?? ''}</textarea>
					{#each updatePost.fields.body.issues() as issue (issue.message)}
						<p class="error">{issue.message}</p>
					{/each}
				</label>
				{#if updatePost?.fields?.allIssues()?.length ?? 0 > 0}
					<div class="error-container show">
						{#each updatePost?.fields?.allIssues() ?? [] as issue (issue.message)}
							<p class="error">{issue.message}</p>
						{/each}
					</div>
				{/if}
				<button
					type="button"
					onclick={() =>
						post?.slug
							? goto(resolve(`/blog/post/${post.slug}`))
							: goto(resolve('/account/create-post'))}>Cancel</button
				>
				<button type="submit">Update Post</button>
			</form>
		{/if}
	{:catch error}
		<AppError {error} />
	{/await}
</svelte:boundary>
