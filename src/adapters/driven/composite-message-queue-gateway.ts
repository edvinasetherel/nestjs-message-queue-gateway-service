import { MessageQueueProvider } from "#adapters/driven/message-queue-provider.js";

export class CompositeMessageQueueGateway implements MessageQueueProvider
{
    constructor(
        private readonly providers: MessageQueueProvider[],
    )
    {}

    async publish(message: string): Promise<void>
    {
        for (const provider of this.providers)
        {
            await provider.publish(message);
        }
    }
}
