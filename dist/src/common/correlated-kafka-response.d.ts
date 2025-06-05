import { CorrelatedRequestDTO } from '../types/correlated.dto';
declare class CorrelatedKafkaResponse {
    private topic;
    constructor(topic: string);
    send(data: CorrelatedRequestDTO, error: unknown | null): Promise<void>;
    private isErrorWithCode;
}
export default CorrelatedKafkaResponse;
