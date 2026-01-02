<script lang="ts">
	import { page } from '$app/state';
	import AppError from '$lib/components/AppError.svelte';
</script>

<AppError
	error={page.error && 'status' in page.error && 'message' in page.error
		? page.error
		: {
				status: page.status,
				message: page.error && 'message' in page.error ? page.error.message : 'Unknown error'
			}}
/>
