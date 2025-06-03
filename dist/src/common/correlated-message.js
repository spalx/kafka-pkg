"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendCorrelatedResponseViaKafka = sendCorrelatedResponseViaKafka;
exports.sendCorrelatedRequestViaKafka = sendCorrelatedRequestViaKafka;
exports.validateCorrelatedRequestDTO = validateCorrelatedRequestDTO;
exports.validateCorrelatedResponseDTO = validateCorrelatedResponseDTO;
const zod_1 = require("zod");
const kafka_1 = __importDefault(require("../services/kafka"));
const correlated_dto_1 = require("../types/correlated.dto");
function isErrorWithCode(error) {
    return (typeof error === 'object' &&
        error !== null &&
        Object.prototype.hasOwnProperty.call(error, 'code') &&
        typeof error.code === 'number');
}
async function sendCorrelatedResponseViaKafka(topic, data, error) {
    let errorMessage = '';
    let status = 0;
    if (error !== null) {
        errorMessage = error instanceof Error ? error.message : 'Internal Server Error';
        if (error instanceof zod_1.ZodError) {
            status = 400;
        }
        else if (isErrorWithCode(error)) {
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
    await kafka_1.default.sendMessage(topic, response);
}
async function sendCorrelatedRequestViaKafka(topic, data) {
    await kafka_1.default.sendMessage(topic, data);
}
function validateCorrelatedRequestDTO(data) {
    correlated_dto_1.CorrelatedRequestDTOSchema.parse(data);
}
function validateCorrelatedResponseDTO(data) {
    correlated_dto_1.CorrelatedResponseDTOSchema.parse(data);
}
