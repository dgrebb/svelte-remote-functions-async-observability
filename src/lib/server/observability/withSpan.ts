import { trace, SpanStatusCode } from '@opentelemetry/api';
import { env } from '$env/dynamic/public';

const tracer = trace.getTracer('sveltekit');

export async function withSpan<T>(
	name: string,
	fn: () => Promise<T>,
	attrs?: Record<string, string | number | boolean | undefined | null>
): Promise<T> {
	if (env.PUBLIC_OBSERVABILITY_ENABLED !== 'true') return fn();

	return await tracer.startActiveSpan(name, async (span) => {
		try {
			if (attrs) {
				for (const [k, v] of Object.entries(attrs)) {
					if (v === undefined || v === null) continue;
					span.setAttribute(k, v);
				}
			}
			const out = await fn();
			span.setStatus({ code: SpanStatusCode.OK });
			return out;
		} catch (e) {
			if (e instanceof Error) span.recordException(e);
			span.setStatus({ code: SpanStatusCode.ERROR });
			throw e;
		} finally {
			span.end();
		}
	});
}
