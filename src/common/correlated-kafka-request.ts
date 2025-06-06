import { v4 as uuidv4 } from 'uuid';

import kafkaService from '../services/kafka.service';
import {
  CorrelatedRequestDTO,
  CorrelatedResponseDTO,
  CorrelatedRequestDTOSchema
} from '../types/correlated.dto';

class CorrelatedKafkaRequest {
  private pendingResponses: Map<string, (message: CorrelatedResponseDTO) => void> = new Map();
  private topic: string = '';

  constructor(topic: string) {
    this.topic = topic;
    const topicName = `did.${topic}`;

    kafkaService.subscribe({
      [topicName]: async (message: object) => {
        const response = message as CorrelatedResponseDTO;
        if (response.request_id && this.pendingResponses.has(response.request_id)) {
          const resolve = this.pendingResponses.get(response.request_id);
          if (resolve) {
            resolve(response);
            this.pendingResponses.delete(response.request_id);
          }
        }
      }
    });
  }

  async send(
    data: CorrelatedRequestDTO,
    timeout = 10000
  ): Promise<CorrelatedResponseDTO> {
    CorrelatedRequestDTOSchema.parse(data);

    if (!data.request_id) {
      data.request_id = uuidv4();
    }

    return new Promise<CorrelatedResponseDTO>(async (resolve, reject) => {
      const timer = setTimeout(() => {
        this.pendingResponses.delete(data.request_id);
        reject(new Error(`Timeout waiting for Kafka response on ${this.topic}`));
      }, timeout);

      this.pendingResponses.set(data.request_id, (msg) => {
        clearTimeout(timer);
        resolve(msg);
      });

      try {
        await kafkaService.sendMessage(this.topic, data);
      } catch (err) {
        clearTimeout(timer);
        this.pendingResponses.delete(data.request_id);
        reject(err);
      }
    });
  }
}

export default CorrelatedKafkaRequest;
