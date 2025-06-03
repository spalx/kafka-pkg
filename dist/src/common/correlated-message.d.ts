import { CorrelatedRequestDTO, CorrelatedResponseDTO } from '../types/correlated.dto';
export declare function sendCorrelatedResponseViaKafka(topic: string, data: CorrelatedRequestDTO, error: unknown | null): Promise<void>;
export declare function sendCorrelatedRequestViaKafka(topic: string, data: CorrelatedRequestDTO): Promise<void>;
export declare function validateCorrelatedRequestDTO(data: CorrelatedRequestDTO): void;
export declare function validateCorrelatedResponseDTO(data: CorrelatedResponseDTO): void;
