import { z } from 'zod';

interface CorrelatedDTO {
  correlation_id: string;
}

export interface CorrelatedRequestDTO<T = object> extends CorrelatedDTO {
  request_id?: string;
  data: T;
}

export interface CorrelatedResponseDTO<T = object> extends CorrelatedDTO {
  request_id: string;
  data: T;
  status: number;
  error?: string;
}

export const CorrelatedRequestDTOSchema = z.object({
  correlation_id: z.string(),
  request_id: z.string().optional(),
  data: z.object({}),
});

export const CorrelatedResponseDTOSchema = z.object({
  correlation_id: z.string(),
  request_id: z.string(),
  data: z.object({}),
  status: z.number().int(),
  error: z.string().optional(),
});
