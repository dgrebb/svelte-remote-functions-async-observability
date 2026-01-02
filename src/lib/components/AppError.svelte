<script lang="ts">
	import { isHttpError, error } from '@sveltejs/kit';
	import Logger from '$lib/utils/logger';

	interface Props {
		error: App.Error;
		retry?: () => void;
	}

	let { error: propsError, retry }: Props = $props();

	const logger = new Logger('App Error');

	$effect(() => {
		logger.info('Error: ' + propsError.message, {
			status: propsError.status ?? 500,
			traceId: propsError.traceId
		});
		error(propsError.status ?? 500, {
			message: propsError.message,
			traceId: propsError.traceId
		});
	});
</script>

<div class="error-container">
	<h1 class="text-2xl font-bold">Error {propsError.status ?? 500}</h1>
	<p class="text-sm text-gray-500">Error message: {propsError.message}</p>
	<p class="text-sm text-gray-500">Trace ID: {propsError.traceId ?? 'No trace ID'}</p>
	{#if retry}
		<button class="bg-primary text-white px-4 py-2 rounded-md" onclick={retry}>Retry</button>
	{/if}
</div>

<style>
	.error-container {
		display: flex;
		flex-direction: column;
		align-items: center;
		height: 100vh;
	}
</style>
