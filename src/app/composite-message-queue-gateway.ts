import {
    MessageQueueProvider,
} from "#app/ports/driven/message-queue-provider.js";
import UnrecognizedQueueError from "#app/unrecognized-queue-error.js";

export class CompositeMessageQueueGateway
{
    private readonly __providersByQueue: Map<string, MessageQueueProvider[]>;
    constructor(
        providers: MessageQueueProvider[],
    )
    {
        this.__providersByQueue = new Map();
        providers.forEach((provider) =>
        {
            if (!this.__providersByQueue.has(provider.queueName))
            {
                this.__providersByQueue.set(
                    provider.queueName,
                    [],
                );
            }
            this.__providersByQueue.get(provider.queueName)!.push(provider);
        });
    }

    private getProviders(queueName: string): MessageQueueProvider[]
    {
        const providers = this.__providersByQueue.get(queueName);
        if (!providers)
        {
            throw new UnrecognizedQueueError(queueName);
        }
        return providers;
    }

    async publish(message: string, queueName: string): Promise<void>
    {
        const providers = this.getProviders(queueName);
        for (const provider of providers)
        {
            await provider.publish(message);
        }
    }

    async subscribe(queueName: string, handler: (message: string) => Promise<void>): Promise<void>
    {
        const providers = this.getProviders(queueName);
        for (const provider of providers)
        {
            await provider.subscribe(handler);
        }
    }
}
