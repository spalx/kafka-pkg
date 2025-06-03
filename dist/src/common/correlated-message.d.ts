import { CorrelatedRequestDTO } from '../types/correlated.dto';
export declare function sendCorrelatedResponseViaKafka(topic: string, data: CorrelatedRequestDTO, error: unknown | null): Promise<void>;
export declare function sendCorrelatedRequestViaKafka(topic: string, data: CorrelatedRequestDTO): Promise<string>;
export declare function validateCorrelatedRequestDTO(data: CorrelatedRequestDTO): void;
