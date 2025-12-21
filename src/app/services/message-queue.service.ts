import { CompositeMessageQueueGateway } from "#app/composite-message-queue-gateway.js";

export class MessageQueueService
{
    constructor(
        private readonly gateway: CompositeMessageQueueGateway,
    ) {}

    async publish(message: string)
    {
        await this.gateway.publish(message);
    }
}
