"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.disconnectKafka = disconnectKafka;
exports.runKafka = runKafka;
const kafka_service_1 = __importDefault(require("./kafka.service"));
async function disconnectKafka() {
    await kafka_service_1.default.disconnectConsumer();
    await kafka_service_1.default.disconnectProducer();
}
async function runKafka() {
    await kafka_service_1.default.runConsumer();
}
exports.default = kafka_service_1.default;
