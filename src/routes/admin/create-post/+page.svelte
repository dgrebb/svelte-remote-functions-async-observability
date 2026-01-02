<script lang="ts">
	import { createPost } from '../posts.remote';
</script>

<form {...createPost} oninput={() => createPost.validate()}>
	<label>
		Title:
		<input {...createPost.fields.title.as('text')} />
		{#each createPost.fields.title.issues() as issue (issue.message)}
			<p class="error">{issue.message}</p>
		{/each}
	</label>
	<label>
		Body:
		<textarea {...createPost.fields.body.as('text')} />
		{#each createPost.fields.body.issues() as issue (issue.message)}
			<p class="error">{issue.message}</p>
		{/each}
	</label>
	{#if createPost?.fields?.allIssues()?.length ?? 0 > 0}
		<div class="error-container show">
			{#each createPost?.fields?.allIssues() ?? [] as issue (issue.message)}
				<p class="error">{issue.message}</p>
			{/each}
		</div>
	{/if}
	<button type="submit">Create Post</button>
</form>

<style>
	form {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
	}
	label {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
	}
	input,
	textarea {
		padding: 0.5rem;
		border-radius: 0.5rem;
		border: 1px solid #ccc;
	}
	button {
		padding: 0.5rem;
		border-radius: 0.5rem;
		border: 1px solid #ccc;
	}
	.error {
		color: red;
	}
	.error-container {
		display: none;
		background-color: rgba(255, 0, 0, 0.5);
		backdrop-filter: blur(10px);
		flex-direction: column;
		gap: 0.5rem;
		padding: 0.5rem;
		border-radius: 0.5rem;
		border: 1px solid rgba(255, 0, 0, 0.5);
	}
	.error-container.show {
		display: flex;
	}
</style>
