import { CorrelatedRequestDTO, CorrelatedResponseDTO } from '../types/correlated.dto';
declare class CorrelatedKafkaRequest {
    private pendingResponses;
    private topic;
    constructor(topic: string);
    send(data: CorrelatedRequestDTO, timeout?: number): Promise<CorrelatedResponseDTO>;
}
export default CorrelatedKafkaRequest;
