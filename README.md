<h1 align="center">
    Message Queue Gateway Service
</h1>

<img src="https://img.shields.io/badge/License-MIT-brightgreen.svg" alt="License"/>
<br>
<img src="https://img.shields.io/badge/Purpose-Demo%20Project-lightgrey.svg" />


## Description
A Nest.js REST API that:
- Can publish to messages on a queue
- Can subscribe to messages on a queue
- Security aspect ignored
- Ability to swap out queue implementations based on environment variables e.g. SQS, RabbitMQ
- Changing queue providers should not require any code changes
- Should be runnable with docker compose file to emulate and run the environment

## Tech
- Typescript
- Vitest for testing purposes
- NestJS framework for the service implementation
- Eslint for formatting and linting through ESLint Stylistic

## Quick Start

### Prerequisites

- Node.js 22+ (Uses native `--env-file` support)
- Docker and Docker Compose

### Project Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd nestjs-message-queue-gateway-service
   ```

2. **Install dependencies**
   ```bash
   npm ci
   ```

3. **Configure environment variables**

    Edit `config/.env` if necessary.

## Running the Application

### Option 1: Using Docker Compose

This will start the application along with RabbitMQ and LocalStack (SQS emulator):

```bash
  npm run start:docker
```

The application will be available at `http://HOST:HOST_PORT` based on environment variables
Default env. file values equals to `http://localhost:3000`

### Option 2: Running Locally


```bash
  npm run start:prod
```
And set `MESSAGE_QUEUE_RABBITMQ_ACTIVE` and `MESSAGE_QUEUE_SQS_ACTIVE` to `0` if you want to run with dummy providers.
Otherwise it will fail to start unless you will have the rabbitmq and localstack running, or both.
## Configuration

The application is configured via environment variables. These can be placed in a `.env` file in the `config` directory

| Variable | Description | Example |
|----------|-------------|---------|
| `HOST` | The host the server binds to | `0.0.0.0` |
| `HOST_PORT` | The port the server listens on | `3000` |
| `MESSAGE_QUEUE_RABBITMQ_ACTIVE` | Enable/Disable RabbitMQ provider (`1` or `0`) | `1` |
| `MESSAGE_QUEUE_RABBITMQ_URL` | RabbitMQ connection URL | `amqp://guest:guest@localhost:5672` |
| `MESSAGE_QUEUE_RABBITMQ_QUEUES` | Comma-separated list of available RabbitMQ queues | `Queue-0,Queue-1` |
| `MESSAGE_QUEUE_SQS_ACTIVE` | Enable/Disable SQS provider (`1` or `0`) | `1` |
| `MESSAGE_QUEUE_SQS_ENDPOINT` | SQS endpoint (LocalStack or AWS) | `http://localhost:4566` |
| `MESSAGE_QUEUE_SQS_REGION` | AWS Region for SQS | `us-east-1` |
| `MESSAGE_QUEUE_SQS_QUEUES` | Comma-separated list of available SQS queues | `Queue-0,Queue-1` |
| `AWS_ACCESS_KEY_ID` | AWS Access Key (required for SQS) | `test` |
| `AWS_SECRET_ACCESS_KEY` | AWS Secret Key (required for SQS) | `test` |

## API Endpoints

## Publisher API


Use this API to publish messages to the queues

### Post a message

Post a message to the queues (JSON request body required)

```plaintext
POST /messages
```

Supported attributes:

| Attribute   | Type     | Required | Description                               |
|-------------|----------|----------|-------------------------------------------|
| `queueName` | string   | Yes      | The name of the queue to post the message |
| `content`   |  string  | Yes      | The content of message                    |

If successful, returns `202` and the following
In case of malformed request or error, returns `400` any other issue `500`

Example request:

```shell
  curl -X POST http://localhost:3000/messages \
    -H "Content-Type: application/json" \
    -d '{"queueName": "Queue-0", "content": "Hello, World!"}'
```

## Subscriber API

Use this API to subscribe to the queues

### Subscribe to the queues

Subscribes to the queue specified in the JSON request body

```plaintext
POST /subscribe
```

Supported attributes:

| Attribute   | Type     | Required | Description                           |
|-------------|----------|----------|---------------------------------------|
| `queueName` | string   | Yes      | The name of the queue to subscribe to |

If successful, returns `202` and the following
In case of malformed request or error, returns `400`,
in case already subscribed to it or missing - `404`,
any other issue `500`

Example request:

```shell
  curl -X POST http://localhost:3000/subscribe \
    -H "Content-Type: application/json" \
    -d '{"queueName": "Queue-0"}'
```

## Testing

The project uses Vitest for testing

### Unit Tests
```bash
  npm run test:unit
```
Runts only unit tests
### Acceptance Tests
Acceptance tests require Docker to run infrastructure (RabbitMQ and LocalStack)

```bash
  npm run test:acceptance:pipeline
```
This command will:
1. Start Docker containers.
2. Run acceptance tests.
3. Clean up Docker containers.

Alternatively, if infrastructure is already running:
```bash
  npm run test:acceptance
```

### Coverage
```bash
  npm run test:cov
```
