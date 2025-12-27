<script lang="ts">
	import { goto } from '$app/navigation';
	import { resolve } from '$app/paths';
	import { invalidateAll } from '$app/navigation';
	import { authClient } from '$lib/auth-client';
	import type { ErrorContext } from 'better-auth/client';

	const { signUp } = authClient;

	let form = $state({
		email: '',
		password: '',
		password_confirm: '',
		username: ''
	});

	let errorMessage = $state<string | null>(null);

	const handleSubmit = async (e: Event) => {
		e.preventDefault();

		const formData = new FormData(e.target as HTMLFormElement);
		const email = formData.get('email') as string;
		const username = formData.get('username') as string;
		const password = formData.get('password') as string;
		const passwordConfirm = formData.get('password_confirm') as string;

		if (password !== passwordConfirm) {
			errorMessage = 'Passwords do not match';
			return;
		}

		if (!email || !username || !password || !passwordConfirm) {
			errorMessage = 'All fields are required';
			return;
		}

		await signUp.email(
			{
				email,
				password,
				name: username
			},
			{
				onSuccess: async () => {
					await invalidateAll();
					goto(resolve('/'));
				},
				onError: (error: ErrorContext) => {
					errorMessage = error.error.message;
					console.error(error.error);
				}
			}
		);
	};
</script>

<h1>Sign Up</h1>

<form onsubmit={handleSubmit}>
	<label for="username">
		Username
		<input
			type="text"
			name="username"
			id="username"
			data-1pignore="true"
			bind:value={form.username}
		/>
	</label>
	<label for="email">
		Email
		<input type="email" name="email" id="email" data-1pignore="true" bind:value={form.email} />
	</label>
	<label for="password">
		Password
		<input
			type="password"
			name="password"
			id="password"
			data-1pignore="true"
			bind:value={form.password}
		/>
	</label>
	<label for="password_confirm">
		Confirm Password
		<input
			type="password"
			name="password_confirm"
			id="password_confirm"
			data-1pignore="true"
			bind:value={form.password_confirm}
		/>
	</label>

	{#if errorMessage}
		<p class="error">{errorMessage}</p>
	{/if}
	<button type="submit">Sign Up</button>
</form>

<style>
	form {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
		max-width: 300px;
	}
	label {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
	}
	.error {
		color: red;
	}
</style>
