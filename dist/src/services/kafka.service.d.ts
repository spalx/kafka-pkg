import { KafkaMessage } from 'kafkajs';
import { IAppPkg } from 'app-life-cycle-pkg';
declare class KafkaService implements IAppPkg {
    private topicHandlers;
    private isProducerConnected;
    private isConsumerConnected;
    private producer;
    private consumer;
    private admin;
    private readonly retryLimit;
    constructor();
    init(): Promise<void>;
    shutdown(): Promise<void>;
    createTopics(topics: {
        topic: string;
        numPartitions: number;
        replicationFactor: number;
    }[]): Promise<void>;
    connectProducer(): Promise<void>;
    sendMessage(topic: string, message: object): Promise<void>;
    disconnectProducer(): Promise<void>;
    connectConsumer(): Promise<void>;
    subscribe(topics: Record<string, (message: KafkaMessage) => Promise<void>>): void;
    runConsumer(): Promise<void>;
    disconnectConsumer(): Promise<void>;
    private createLogger;
}
declare const _default: KafkaService;
export default _default;
