// src/instrumentation.server.ts
// SvelteKit automatically loads this file when instrumentation.server is enabled in svelte.config.js
import { NodeSDK } from '@opentelemetry/sdk-node';
import { getNodeAutoInstrumentations } from '@opentelemetry/auto-instrumentations-node';
// Look into client console logging with
// https://github.com/open-telemetry/opentelemetry-js/blob/main/examples/esm-http-ts/index.ts
import { OTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-proto';
import { createAddHookMessageChannel } from 'import-in-the-middle';

import { register } from 'node:module';

const { registerOptions } = createAddHookMessageChannel();
register('import-in-the-middle/hook.mjs', import.meta.url, registerOptions);

const sdk = new NodeSDK({
	serviceName: 'sveltekit',
	traceExporter: new OTLPTraceExporter({
		url: 'http://localhost:4318/v1/traces'
	}),
	instrumentations: [getNodeAutoInstrumentations()]
});

sdk.start();
