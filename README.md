# kafka-pkg

Package which enables to connect to the kafka service easily.

---

## Kafka Service

Instance of `KafkaService` used for publishing and subscribing to Kafka topics.

### KafkaService methods

| Method | Argument Types | Returns | Description |
| - | - | - | - |
| `connectProducer()` | — | `Promise<void>` | Connects the Kafka producer |
| `disconnectProducer()` | — | `Promise<void>` | Disconnects the Kafka producer |
| `connectConsumer()` | — | `Promise<void>` | Connects the Kafka consumer |
| `disconnectConsumer()` | — | `Promise<void>` | Disconnects the Kafka consumer |
| `createTopics(topics)` | `topics: [{ topic, numPartitions, replicationFactor }]` | `Promise<void>` | Creates topics |
| `sendMessage(topic, message)` | `topic: string`, `message: object` | `Promise<void>` | Sends a message |
| `subscribe(topicHandlers)` | `topicHandlers: Record<string, (message) => Promise<void>>` | `Promise<void>` | Register topic handlers |
| `runConsumer()` | — | `Promise<void>` | Starts consuming from subscribed topics |

---

### Functions

| Function | Argument Types | Returns | Description |
| - | - | - | - |
| `runKafka()` | — | `Promise<void>` | Starts consuming messages via registered handlers |
| `disconnectKafka()` | — | `Promise<void>` | Gracefully disconnects producer and consumer |
| `sendCorrelatedRequestViaKafka(topic, data)` | `topic: string`,<br>`data: CorrelatedRequestDTO` | `Promise<string>`: the request id | Sends a correlated request via Kafka |
| `sendCorrelatedResponseViaKafka(correlationId, topic, data, error)` | `topic: string`,<br>`data: CorrelatedRequestDTO`,<br>`error: unknown \ null` | `Promise<void>` | Sends a correlated response message via Kafka |
| `validateCorrelatedRequestDTO(data)` | `data: CorrelatedRequestDTO` | `void` | Validates the request data and throws an error when validation fails |

---

## DTO Interfaces

### CorrelatedRequestDTO<T> interface

| Key | Type | Possible values | Notes |
| - | - | - | - |
| correlation_id | string | — | UUID recommended |
| request_id | string | — | Optional: if not provided, one will be generated (in UUID format). |
| data | T | Any | Payload to send in request |

### CorrelatedResponseDTO<T> interface

| Key | Type | Possible values | Notes |
| - | - | - | - |
| correlation_id | string | — | |
| request_id | string | — | |
| data | T | Response object | |
| status | number | `0` = success, `400–500` = error | |
| error | string | Error message | Optional |

---

## Imports

```ts
import {
  kafkaService,
  runKafka,
  disconnectKafka,
  sendCorrelatedRequestViaKafka,
  sendCorrelatedResponseViaKafka,
  CorrelatedRequestDTO,
  CorrelatedResponseDTO,
  validateCorrelatedRequestDTO
} from 'kafka-pkg';
```
