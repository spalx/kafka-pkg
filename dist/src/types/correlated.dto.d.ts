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
export declare const CorrelatedRequestDTOSchema: z.ZodObject<{
    correlation_id: z.ZodString;
    request_id: z.ZodOptional<z.ZodString>;
    data: z.ZodObject<{}, "strip", z.ZodTypeAny, {}, {}>;
}, "strip", z.ZodTypeAny, {
    correlation_id?: string;
    request_id?: string;
    data?: {};
}, {
    correlation_id?: string;
    request_id?: string;
    data?: {};
}>;
export declare const CorrelatedResponseDTOSchema: z.ZodObject<{
    correlation_id: z.ZodString;
    request_id: z.ZodString;
    data: z.ZodObject<{}, "strip", z.ZodTypeAny, {}, {}>;
    status: z.ZodNumber;
    error: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    error?: string;
    correlation_id?: string;
    request_id?: string;
    status?: number;
    data?: {};
}, {
    error?: string;
    correlation_id?: string;
    request_id?: string;
    status?: number;
    data?: {};
}>;
export {};
