import { IMessageQueueGateway } from "@/ports/driven/IMessageQueueGateway.js";

export class InMemoryMessageQueueGateway implements IMessageQueueGateway
{
    private readonly __queue: string[];
    constructor(
    )
    {
        this.__queue = [];
    }

    async publish(message: string): Promise<void>
    {
        this.__queue.push(message);
    }
}
