const winston = require('winston');

const errorPrinter = winston.format(info => {
    if (!info.error) return info;

    // Handle case where Error has no stack.
    const errorMsg = info.error.stack || info.error.toString();
    info.message += `\n${errorMsg}`;

    return info;
});

const logger = winston.createLogger({
    format: winston.format.combine(
        errorPrinter(),  
        winston.format.printf(info => `${info.level}: ${info.message}`)
    ),
    transports: [
        new winston.transports.Console()
    ]
});
module.exports = logger;