import { CompositeMessageQueueGateway } from "#app/composite-message-queue-gateway.js";

export class MessagePublisherService
{
    constructor(
        private readonly gateway: CompositeMessageQueueGateway,
    ) {}

    async publish(message: string, queueName: string)
    {
        await this.gateway.publish(message, queueName);
    }
}
