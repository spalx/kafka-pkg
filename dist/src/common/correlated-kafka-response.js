"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const zod_1 = require("zod");
const kafka_service_1 = __importDefault(require("../services/kafka.service"));
class CorrelatedKafkaResponse {
    constructor(topic) {
        this.topic = '';
        this.topic = topic;
    }
    async send(data, error) {
        let errorMessage = '';
        let status = 0;
        if (error !== null) {
            errorMessage = error instanceof Error ? error.message : 'Internal Server Error';
            if (error instanceof zod_1.ZodError) {
                status = 400;
            }
            else if (this.isErrorWithCode(error)) {
                status = error.code;
            }
            else {
                status = 500;
            }
        }
        const response = {
            correlation_id: data.correlation_id,
            request_id: data.request_id,
            data: data.data,
            status: status,
            error: errorMessage
        };
        await kafka_service_1.default.sendMessage(`did.${this.topic}`, response);
    }
    isErrorWithCode(error) {
        return (typeof error === 'object' &&
            error !== null &&
            Object.prototype.hasOwnProperty.call(error, 'code') &&
            typeof error.code === 'number');
    }
}
exports.default = CorrelatedKafkaResponse;
