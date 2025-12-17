import { MessageQueueGateway } from "@/app/ports/driven/message-queue-gateway.js";

export class InMemoryMessageQueueGateway
implements MessageQueueGateway
{
    private readonly __queue: string[];
    constructor(
    )
    {
        this.__queue = [];
    }

    get queue(): string[]
    {
        return this.__queue;
    }

    async publish(message: string): Promise<void>
    {
        this.__queue.push(message);
    }
}
