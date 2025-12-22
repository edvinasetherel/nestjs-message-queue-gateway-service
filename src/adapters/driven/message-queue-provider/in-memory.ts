import { MessageQueueProvider } from "#app/ports/driven/message-queue-provider.js";

export default class InMemoryMessageQueueProvider
implements MessageQueueProvider
{
    private readonly __queue: string[];

    constructor()
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
