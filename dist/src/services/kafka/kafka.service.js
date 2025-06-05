"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const kafkajs_1 = require("kafkajs");
const common_loggers_pkg_1 = require("common-loggers-pkg");
class KafkaService {
    constructor() {
        this.topicHandlers = {};
        this.isProducerConnected = false;
        this.isConsumerConnected = false;
        this.retryLimit = 3;
        const clientId = process.env.KAFKA_CLIENT_ID;
        const broker = process.env.KAFKA_BROKER;
        if (!clientId || !broker) {
            throw new Error('Kafka initialization error: KAFKA_CLIENT_ID and/or KAFKA_BROKER are missing from environment variables.');
        }
        const kafka = new kafkajs_1.Kafka({
            clientId,
            brokers: [broker],
            logLevel: kafkajs_1.logLevel.ERROR,
            logCreator: this.createLogger(),
        });
        this.producer = kafka.producer();
        this.consumer = kafka.consumer({ groupId: `${clientId}-group` });
        this.admin = kafka.admin();
    }
    async createTopics(topics) {
        await this.admin.connect();
        const existingTopics = await this.admin.listTopics();
        const newTopics = topics.filter(({ topic }) => !existingTopics.includes(topic));
        if (newTopics.length > 0) {
            await this.admin.createTopics({
                topics: newTopics.map(({ topic, numPartitions, replicationFactor }) => ({
                    topic,
                    numPartitions,
                    replicationFactor,
                })),
            });
        }
        await this.admin.disconnect();
    }
    async connectProducer() {
        if (this.isProducerConnected) {
            return;
        }
        try {
            await this.producer.connect();
            this.isProducerConnected = true;
            common_loggers_pkg_1.logger.info('Producer connected to Kafka');
        }
        catch (error) {
            common_loggers_pkg_1.logger.error('Error initializing Kafka Producer:', error);
        }
    }
    async sendMessage(topic, message) {
        await this.connectProducer();
        await this.producer.send({
            topic,
            messages: [{ value: JSON.stringify(message) }],
        });
        common_loggers_pkg_1.kafkaLogger.info(`Message sent: ${JSON.stringify(message)} to ${topic}`);
    }
    async disconnectProducer() {
        if (!this.isProducerConnected) {
            return;
        }
        await this.producer.disconnect();
        common_loggers_pkg_1.logger.info('Kafka producer disconnected');
    }
    async connectConsumer() {
        if (this.isConsumerConnected) {
            return;
        }
        try {
            await this.consumer.connect();
            this.isConsumerConnected = true;
            common_loggers_pkg_1.logger.info('Consumer connected to Kafka');
        }
        catch (error) {
            common_loggers_pkg_1.logger.error('Error initializing Kafka Consumer:', error);
        }
    }
    subscribe(topics) {
        Object.assign(this.topicHandlers, topics);
    }
    async runConsumer() {
        if (!Object.keys(this.topicHandlers).length) {
            return;
        }
        await this.connectConsumer();
        const topicsKeys = Object.keys(this.topicHandlers);
        await this.consumer.subscribe({
            topics: topicsKeys,
            fromBeginning: false,
        });
        common_loggers_pkg_1.logger.info('Subscribed to Kafka topics: ' + topicsKeys.join(', '));
        await this.consumer.run({
            eachMessage: async ({ topic, message }) => {
                common_loggers_pkg_1.kafkaLogger.info(`Received message: ${message.value?.toString()} from ${topic}`);
                if (this.topicHandlers[topic]) {
                    try {
                        const parsedMessage = JSON.parse(message.value.toString());
                        const retryCount = parsedMessage.retryCount || 0;
                        try {
                            await this.topicHandlers[topic](parsedMessage);
                            common_loggers_pkg_1.kafkaLogger.info(`Message processed successfully for topic ${topic}`);
                        }
                        catch (processingError) {
                            common_loggers_pkg_1.kafkaLogger.error(`Error processing message for topic ${topic}:`, processingError);
                            if (retryCount < this.retryLimit) {
                                // Retry the message by sending it back to the same topic
                                common_loggers_pkg_1.kafkaLogger.warn(`Retrying message for topic ${topic} (Attempt: ${retryCount + 1})`);
                                await this.producer.send({
                                    topic,
                                    messages: [
                                        {
                                            value: JSON.stringify({
                                                ...parsedMessage,
                                                retryCount: retryCount + 1,
                                            }),
                                        },
                                    ],
                                });
                            }
                            else {
                                common_loggers_pkg_1.kafkaLogger.error(`Max retry attempts reached for topic ${topic}}`);
                            }
                        }
                    }
                    catch (parsingError) {
                        common_loggers_pkg_1.kafkaLogger.error(`Failed to parse message for topic ${topic}`, parsingError);
                    }
                }
                else {
                    common_loggers_pkg_1.kafkaLogger.warn(`No handler defined for topic: ${topic}`);
                }
            },
        });
    }
    async disconnectConsumer() {
        if (!this.isConsumerConnected) {
            return;
        }
        await this.consumer.disconnect();
        common_loggers_pkg_1.logger.info('Kafka consumer disconnected');
    }
    createLogger() {
        const kafkaLogLevelMap = {
            [kafkajs_1.logLevel.ERROR]: 'error',
            [kafkajs_1.logLevel.WARN]: 'warn',
            [kafkajs_1.logLevel.INFO]: 'info',
            [kafkajs_1.logLevel.DEBUG]: 'debug',
            [kafkajs_1.logLevel.NOTHING]: '',
        };
        return (entryLevel) => ({ namespace, level, label, log }) => {
            const { message, ...extra } = log;
            // Map Kafka log levels to Winston and log the message
            common_loggers_pkg_1.logger.log({
                level: kafkaLogLevelMap[level] || 'info',
                message: `[${namespace}] ${label}: ${message}`,
                ...extra, // Include additional log details
            });
        };
    }
}
exports.default = new KafkaService();
