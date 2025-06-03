import kafkaService from './kafka.service';

export async function disconnectKafka() {
  await kafkaService.disconnectConsumer();
  await kafkaService.disconnectProducer();
}

export async function runKafka() {
  await kafkaService.runConsumer();
}

export default kafkaService;
