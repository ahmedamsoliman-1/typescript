import { createLogger, format, transports } from 'winston';

const { combine, timestamp, printf, colorize } = format;

// Define custom format for log messages
const myFormat = printf(({ level, message, timestamp }) => {
    return `${timestamp} [${level}]: ${message}`;
});

// Create logger instance
const logger = createLogger({
    level: 'info', // Default log level
    format: combine(
        timestamp(),
        myFormat
    ),
    transports: [
        new transports.Console({
            format: combine(
                colorize(),
                timestamp(),
                myFormat
            )
        }),
        new transports.File({ filename: 'error.log', level: 'error' }),
        new transports.File({ filename: 'combined.log' })
    ]
});

export default logger;
