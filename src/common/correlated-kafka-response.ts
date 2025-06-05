import { ZodError } from 'zod';

import kafkaService from '../services/kafka.service';
import {
  CorrelatedRequestDTO,
  CorrelatedResponseDTO
} from '../types/correlated.dto';

class CorrelatedKafkaResponse {
  private topic: string = '';

  constructor(topic: string) {
    this.topic = topic;
  }

  async send(
    data: CorrelatedRequestDTO,
    error: unknown | null
  ): Promise<void> {
    let errorMessage = '';
    let status = 0;
    if (error !== null) {
      errorMessage = error instanceof Error ? error.message : 'Internal Server Error';
      if (error instanceof ZodError) {
        status = 400;
      } else if (this.isErrorWithCode(error)) {
        status = error.code;
      } else {
        status = 500;
      }
    }

    const response: CorrelatedResponseDTO = {
      correlation_id: data.correlation_id,
      request_id: data.request_id,
      data: data.data,
      status: status,
      error: errorMessage
    };

    await kafkaService.sendMessage(`did.${this.topic}`, response);
  }

  private isErrorWithCode(error: unknown): error is { code: number } {
    return (
      typeof error === 'object' &&
      error !== null &&
      Object.prototype.hasOwnProperty.call(error, 'code') &&
      typeof (error as Record<string, unknown>).code === 'number'
    );
  }
}

export default CorrelatedKafkaResponse;
