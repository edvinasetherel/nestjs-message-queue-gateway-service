import { MessageQueueProvider } from "#app/ports/driven/message-queue-provider.js";


export class CompositeMessageQueueGateway
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
