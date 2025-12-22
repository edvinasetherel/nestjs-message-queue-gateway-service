import { MessageQueueProvider } from "#app/ports/driven/message-queue-provider.js";
import UnrecognizedQueueError from "#app/unrecognized-queue-error.js";

export class CompositeMessageQueueGateway
{
    private readonly __queueNameProviders: Record<string, MessageQueueProvider[]>;
    constructor(
        providers: MessageQueueProvider[],
    )
    {
        this.__queueNameProviders = {};
        providers.forEach((provider) =>
        {
            if (this.__queueNameProviders[provider.queueName] === undefined)
            {
                this.__queueNameProviders[provider.queueName] = [];
            }
            this.__queueNameProviders[provider.queueName].push(provider);
        });
    }

    async publish(message: string, queueName: string): Promise<void>
    {
        if (this.__queueNameProviders[queueName] === undefined)
        {
            throw new UnrecognizedQueueError(queueName);
        }
        for (const provider of this.__queueNameProviders[queueName])
        {
            await provider.publish(message, queueName);
        }
    }

    async subscribe(handler: (message: string) => Promise<void>, queueName: string): Promise<void>
    {
        if (this.__queueNameProviders[queueName] === undefined)
        {
            throw new UnrecognizedQueueError(queueName);
        }
        for (const provider of this.__queueNameProviders[queueName])
        {
            await provider.subscribe(handler, queueName);
        }
    }
}
