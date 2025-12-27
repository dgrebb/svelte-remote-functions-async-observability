<script lang="ts">
	import Logger from '$lib/utils/logger';

	const logger = new Logger('Home Page');

	const mockLoadData = async () => {
		await new Promise((resolve) => setTimeout(resolve, 1000));
		const data = {
			message: 'Hello, world!',
			timestamp: new Date().toISOString()
		};
		logger.info('Data loaded:', data);
		return data;
	};

	let data = $state<{ message: string; timestamp: string } | null>(null);

	logger.info('Welcome to the Home Page');
</script>

<h1>Welcome to the home page</h1>
<p>Where we can provide default content for the client side page</p>
{#await mockLoadData()}
	<p><em>while we...</em></p>
{:then data}
	<p>{data.message} at {data.timestamp}</p>
{:catch error: Error}
	<p>Error loading data: {error.message}</p>
{/await}
