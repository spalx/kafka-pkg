"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.kafkaLogger = exports.logger = void 0;
const winston_1 = __importDefault(require("winston"));
require("winston-daily-rotate-file");
const logger = winston_1.default.createLogger({
    format: winston_1.default.format.combine(winston_1.default.format.errors({ stack: true }), winston_1.default.format.timestamp(), // Add timestamps
    winston_1.default.format.printf(({ timestamp, level, message, stack }) => {
        return stack
            ? `[${timestamp}] ${level.toUpperCase()}: ${message}\n${stack}` // If error has stack, log it
            : `[${timestamp}] ${level.toUpperCase()}: ${message}`;
    })),
    transports: [
        // Write all logs to console
        new winston_1.default.transports.Console({
            format: winston_1.default.format.combine(winston_1.default.format.colorize(), // Add colors
            winston_1.default.format.simple()),
        }),
        // Write error logs to error.log
        new winston_1.default.transports.File({ filename: 'logs/error.log', level: 'error' }),
    ],
});
exports.logger = logger;
const kafkaLogger = winston_1.default.createLogger({
    format: winston_1.default.format.combine(winston_1.default.format.timestamp(), // Add timestamps
    winston_1.default.format.json() // Use JSON format for structured logs
    ),
    transports: [
        // Dedicated transport for Kafka logs
        new winston_1.default.transports.DailyRotateFile({
            filename: 'logs/kafka-%DATE%.log',
            datePattern: 'YYYY-MM-DD',
            zippedArchive: true,
            maxSize: '50m',
            maxFiles: '14d',
        }),
    ],
});
exports.kafkaLogger = kafkaLogger;
exports.default = logger;
