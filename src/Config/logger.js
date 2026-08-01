import winston from "winston";

const { combine, timestamp, printf, colorize, errors } = winston.format;

const devFormat = combine(
  colorize(),
  timestamp({ format: "HH:mm:ss" }),
  errors({ stack: true }),
  printf(({ level, message, timestamp, stack, requestId }) => {
    const rid = requestId ? ` [${requestId}]` : "";
    return `${timestamp}${rid} ${level}: ${stack || message}`;
  })
);

const prodFormat = combine(
  timestamp(),
  errors({ stack: true }),
  winston.format.json()
);

const isDev = process.env.NODE_ENV !== "production";

const logger = winston.createLogger({
  level: isDev ? "debug" : "info",
  format: isDev ? devFormat : prodFormat,
  transports: [
    new winston.transports.Console(),
  ],
});

// HTTP access logger (used with Morgan)
export const accessLogStream = {
  write: (message) => logger.http(message.trim()),
};

export default logger;
