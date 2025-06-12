# kafka-pkg

Package which enables to connect to the kafka service easily.

---

## Dependencies

This package depends on the following packages:

[app-life-cycle-pkg](https://github.com/spalx/app-life-cycle-pkg)
[common-loggers-pkg](https://github.com/spalx/common-loggers-pkg)

And expects the following environment variables to be set beforehand:

`KAFKA_CLIENT_ID` - string representing the name of the client
`KAFKA_BROKER` - the connection url of the kafka broker (kafka:9092 for example)

## kafkaService

Instance of `KafkaService` used for publishing and subscribing to Kafka topics.
Since this service implements the IAppPkg interface, the recommended way of using it is by registering it in your app initialization script like this:

```ts
// appService is an instance of AppService (app-life-cycle-pkg)
appService.use(kafkaService);
```

### kafkaService methods

| Method | Argument Types | Returns | Description |
| - | - | - | - |
| `createTopics(topics)` | `topics: [{ topic, numPartitions, replicationFactor }]` | `Promise<void>` | Creates topics |
| `connectProducer()` | — | `Promise<void>` | Connects the Kafka producer |
| `sendMessage(topic, message)` | `topic: string`, `message: object` | `Promise<void>` | Sends a message |
| `disconnectProducer()` | — | `Promise<void>` | Disconnects the Kafka producer |
| `connectConsumer()` | — | `Promise<void>` | Connects the Kafka consumer |
| `subscribe(topicHandlers)` | `topicHandlers: Record<string, (message) => Promise<void>>` | `Promise<void>` | Register topic handlers |
| `runConsumer()` | — | `Promise<void>` | Starts consuming from subscribed topics |
| `disconnectConsumer()` | — | `Promise<void>` | Disconnects the Kafka consumer |

---

## CorrelatedKafkaRequest class

Helper class that allows to easily send kafka messages and receive the responses as regular JS promises.
Side effect of using this class:
- It subscribes to the destination topic name of the message + prepending a "did.". So for example, if you are sending a message to a kafka topic called "sendEmail", this class will subscribe to the topic "did.sendEmail", in order to know when the response comes back.

Recommended usage of this class in your IAppPkg class:

```ts
import {
  CorrelatedRequestDTO,
  CorrelatedResponseDTO,
  CorrelatedKafkaRequest
} from 'kafka-pkg';
import { IAppPkg } from 'app-life-cycle-pkg';

import { SomeDTO, DidSomeDTO } from '../types/some.dto';

class SomeService implements IAppPkg {
  private correlatedKafkaRequest: CorrelatedKafkaRequest | null = null;

  async init(): Promise<void> {
    if (!this.correlatedKafkaRequest) {
      this.correlatedKafkaRequest = new CorrelatedKafkaRequest('someTopic');
    }
  }

  async someMethod(data: CorrelatedRequestDTO<SomeDTO>): Promise<CorrelatedResponseDTO<DidSomeDTO>> {
    if (!this.correlatedKafkaRequest) {
      throw new Error('Service not initialized');
    }

    return await this.correlatedKafkaRequest.send(data) as CorrelatedResponseDTO<DidSomeDTO>;
  }
}

export default new SomeService();
```

---

## CorrelatedKafkaResponse class

Helper class that allows to easily send kafka response messages. Doesn't wait or have any response.

Recommended usage:

```ts
import { CorrelatedRequestDTO, CorrelatedKafkaResponse } from 'kafka-pkg';

import { SomeDTO } from './some.dto';

class SomeService {
  async someAction(requestData: CorrelatedRequestDTO<SomeDTO>): Promise<void> {
    const { correlation_id, request_id } = requestData;

    let error: unknown | null = null;

    try {
      // Some logic here
    } catch (err) {
      error = err;
    } finally {
      const responseRequest: CorrelatedRequestDTO = {
        correlation_id,
        request_id,
        data: {}
      };

      const response = new CorrelatedKafkaResponse('someTopic');
      response.send(responseRequest, error);
    }
  }
}

export default new SomeService();
```

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

### CorrelatedRequestDTOSchema

Used for validating CorrelatedRequestDTO objects.
Uses Zod library for validation.

Recommended usage:

```ts
CorrelatedRequestDTOSchema.parse(data); // This will throw an error if validation does not pass
```

---

## Imports

```ts
import {
  kafkaService,
  CorrelatedRequestDTO,
  CorrelatedResponseDTO,
  CorrelatedRequestDTOSchema,
  CorrelatedKafkaRequest,
  CorrelatedKafkaResponse
} from 'kafka-pkg';
```
