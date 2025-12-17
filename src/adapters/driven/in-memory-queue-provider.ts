import { MessageQueueProvider } from "@/adapters/driven/message-queue-provider.js";

export default class InMemoryQueueProvider
implements MessageQueueProvider
{
    private readonly queue: string[];

    constructor()
    {
        this.queue = [];
    }

    async publish(message: string): Promise<void>
    {
        this.queue.push(message);
    }
}
