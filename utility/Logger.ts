import { createLogger, format, transports } from 'winston';

const { combine, timestamp, printf, colorize } = format;

// const myFormat = printf(({ level, message, timestamp, method }) => {
//     return `${timestamp} [${level}] ${method ? `[${method}]` : ''}: ${message}`;
// });
const myFormat = printf(({ level, message, timestamp, method }) => {
    const methodInfo = method ? `[${method}] ` : ''; // Include method if available
    return `${timestamp} [${level}] ${methodInfo}${message}`;
});


// Create logger instance
const logger = createLogger({
    level: 'info',
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
        new transports.File({ filename: 'logs/info.log', level: 'info' }),
        new transports.File({ filename: 'logs/warn.log', level: 'warn' }),
        new transports.File({ filename: 'logs/error.log', level: 'error' }),
        new transports.File({ filename: 'logs/combined.log' })
    ]
});


export default logger;
