export type LoggerType = 'info' | 'debug' | 'warn' | 'error';

// ANSI color codes for Node.js/server
const ANSI_COLORS = {
	reset: '\x1b[0m',
	info: '\x1b[36m', // Cyan
	debug: '\x1b[35m', // Magenta
	warn: '\x1b[33m', // Yellow
	error: '\x1b[31m', // Red,
	time: '\x1b[32m' // Green
};

// CSS styles for browser
const CSS_COLORS = {
	info: 'color: #00bcd4;', // Cyan
	debug: 'color: #9c27b0;', // Magenta
	warn: 'color: #ff9800;', // Orange
	error: 'color: #f44336;', // Red
	time: 'color: #4caf50;' // Green
};

// Detect if we're in a browser
const isBrowser = typeof window !== 'undefined';

const SYMBOLS: Record<LoggerType, string> = {
	info: 'ℹ',
	debug: '🐛',
	warn: '⚠',
	error: '❌'
};

type LogMethod = (...args: unknown[]) => void;

export default class Logger {
	prefix: string = `[LOGGER]]`;

	info!: LogMethod;
	debug!: LogMethod;
	warn!: LogMethod;
	error!: LogMethod;

	constructor(prefix: string) {
		this.prefix = prefix;

		// Dynamically create methods for each log type
		(['info', 'debug', 'warn', 'error'] as LoggerType[]).forEach((logType) => {
			(this[logType] as LogMethod) = (...args: unknown[]) => {
				this.log(logType, args);
			};
		});
	}

	log(logType: LoggerType, args: unknown[]) {
		const timestamp = new Date().toISOString();
		const symbol = SYMBOLS[logType];

		if (isBrowser) {
			// Browser: use CSS styling for prefix, then pass all args directly as separate arguments
			// This ensures objects/arrays are expandable in the console
			// Pass prefix/timestamp with styles, then all args (strings and objects) as separate arguments
			console[logType](
				`%c${symbol} ${this.prefix} %c${timestamp}`,
				CSS_COLORS[logType] + 'font-weight: bold;',
				CSS_COLORS.time,
				...args
			);
		} else {
			// Node.js: format strings, but pass objects/arrays directly for proper inspection
			const stringArgs: string[] = [];
			const objectArgs: unknown[] = [];

			args.forEach((arg) => {
				if (typeof arg === 'string') {
					stringArgs.push(arg);
				} else {
					objectArgs.push(arg);
				}
			});

			// Log prefix/timestamp with string args if any
			if (stringArgs.length > 0) {
				console[logType](
					`${ANSI_COLORS[logType]}${symbol} ${this.prefix}${ANSI_COLORS.reset} ${ANSI_COLORS.time}${timestamp}${ANSI_COLORS.reset} ${stringArgs.join(' ')}`
				);
			} else {
				console[logType](
					`${ANSI_COLORS[logType]}${symbol} ${this.prefix}${ANSI_COLORS.reset} ${ANSI_COLORS.time}${timestamp}${ANSI_COLORS.reset}`
				);
			}

			// Log objects/arrays separately for proper formatting
			if (objectArgs.length > 0) {
				objectArgs.forEach((arg) => {
					console[logType](arg);
				});
			}
		}
	}
}
