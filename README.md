<h1 align="center">
    Messaging Queue Gateway
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

## Project setup
<!-- TODO -->
## Compile and run the project
<!-- TODO -->
## Run tests
<!-- TODO -->
## Deployment
<!-- TODO -->
## License

Project is [MIT licensed](./LICENSE).
