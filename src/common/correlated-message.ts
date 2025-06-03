import { ZodError } from 'zod';
import { v4 as uuidv4 } from 'uuid';

import kafkaService from '../services/kafka';
import {
  CorrelatedRequestDTO,
  CorrelatedResponseDTO,
  CorrelatedRequestDTOSchema,
  CorrelatedResponseDTOSchema
} from '../types/correlated.dto';

function isErrorWithCode(error: unknown): error is { code: number } {
  return (
    typeof error === 'object' &&
    error !== null &&
    Object.prototype.hasOwnProperty.call(error, 'code') &&
    typeof (error as Record<string, unknown>).code === 'number'
  );
}

export async function sendCorrelatedResponseViaKafka(
  topic: string,
  data: CorrelatedRequestDTO,
  error: unknown | null
): Promise<string> {
  let errorMessage = '';
  let status = 0;
  if (error !== null) {
    errorMessage = error instanceof Error ? error.message : 'Internal Server Error';
    if (error instanceof ZodError) {
      status = 400;
    } else if (isErrorWithCode(error)) {
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

  await kafkaService.sendMessage(topic, response);

  return data.request_id;
}

export async function sendCorrelatedRequestViaKafka(
  topic: string,
  data: CorrelatedRequestDTO
): Promise<string> {
  if (!data.request_id) {
    data.request_id = uuidv4();
  }

  await kafkaService.sendMessage(topic, data);

  return data.request_id;
}

export function validateCorrelatedRequestDTO(data: CorrelatedRequestDTO): void {
  CorrelatedRequestDTOSchema.parse(data);
}

export function validateCorrelatedResponseDTO(data: CorrelatedResponseDTO): void {
  CorrelatedResponseDTOSchema.parse(data);
}
