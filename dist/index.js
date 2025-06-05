"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CorrelatedKafkaResponse = exports.CorrelatedKafkaRequest = exports.kafkaService = void 0;
const app_hook_pkg_1 = require("app-hook-pkg");
const kafka_service_1 = __importDefault(require("./src/services/kafka.service"));
exports.kafkaService = kafka_service_1.default;
app_hook_pkg_1.appHookService.hookOn(app_hook_pkg_1.AppCycleEvent.Init, async () => {
    await kafka_service_1.default.connectProducer();
    await kafka_service_1.default.connectConsumer();
}, false);
app_hook_pkg_1.appHookService.hookOn(app_hook_pkg_1.AppCycleEvent.Shutdown, async () => {
    await kafka_service_1.default.disconnectProducer();
    await kafka_service_1.default.disconnectConsumer();
}, false);
var correlated_kafka_request_1 = require("./src/common/correlated-kafka-request");
Object.defineProperty(exports, "CorrelatedKafkaRequest", { enumerable: true, get: function () { return __importDefault(correlated_kafka_request_1).default; } });
var correlated_kafka_response_1 = require("./src/common/correlated-kafka-response");
Object.defineProperty(exports, "CorrelatedKafkaResponse", { enumerable: true, get: function () { return __importDefault(correlated_kafka_response_1).default; } });
