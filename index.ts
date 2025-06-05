import { appHookService, AppCycleEvent } from 'app-hook-pkg';

import kafkaService from './src/services/kafka.service';

appHookService.hookOn(AppCycleEvent.Init, async () => {
  await kafkaService.connectProducer();
  await kafkaService.connectConsumer();
}, false);

appHookService.hookOn(AppCycleEvent.Shutdown, async () => {
  await kafkaService.disconnectProducer();
  await kafkaService.disconnectConsumer();
}, false);

export { kafkaService };
export { CorrelatedRequestDTO, CorrelatedResponseDTO } from './src/types/correlated.dto';
export { default as CorrelatedKafkaRequest } from './src/common/correlated-kafka-request';
export { default as CorrelatedKafkaResponse } from './src/common/correlated-kafka-response';
