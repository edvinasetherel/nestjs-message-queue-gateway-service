import {
    MessageQueueProvider,
} from "#app/ports/driven/message-queue-provider.js";
import ProviderError from "#adapters/driven/message-queue-provider/error.js";

export default class InMemoryMessageQueueProvider
implements MessageQueueProvider
{
    private __subscribers: ((message: string) => Promise<void>)[] = [];
    private __isClosed: boolean = false;

    constructor(
        public readonly queueName: string,
    )
    {
    }

    get isClosed()
    {
        return this.__isClosed;
    }

    async subscribe(handler: (message: string) => Promise<void>): Promise<void>
    {
        if (this.isClosed)
        {
            throw new ProviderError("Cannot subscribe to closed provider");
        }
        this.__subscribers.push(handler);
    }

    async close(): Promise<void>
    {
        this.__isClosed = true;
    }

    async publish(message: string): Promise<void>
    {
        if (this.isClosed)
        {
            throw new ProviderError("Cannot publish to closed provider");
        }
        for (const handler of this.__subscribers)
        {
            await handler(message);
        }
    }
}
