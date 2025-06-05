"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const uuid_1 = require("uuid");
const app_hook_pkg_1 = require("app-hook-pkg");
const kafka_service_1 = __importDefault(require("../services/kafka.service"));
const correlated_dto_1 = require("../types/correlated.dto");
class CorrelatedKafkaRequest {
    constructor(topic) {
        this.pendingResponses = new Map();
        this.topic = '';
        this.topic = topic;
        const topicName = `did.${topic}`;
        app_hook_pkg_1.appHookService.hookOn(app_hook_pkg_1.AppCycleEvent.Init, async () => {
            kafka_service_1.default.subscribe({
                [topicName]: async (message) => {
                    const response = message;
                    if (response.request_id && this.pendingResponses.has(response.request_id)) {
                        const resolve = this.pendingResponses.get(response.request_id);
                        if (resolve) {
                            resolve(response);
                            this.pendingResponses.delete(response.request_id);
                        }
                    }
                }
            });
        });
    }
    async send(data, timeout = 10000) {
        correlated_dto_1.CorrelatedRequestDTOSchema.parse(data);
        if (!data.request_id) {
            data.request_id = (0, uuid_1.v4)();
        }
        return new Promise(async (resolve, reject) => {
            const timer = setTimeout(() => {
                this.pendingResponses.delete(data.request_id);
                reject(new Error(`Timeout waiting for Kafka response on ${this.topic}`));
            }, timeout);
            this.pendingResponses.set(data.request_id, (msg) => {
                clearTimeout(timer);
                resolve(msg);
            });
            try {
                await kafka_service_1.default.sendMessage(this.topic, data);
            }
            catch (err) {
                clearTimeout(timer);
                this.pendingResponses.delete(data.request_id);
                reject(err);
            }
        });
    }
}
exports.default = CorrelatedKafkaRequest;
