import { KafkaMessage } from 'kafkajs';
declare class KafkaService {
    private topicHandlers;
    private isProducerConnected;
    private isConsumerConnected;
    private producer;
    private consumer;
    private admin;
    private readonly retryLimit;
    constructor();
    createTopics(topics: {
        topic: string;
        numPartitions: number;
        replicationFactor: number;
    }[]): Promise<void>;
    connectProducer(): Promise<void>;
    sendMessage(topic: string, message: object): Promise<void>;
    disconnectProducer(): Promise<void>;
    connectConsumer(): Promise<void>;
    subscribe(topics: Record<string, (message: KafkaMessage) => Promise<void>>): Promise<void>;
    runConsumer(): Promise<void>;
    disconnectConsumer(): Promise<void>;
    private createLogger;
}
declare const _default: KafkaService;
export default _default;
