<script lang="ts">
	import { goto } from '$app/navigation';
	import { resolve } from '$app/paths';
	import { invalidateAll } from '$app/navigation';
	import { authClient } from '$lib/auth-client';
	import type { ErrorContext } from 'better-auth/client';

	const { signIn } = authClient;

	let form = $state({
		email: '',
		password: ''
	});

	let errorMessage = $state<string | null>(null);

	const handleSubmit = async (e: Event) => {
		e.preventDefault();

		const formData = new FormData(e.target as HTMLFormElement);
		const email = formData.get('email') as string;
		const password = formData.get('password') as string;

		if (!email || !password) {
			errorMessage = 'All fields are required';
			return;
		}

		await signIn.email(
			{
				email,
				password
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

<h1 style:view-transition-name="main-heading">Login</h1>

<form onsubmit={handleSubmit}>
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
	{#if errorMessage}
		<p class="error">{errorMessage}</p>
	{/if}
	<button type="submit">Sign In</button>
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
