import {
    CompositeMessageQueueGateway,
} from "#app/composite-message-queue-gateway.js";

export class PublisherService
{
    constructor(
        private readonly gateway: CompositeMessageQueueGateway,
    )
    {}

    async publish(message: string, queueName: string)
    {
        await this.gateway.publish(
            message,
            queueName,
        );
    }

    async subscribe(queueName: string, handler: (message: string) => Promise<void>)
    {
        await this.gateway.subscribe(
            queueName,
            handler,
        );
    }
}
