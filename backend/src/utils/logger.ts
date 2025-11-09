// Simple logging utility
type LogLevel = 'info' | 'warn' | 'error' | 'debug' | 'success';

interface LogOptions {
  level: LogLevel;
  message: string;
  data?: any;
  timestamp?: boolean;
}

const colors = {
  info: '\x1b[36m',    // Cyan
  warn: '\x1b[33m',    // Yellow
  error: '\x1b[31m',   // Red
  debug: '\x1b[35m',   // Magenta
  success: '\x1b[32m', // Green
  reset: '\x1b[0m',
};

const icons = {
  info: 'ℹ️',
  warn: '⚠️',
  error: '❌',
  debug: '🔍',
  success: '✅',
};

function log(options: LogOptions) {
  const { level, message, data, timestamp = true } = options;
  const color = colors[level];
  const icon = icons[level];
  const time = timestamp ? `[${new Date().toISOString()}]` : '';
  
  console.log(`${color}${icon} ${time} ${message}${colors.reset}`);
  
  if (data) {
    console.log(JSON.stringify(data, null, 2));
  }
}

export const logger = {
  info: (message: string, data?: any) => log({ level: 'info', message, data }),
  warn: (message: string, data?: any) => log({ level: 'warn', message, data }),
  error: (message: string, data?: any) => log({ level: 'error', message, data }),
  debug: (message: string, data?: any) => log({ level: 'debug', message, data }),
  success: (message: string, data?: any) => log({ level: 'success', message, data }),
};

export default logger;

