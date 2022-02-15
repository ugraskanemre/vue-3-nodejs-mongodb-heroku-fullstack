const winston = require("winston");
const config = require("../../config");
config();

const logger = winston.createLogger({
    level: 'info',
    format: winston.format.json(),
    defaultMeta: { service: 'user-service' },
    transports: [
        //new winston.transports.File({ filename: 'logs/user/error.log', level: 'error' }),
        //new winston.transports.File({ filename: 'logs/user/info.log', level: 'info' }),
        //new winston.transports.File({ filename: 'logs/user/combined.log' }),
        //new winston.transports.Console()
    ],
});

/*
if (process.env.NODE_ENV !== 'production') {
    logger.add(new winston.transports.Console({
        format: winston.format.simple(),
    }));
}*/

module.exports = logger;